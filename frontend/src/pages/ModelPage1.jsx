import { useState } from "react";
import ImageGallery from "../components/ImageGallery";
import Form from "../components/Form";

const server_base_url = "http://localhost:8000";

export default function ModelPage() {
    const [result, setResult] = useState([])
    const [cloth, setCloth] = useState("")
    const [image, setImage] = useState("")
    const [reloadKey, setReloadKey] = useState(0)

    const getInference = async (payload) => {
        const options = {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        }

        try {
            const p = await fetch(`${server_base_url}/viton/infer`, options);
            const response = await p.json();
            return response;
        } catch (error) {
            console.error("(getInference): ", error);
        }
    }

    const generateImages = async (e) => {
        e.preventDefault();

        const payload = {
            "cloth_name": cloth,
            "img_name": image
        };

        try {
            const data = await getInference(payload);
            setResult(data);
            setReloadKey(key => key + 1);
        } catch (error) {
            console.log("(generateImages) Error: ", error);
        }
    }

    const displayResult = () => {
        return Object.entries(result).map(([key, value]) => {
            // console.log(value);
            return (
                <div key={key}>
                    <h4 style={ResultTitleStyle}>{key}</h4>
                    <img style={ImageCardStyle} src={`${server_base_url}/${value}`} alt={key} />
                </div>
            )
        });
    }

    return (
        <div style={ContainerStyle}>
            <aside>
                <section style={SectionStyle}>
                    <h2 style={TitleStyle}>Cloths</h2>
                    <ImageGallery url={"http://localhost:8000/cloths"} setFileName={setCloth} />
                </section>

                <section style={SectionStyle}>
                    <h2 style={TitleStyle}>Images</h2>
                    <ImageGallery url={"http://localhost:8000/images"} setFileName={setImage} />
                </section>
            </aside>
            <main>
                <h1 style={TitleStyle}>VITON</h1>
                <Form
                    cloth={cloth}
                    setParentCloth={setCloth}
                    image={image}
                    setParentImage={setImage}
                    onSubmit={generateImages}
                />
                <div key={reloadKey} style={ResultContainerStyle} >
                    {displayResult()}
                </div>
            </main>
        </div>
    );
}

const ContainerStyle = {
    display: "flex",
    overflow: "none",
}

const SectionStyle = {
    display: "flex",
    flexDirection: "column",
    width: "min-content",
    paddingRight: "5rem",
}

const TitleStyle = {
    textTransform: "uppercase",
    width: "inherit",
    paddingLeft: "270px",
    margin: "3.5rem 0 1rem 0",
}

const ResultContainerStyle = {
    display: "flex",
    flexDirection: "row",
    flexWrap: "Wrap",
    justifyContent: "space-around",
    width: "830px",
}

const ImageCardStyle = {
    border: "1px solid black",
    boxShadow: "3px 5px 1px brown",
    height: "215px",
    margin: "5px",
};

const ResultTitleStyle = {
    textTransform: "uppercase",
    width: "inherit",
}
