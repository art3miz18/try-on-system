export default function Form({ cloth, setCloth, image, setImage, onSubmit }) {
    return (
        <form style={FormStyle}>
            <label style={ItemStyle}>
                <span>Cloth: </span>
                <input value={cloth} onChange={e => setCloth(e.target.value)} type="text" pattern="\d{6}_1.jpg" required style={InputStyle} />
            </label>

            <label style={ItemStyle}>
                <span>Image: </span>
                <input value={image} onChange={e => setImage(e.target.value)} type="text" pattern="\d{6}_0.jpg" required style={InputStyle} />
            </label>

            <button onClick={onSubmit} style={ButtonStyle}>
                Infer
            </button>
        </form>
    );
}

const FormStyle = {
    padding: "10px",
    backgroundColoe: "#eee",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "space-around",
    boxShadow: "10px 10px 10px black",
    marginBottom: "2.5rem",
};

const ItemStyle = {
    display: "block",
    marginBottom: "12px",
    marginLeft: "3rem",
};

const ButtonStyle = {
    padding: "6px 15px",
    textTransform: "uppercase",
    marginLeft: "3rem",
    backgroundColor: "#1ec927",
    color: "white",
    width: "30%",
    borderRadius: "12px",
};

const InputStyle = {
    padding: "6px",
}
