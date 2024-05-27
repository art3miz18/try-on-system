import torch
import torch.utils.data as data
import torchvision.transforms as transforms

from PIL import Image
from PIL import ImageDraw

import os.path as osp
import numpy as np
import json


class CPDataset(data.Dataset):
    """
        Dataset for CP-VTON.
    """

    def __init__(self):
        super().__init__()

        self.fine_height    = 256
        self.fine_width     = 192
        self.radius         = 5
        self.data_path      = "Dataset"
        self.grid_path      = osp.join("viton", "grid.png")

        self.transformRGB = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize(
                (0.5, 0.5, 0.5),
                (0.5, 0.5, 0.5)
            )
        ])  
        self.transformL = transforms.Compose([
            transforms.ToTensor(),
            transforms.Normalize(
                (0.5, ),
                (0.5, )
            )
        ])


    def name(self):
        return "CPDataset"

    def get_data(self, cloth_name, img_name):
        c   = Image.open(osp.join(self.data_path, "cloth", cloth_name))
        cm  = Image.open(osp.join(self.data_path, "cloth-mask", cloth_name))

        c = self.transformRGB(c)  # [-1,1]
        cm_array = np.array(cm)
        cm_array = (cm_array >= 128).astype(np.float32)
        cm = torch.from_numpy(cm_array) # [0,1]
        cm.unsqueeze_(0)

        # person image 
        im = Image.open(osp.join(self.data_path, "image", img_name))
        im = self.transformRGB(im) # [-1,1]

        # load parsing image
        parse_name  = img_name.replace(".jpg", ".png")
        im_parse    = Image.open(osp.join(self.data_path, "image-parse", parse_name))
        parse_array = np.array(im_parse)
        parse_shape = (parse_array > 0).astype(np.float32)
        parse_head  = (parse_array == 1).astype(np.float32) + \
                      (parse_array == 2).astype(np.float32) + \
                      (parse_array == 4).astype(np.float32) + \
                      (parse_array == 13).astype(np.float32)
        parse_cloth = (parse_array == 5).astype(np.float32) + \
                      (parse_array == 6).astype(np.float32) + \
                      (parse_array == 7).astype(np.float32)

        # shape down sample
        parse_shape = Image.fromarray((parse_shape * 255).astype(np.uint8))
        parse_shape = parse_shape.resize((self.fine_width // 16, self.fine_height // 16), Image.BILINEAR)
        parse_shape = parse_shape.resize((self.fine_width, self.fine_height), Image.BILINEAR)
        shape = self.transformL(parse_shape) # [-1,1]
        phead = torch.from_numpy(parse_head) # [0,1]
        pcm = torch.from_numpy(parse_cloth) # [0,1]

        # upper cloth
        im_c = im * pcm + (1 - pcm) # [-1,1], fill 1 for other parts
        im_h = im * phead - (1 - phead) # [-1,1], fill 0 for other parts

        # load pose points
        pose_name = img_name.replace(".jpg", "_keypoints.json")
        with open(osp.join(self.data_path, "pose", pose_name), "r") as f:
            pose_label = json.load(f)
            pose_data = pose_label["people"][0]["pose_keypoints"]
            pose_data = np.array(pose_data)
            pose_data = pose_data.reshape((-1, 3)) # shape: (18, 3)

        point_num = pose_data.shape[0]
        pose_map = torch.zeros(point_num, self.fine_height, self.fine_width)
        r = self.radius
        im_pose = Image.new("L", (self.fine_width, self.fine_height))
        pose_draw = ImageDraw.Draw(im_pose)
        for i in range(point_num):
            one_map = Image.new("L", (self.fine_width, self.fine_height))
            draw = ImageDraw.Draw(one_map)
            pointx = pose_data[i,0]
            pointy = pose_data[i,1]

            if pointx > 1 and pointy > 1:
                draw.rectangle((pointx-r, pointy-r, pointx+r, pointy+r), "white", "white")
                pose_draw.rectangle((pointx-r, pointy-r, pointx+r, pointy+r), "white", "white")

            one_map = self.transformL(one_map)
            pose_map[i] = one_map[0]

        # just for visualization
        im_pose = self.transformL(im_pose)

        # cloth-agnostic representation
        agnostic = torch.cat([shape, im_h, pose_map], 0)

        im_g = Image.open(self.grid_path)
        im_g = self.transformL(im_g)

        result = {
            "c_name"      : cloth_name,     # for visualization
            "im_name"     : img_name,       # for visualization or ground truth
            "cloth"       : c,              # for input
            "cloth_mask"  : cm,             # for input
            "image"       : im,             # for visualization
            "agnostic"    : agnostic,       # for input
            "parse_cloth" : im_c,           # for ground truth
            "shape"       : shape,          # for visualization
            "head"        : im_h,           # for visualization
            "pose_image"  : im_pose,        # for visualization
            "grid_image"  : im_g,           # for visualization
            "parse_image" : im_parse,       # for visualization
        }

        return result

    def __len__(self):
        return len(self.img_names)

