import { useState, useEffect } from "react";
import ImageGallery from "../components/ImageGallery";
import FormElem from "../components/Form";
import CustomCarousel from "../components/CustomCarousel";
// Bootstrap components
import Container from 'react-bootstrap/Container';
// import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Row } from "react-bootstrap";

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
        if(!Object.entries(result).length){
            return null;
        }

        console.log(Object.entries(result));

        const formattedResult = Object.entries(result).map(([key, value]) => ({
            title: key,  // Assign a generic title or modify as per your data structure
            url: value
        }));
        console.log('formattedResult: ', formattedResult);
            return(
                <div style={{marginTop: "20px"}}>                    
                    <h2 style={TitleStyle}>Results</h2>
                    <CustomCarousel images={formattedResult} server_base_url={server_base_url} style={CarouselStyle} />            
                </div>
            );
        
    };

    useEffect(() => {
        if (result.length > 0) {
            const images = Object.values(result).map(value => ({ url: value }));
            setImage(images[0].url);
            setSelectedModelImage(images[0].url);
        }
    }, [result]);

    return (
        <Container fluid >
            <Row >
                {/* <Col lg="2" md="2">                    
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
                </Col> */}
                <Col lg="6" md="6" sm="8">
                    
                        <h2 style={TitleStyle}>cloths</h2>
                        <ImageGallery 
                            url={"http://localhost:8000/cloths"} 
                            setFileName={setCloth} 
                            selectedFile={image} 
                            isCarousel={false}
                        />
                    
                </Col>
                <Col lg="4" md="3" style={RightSectionStyle}>
                    <h2 style={TitleStyle}>Selected Model</h2>
                    <ImageGallery 
                        url={"http://localhost:8000/images"} 
                        setFileName={setImage} 
                        selectedFile={image} 
                        isCarousel={true} 
                        style={CarouselStyle}
                    />
                    <FormElem
                        cloth={cloth}
                        setParentCloth={setCloth}
                        image={image}
                        setParentImage={setImage}
                        onSubmit={generateImages}
                    />
                    
                </Col>
                <Col lg="4" md="3" style={RightSectionStyle}>
                    <div>
                        {displayResult()}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}


const RightSectionStyle = {
    alignContent: "right",
    
    padding: "1rem",
    overflowY: "auto",
    maxWidth:"max-content"
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


const CarouselStyle = {
    maxWidth: "400px",  
    height: "auto",
    overflow: "hidden"
};



