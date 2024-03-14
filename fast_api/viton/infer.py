import torch
import torch.nn as nn
import torch.nn.functional as F

import os
from collections import namedtuple

from .gmm import GMM
from .unet import UnetGenerator
from .utilities import load_checkpoint
from .datasets import CPDataset

from PIL import Image

def get_model_opt(use_cuda=False) -> namedtuple:
    options = namedtuple('options', ['fine_width', 'fine_height', 'radius', 'grid_size', 'use_cuda'])
    return options(fine_width=192, fine_height=256, radius=5, grid_size=5, use_cuda=use_cuda)


def save_img(arr, path, grayscale=False) -> None:
    if grayscale:
        arr = arr.squeeze(2)
    
    arr = (arr * 255).to(torch.uint8) # (0, 1) -> (0, 255)
    im = Image.fromarray(arr.numpy())
    im.save(path)


def make_inference(cloth_name, img_name, use_cuda=False) -> dict[str]:
    model_opts = get_model_opt(use_cuda=use_cuda)

    output_path = "result"
    os.makedirs(output_path, exist_ok=True)

    path_dict: dict[str] = {
        "cloth_img": os.path.join("data", "cloth", cloth_name),
        "person_img": os.path.join("data", "image", img_name),
        "parse_img": os.path.join("data", "image-parse", img_name.replace(".jpg", ".png")),
        "head_img": os.path.join(output_path, "head.jpg"),
        "shape_img": os.path.join(output_path, "shape.jpg"),
        "pose_keypoints_img": os.path.join(output_path, "pose_keypoints.jpg"),
        "warp_cloth_img": os.path.join(output_path, "warp_cloth.jpg"),
        "warp_mask_img": os.path.join(output_path, "warp_mask.jpg"),
        "warp_grid_img": os.path.join(output_path, "warp_gird.jpg"),
        "gmm_overlay_img": os.path.join(output_path, "gmm_overlay.jpg"),
        "render_img": os.path.join(output_path, "render.jpg"),
        "tryon_img": os.path.join(output_path, "tryon.jpg"),
    }

    pretrained_gmm_path = os.path.join("pretrained_models", "gmm_final.pth")
    pretrained_tom_path = os.path.join("pretrained_models", "tom_final.pth")

    data_loader = CPDataset()

    inputs = data_loader.get_data(cloth_name, img_name)

    save_img( ( inputs["head"].detach().permute(1, 2, 0) * 0.5 ) + 0.5, path_dict["head_img"] )
    save_img( ( inputs["shape"].detach().permute(1, 2, 0) * 0.5 ) + 0.5, path_dict["shape_img"], grayscale=True )
    save_img( ( inputs["pose_image"].detach().permute(1, 2, 0) * 0.5 ) + 0.5, path_dict["pose_keypoints_img"], grayscale=True )

    if use_cuda:
        agnostic = inputs["agnostic"].cuda()
        c = inputs["cloth"].cuda()
        cm = inputs["cloth_mask"].cuda()
        im_g = inputs["grid_image"].cuda()
    else:
        agnostic = inputs["agnostic"]
        c = inputs["cloth"]
        cm = inputs["cloth_mask"]
        im_g = inputs["grid_image"]

    im = inputs["image"]

    # make batch=1
    agnostic.unsqueeze_(0)
    c.unsqueeze_(0)
    cm.unsqueeze_(0)
    im_g.unsqueeze_(0)

    # GMM predictions
    model = GMM(model_opts)
    load_checkpoint(model, pretrained_gmm_path, use_cuda)

    with torch.no_grad():
        grid, _ = model(agnostic, c)

        warped_cloth = F.grid_sample(c, grid, padding_mode="border", align_corners=False)
        warped_mask = F.grid_sample(cm, grid, padding_mode="zeros", align_corners=False)
        warped_grid = F.grid_sample(im_g, grid, padding_mode="zeros", align_corners=False)

    save_img( ( warped_cloth.squeeze(0).detach().cpu().permute(1, 2, 0) * 0.5 ) + 0.5, path_dict["warp_cloth_img"] )
    save_img( ( warped_mask.squeeze(0).detach().cpu().permute(1, 2, 0) * 0.5 ) + 0.5, path_dict["warp_mask_img"], grayscale=True )
    save_img( ( warped_grid.squeeze(0).detach().cpu().permute(1, 2, 0) * 0.5 ) + 0.5, path_dict["warp_grid_img"] )

    # TOM predictions
    model_tom = UnetGenerator(25, 4, 6, ngf=64, norm_layer=nn.InstanceNorm2d)
    load_checkpoint(model_tom, pretrained_tom_path, use_cuda)

    with torch.no_grad():
        outputs = model_tom(torch.cat([agnostic, warped_cloth], 1))
        p_rendered, m_composite = torch.split(outputs, 3, 1)
        p_rendered = F.tanh(p_rendered)
        m_composite = F.sigmoid(m_composite)
        p_tryon = warped_cloth * m_composite + p_rendered * (1 - m_composite)

    gmm_overlay = warped_cloth + im
    gmm_overlay = gmm_overlay / torch.max(gmm_overlay)
    save_img( ( gmm_overlay.squeeze(0).detach().cpu().permute(1, 2, 0) * 0.5 ) + 0.5, path_dict["gmm_overlay_img"] )
    save_img( ( p_rendered.squeeze(0).detach().cpu().permute(1, 2, 0) * 0.5 ) + 0.5, path_dict["render_img"] )
    save_img( ( p_tryon.squeeze(0).detach().cpu().permute(1, 2, 0) * 0.5 ) + 0.5, path_dict["tryon_img"] )

    return path_dict
