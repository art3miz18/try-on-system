import { useState, useEffect } from "react";

export default function ImageGallery({ url, setFileName }) {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadImages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(url);
            const data = await response.json();
            setImages(prevImages => [...prevImages, ...data.files]);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadImages();
    }, []);

    const handleClick = (event) => {
        // console.log(event.target.alt)
        setFileName(event.target.alt)
    }


    return (
        <div className="gallery" style={GalleryStyle}>
            {images.map((image, id) => (
                <img
                    key={id}
                    src={`http://localhost:8000/${image.url}`}
                    alt={image.title}
                    style={ImageCardStyle}
                    onClick={handleClick}
                />
            ))}
            {isLoading && <div>Loading more images...</div>}
        </div>
    );
}

const GalleryStyle = {
    padding: "5px 8px",
    width: "630px",
    height: "450px",
    display: "flex",
    flexWrap: "wrap",
    overflowY: "auto",
    backgroundColor: "#eee",
    justifyContent: "space-around",
};

const ImageCardStyle = {
    border: "1px solid black",
    boxShadow: "3px 5px 1px brown",
    height: "215px",
    margin: "5px",
};
