import { useState, useEffect } from "react";
import CustomCarousel from "./CustomCarousel";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

/**
 * Renders an image gallery component that fetches images from the given URL and displays them in a carousel or grid format.
 *
 * @param {string} url - The URL from which to fetch the images.
 * @param {function} setFileName - A function to set the selected image file name.
 * @param {string} selectedFile - The currently selected image file name.
 * @param {boolean} isCarousel - A flag indicating whether to display the images in a carousel format.
 * @return {JSX.Element} The rendered image gallery component.
 */
export default function ImageGallery({ url, setFileName, selectedFile, isCarousel,style }) {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const server_base_url = "http://localhost:8000"
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
            
            <CustomCarousel images={images} server_base_url={server_base_url} setFileName={(setFileName)} style={style} />
        );
    }

    return (
        <div  style={GalleryStyle}>
            {images.map((image, id) => (
                // <>                      
                //     <Row>
                //         <img
                //             key={id}
                //             src={`http://localhost:8000/${image.url}`}
                //             alt={image.title}
                //             style={{
                //                 ...ImageCardStyle,
                //                 border: image.title === selectedFile ? "2px solid blue" : "1px solid gray",
                //             }}
                //             onClick={handleClick}
                //         />
                //     </Row>   
                //     <Row>
                //         <span style={{ textAlign: "center"}}>{image.title}</span>
                //     </Row>           
                // </>
                <div key={id} style={{ textAlign: "left", padding: "5px" }}>                     
                    <img
                        src={`${server_base_url}/${image.url}`}
                        alt={image.title}
                        style={{
                            ...ImageCardStyle,
                            border: image.title === selectedFile ? "2px solid blue" : "1px solid gray",
                            // width: "100%",  // Ensure image fills the container
                            height: "auto"
                        }}
                        onClick={handleClick}
                    />
                    <div>
                        <span style={{fontWeight: "bold"}}>{image.title}</span>
                    </div>            
                </div>
            ))}
            {isLoading && <div>Loading more images...</div>}
        </div>
    );
}

const GalleryStyle = {
    
   
    height: "auto",
    display: "flex",
    flexWrap: "wrap",
    overflowY: "auto",
    
};

const ImageCardStyle = {
    boxShadow: "3px 5px 1px gray",
    height: "215px",
    margin: "5px",
};
