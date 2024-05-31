import { useState } from "react";
import { Carousel } from "react-bootstrap";
import '../styles/CustomCarousel.css';

const CustomCarousel = ({ images, server_base_url, setFileName, style }) => {
    const [activeIndex, setActiveIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setActiveIndex(selectedIndex);
        setFileName?.(images[selectedIndex].title);
    };

    const handleThumbnailClick = (index) => {
        handleSelect(index);
    };

    return (
        <div style={style}>
            <Carousel 
                    activeIndex={activeIndex}
                    onSelect={handleSelect}
                    indicators = {false} 
                    interval={null}
                    fade
                    data-bs-theme="dark">
                {images.map((image, id) => (
                    <Carousel.Item key={id} className="custom-carousel-item">
                        <img
                            src={`${server_base_url}/${image.url}`}
                            alt={image.title}
                            className="d-block w-100 carousel-image"                            
                        />                        
                    </Carousel.Item>
                ))}
            </Carousel>
            <div className="custom-carousel-indicators">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`indicator-wrapper ${activeIndex === index ? "active" : ""}`}
                        onMouseEnter={() => document.body.style.cursor = 'pointer'}
                        onMouseLeave={() => document.body.style.cursor = 'auto'}
                    >
                        <img
                            src={`${server_base_url}/${image.url}`}
                            alt={`Thumbnail ${index}`}
                            className="indicator-thumbnail"
                            onClick={() => handleThumbnailClick(index)}
                        />
                        {activeIndex === index && <span className="indicator-title">{image.title}</span>}
                    </div>
                ))}
            </div>            
        </div>
    );
};

export default CustomCarousel;
