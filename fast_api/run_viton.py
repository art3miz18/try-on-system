from viton import infer
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware


server = FastAPI()
server.mount("/images", StaticFiles(directory="."), name="images")

# Allow all origins in this example; adjust as needed for security.
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
    target_img: str
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


@server.post("/viton/infer")
def make_inference(opt: VitonInputParameters) -> VitonInference:
    result_paths = infer.make_inference(opt.cloth_name, opt.img_name)

    for key, value in result_paths.items():
        result_paths[key] = f"/images/{value}"

    return result_paths


# data size: 16253
