import os
from pydantic import BaseModel
from typing import Annotated
from viton import infer
from fastapi import FastAPI, Body
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


server = FastAPI()
server.mount("/data", StaticFiles(directory="."), name="data")


server.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class VitonInputParameters(BaseModel):
    cloth_name: str
    img_name: str


class VitonInference(BaseModel):
    cloth_img: str
    person_img: str
    parse_img: str
    head_img: str
    shape_img: str
    pose_keypoints_img: str
    warp_cloth_img: str
    warp_mask_img: str
    warp_grid_img: str
    gmm_overlay_img: str
    render_img: str
    tryon_img: str


class ImageFile(BaseModel):
    id: str
    title: str
    url: str


class ImagePath(BaseModel):
    type: str
    files: list[ImageFile]


@server.post("/viton/infer", response_model=VitonInference)
def make_inference(
    opt: Annotated[
        VitonInputParameters,
        Body(
            title="VITON input image names",
            description="Takes two parameters as input that are needed by VITON model to make inference",
        ),
    ],
):
    result_paths = infer.make_inference(opt.cloth_name, opt.img_name)

    for key, value in result_paths.items():
        result_paths[key] = f"data/{value}"

    return result_paths


@server.get("/cloths", response_model=ImagePath)
def get_cloths():
    cloth_paths = os.path.join("data", "cloth_names.txt")
    with open(cloth_paths, "r") as file:
        cloth_dict =  [ {
            "id": cloth.removesuffix("_1.jpg"),
            "title": cloth,
            "url": f"data/{os.path.join("data", "cloth", cloth)}",
        } for cloth in file.read().splitlines() ]

    return {
        "type": "cloth",
        "files": cloth_dict
    }


@server.get("/images", response_model=ImagePath)
def get_images():
    img_paths = os.path.join("data", "image_names.txt")
    with open(img_paths, "r") as file:
        img_dict =  [ {
            "id": img.removesuffix("_0.jpg"),
            "title": img,
            "url": f"data/{os.path.join("data", "image", img)}",
        } for img in file.read().splitlines() ]

    return {
        "type": "image",
        "files": img_dict
    }
