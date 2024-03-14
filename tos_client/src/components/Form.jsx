export default function Form({ cloth, setCloth, image, setImage, onSubmit }) {
    return (
        <form style={FormStyle}>
            <label style={ItemStyle}>
                <span>Cloth: </span>
                <input value={cloth} onChange={e => setCloth(e.target.value)} type="text" pattern="\d{6}_1.jpg" required />
            </label>

            <label style={ItemStyle}>
                <span>Image: </span>
                <input value={image} onChange={e => setImage(e.target.value)} type="text" pattern="\d{6}_0.jpg" required />
            </label>

            <button onClick={onSubmit}>
                Infer
            </button>
        </form>
    );
}

const FormStyle = {
    padding: "10px",
    backgroundColoe: "#eee",
    border: "1px dashed black",
}

const ItemStyle = {
    display: "block",
}
