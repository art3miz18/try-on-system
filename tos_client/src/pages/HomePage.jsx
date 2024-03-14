import gmmUrl from "../assets/gmm_summary.png"
import tomUrl from "../assets/tom_summary.png"

export default function HomePage() {
    return (
        <div style={ContainerStyle}>
            <figure style={ItemStyle}>
                <figcaption style={TextStyle}>
                    GMM Model Architecture
                </figcaption>
                <img src={gmmUrl} alt="GMM module architecture" style={ImageStyle} />
            </figure>
            
            <figure style={ItemStyle}>
                <figcaption style={TextStyle}>
                    TOM Model Architecture
                </figcaption>
                <img src={tomUrl} alt="TOM module architecture" style={ImageStyle} />
            </figure>
        </div>
    );
}

const ContainerStyle = {
    display: "flex",
    width: "80vw",
    justifyContent: "space-between",
    padding: "0 5rem",
}

const TextStyle = {
    fontWeight: "bold",
    fontSize: "32px",
    marginTop: "3rem",
    paddingBottom: "1.5rem",
    width: "inherit",
    textAlign: "center",
}

const ImageStyle = {
    width: "700px",
    aspectRatio: "auto",
}

const ItemStyle = {
    margin: "0 1rem",
}
