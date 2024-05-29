import { useState, useEffect } from "react";
import Carousel from "react-bootstrap/Carousel";
import '../styles/ImageGallery.css';

/**
 * Renders an image gallery component that fetches images from the given URL and displays them in a carousel or grid format.
 *
 * @param {string} url - The URL from which to fetch the images.
 * @param {function} setFileName - A function to set the selected image file name.
 * @param {string} selectedFile - The currently selected image file name.
 * @param {boolean} isCarousel - A flag indicating whether to display the images in a carousel format.
 * @return {JSX.Element} The rendered image gallery component.
 */
export default function ImageGallery({ url, setFileName, selectedFile, isCarousel }) {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const loadImages = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(url);
            const data = await response.json();
            setImages(data.files);
            setFileName(data.files[0].title);
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
            <Carousel 
                
                interval={null}
                className="custom-carousel" 
                onSelect={(selectedIndex, e) => setFileName(images[selectedIndex].title)} fade data-bs-theme="dark">
                {images.map((image, id) => (
                    <Carousel.Item key={id} className="custom-carousel-item">
                        <img
                            src={`http://localhost:8000/${image.url}`}
                            alt={image.title}
                            className="d-block w-100 carousel-image"
                            onClick={handleClick}                            
                        />
                        {/* <carousel-indicators>                            
                            <img src={`http://localhost:8000/${image.url}`}/>
                        </carousel-indicators>  */}
                        
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
    boxShadow: "3px 5px 1px gray",
    height: "215px",
    margin: "5px",
};
