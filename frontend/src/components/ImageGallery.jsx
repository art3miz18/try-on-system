import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";

export default function ImageGallery({ url, setFileName, selectedFile, isCarousel }) {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadImages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(url);
            const data = await response.json();
            setImages(data.files);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadImages();
    }, [url]);

    const handleClick = (event) => {
        setFileName(event.target.alt);
    }

    if (isCarousel) {
        return (
            <Carousel interval={null} onSelect={(selectedIndex, e) => setFileName(images[selectedIndex].title)}>
                {images.map((image, id) => (
                    <Carousel.Item key={id}>
                        <img
                            src={`http://localhost:8000/${image.url}`}
                            alt={image.title}
                            className="d-block w-100 carousel-image"
                            onClick={handleClick}
                        />
                    </Carousel.Item>
                ))}
                {isLoading && <div>Loading more images...</div>}
            </Carousel>
        );
    }

    return (
        <div className="gallery" style={GalleryStyle}>
            {images.map((image, id) => (
                <img
                    key={id}
                    src={`http://localhost:8000/${image.url}`}
                    alt={image.title}
                    style={{
                        ...ImageCardStyle,
                        border: image.title === selectedFile ? "2px solid blue" : "1px solid gray",
                    }}
                    onClick={handleClick}
                />
            ))}
            {isLoading && <div>Loading more images...</div>}
        </div>
    );
}

const GalleryStyle = {
    padding: "5px 8px",
    width: "100%",
    height: "auto",
    display: "flex",
    flexWrap: "wrap",
    overflowY: "auto",
    backgroundColor: "#eee",
    justifyContent: "space-around",
};

const ImageCardStyle = {
    boxShadow: "3px 5px 1px brown",
    margin: "5px",
};
