import { useState, useEffect } from "react";
import ImageGallery from "../components/ImageGallery";
import Form from "../components/Form";


const server_base_url = "http://localhost:8000";

export default function ModelPage() {
    const [result, setResult] = useState([]);
    const [cloth, setCloth] = useState("");
    const [image, setImage] = useState("");
    const [selectedModelImage, setSelectedModelImage] = useState("");
    const [reloadKey, setReloadKey] = useState(0);

    const getInference = async (payload) => {
        const options = {
            method: "POST",
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        };

        try {
            const p = await fetch(`${server_base_url}/viton/infer`, options);
            const response = await p.json();
            return response;
        } catch (error) {
            console.error("(getInference): ", error);
        }
    };

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
    };


    

    const displayResult = () => {
        return Object.entries(result).map(([key, value]) => {
            return (
                <div key={key} style={ResultGridItemStyle}>
                    <p style={ResultTitleStyle}>{key}</p>
                    <img style={ImageCardStyle} src={`${server_base_url}/${value}`} alt={key} />
                </div>
            );
        });
    };

    useEffect(() => {
        if (result.length > 0) {
            const images = Object.values(result).map(value => ({ url: value }));
            setImage(images[0].url);
            setSelectedModelImage(images[0].url);
        }
    }, [result]);

    return (
        <div style={ContainerStyle}>
            <aside style={SidebarStyle}>
                <section style={SectionStyle}>
                    <h2 style={TitleStyle}>Categories</h2>
                    <ul style={ListStyle}>
                        <li>All categories</li>
                        <li>Dresses</li>
                        <li>Jumpsuits</li>
                        <li>Blouses</li>
                        <li>Shirts</li>
                        <li>T-Shirts</li>
                        <li>Tank tops</li>
                        <li>Tops</li>
                        <li>Sweaters</li>
                        <li>Sweatshirts</li>
                        <li>Cardigans</li>
                        <li>Blazers</li>
                        <li>Jackets</li>
                        <li>Coats</li>
                        <li>Pants</li>
                        <li>Jeans</li>
                        <li>Tights</li>
                        <li>Bodys</li>
                        <li>Shorts</li>
                        <li>Skirts</li>
                    </ul>
                </section>
            </aside>
            <main style={MainContentStyle}>
                <section style={SectionStyle}>
                    <h2 style={TitleStyle}>cloths</h2>
                    <ImageGallery 
                        url={"http://localhost:8000/cloths"} 
                        setFileName={setCloth} 
                        selectedFile={image} 
                        isCarousel={false}
                    />
                </section>
            </main>
            <div style={RightSectionStyle}>
                <h2 style={TitleStyle}>Selected Model</h2>
                <ImageGallery 
                    url={"http://localhost:8000/images"} 
                    setFileName={setImage} 
                    selectedFile={selectedModelImage} 
                    isCarousel={true} 
                />
                <Form
                    cloth={cloth}
                    setParentCloth={setCloth}
                    image={image}
                    setParentImage={setImage}
                    onSubmit={generateImages}
                />
                <div style={ResultGridStyle}>
                    {displayResult()}
                </div>
            </div>
        </div>
    );
}

const ContainerStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 2fr 1fr",
    gap: "1rem",
    height: "100vh",
};

const SidebarStyle = {
    padding: "1rem",
    backgroundColor: "#f8f8f8",
    overflowY: "auto",
};

const MainContentStyle = {
    padding: "1rem",
    overflowY: "auto",
    gridColumn: "2 / 3",
};

const RightSectionStyle = {
    padding: "1rem",
    overflowY: "auto",
};

const SectionStyle = {
    marginBottom: "2rem",
};

const TitleStyle = {
    textTransform: "uppercase",
    marginBottom: "1rem",
};

const ListStyle = {
    listStyleType: "none",
    padding: "0",
};

const ResultGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "1rem",
    marginTop: "2rem",
};

const ResultGridItemStyle = {
    border: "1px solid black",
    boxShadow: "3px 5px 1px brown",
    padding: "1rem",
};

const ImageCardStyle = {
    height: "215px",
    width: "100%",
};

const ResultTitleStyle = {
    textTransform: "uppercase",
};

const SelectedImageStyle = {
    width: "100%",
    height: "auto",
    marginBottom: "1rem",
};
