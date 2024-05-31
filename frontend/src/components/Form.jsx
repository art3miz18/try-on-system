import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
export default function FormElem({ cloth, setCloth, image, setImage, onSubmit }) {
    return (
        <Form style={FormStyle}>
            <Form.Group className="mb-3" controlId="formBasicEmail">    
                <Form.Label >
                    Cloth:
                </Form.Label>
                    <Form.Control value={cloth} onChange={e => setCloth(e.target.value)} type="text" pattern="\d{6}_1.jpg" required  />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">    
                <Form.Label>
                    Image:
                </Form.Label>
                <Form.Control value={image} onChange={e => setImage(e.target.value)} type="text" pattern="\d{6}_0.jpg" required  />
            </Form.Group>

            <Button onClick={onSubmit} style={ButtonStyle}>
                Infer
            </Button>
        </Form>
    );
}

const FormStyle = {
    padding: "10px",
    backgroundColor: "#cecece",    
    boxShadow: "10px 10px 10px black",
};



const ButtonStyle = {
    textTransform: "uppercase",
    color: "white",
    width: "75%",
    borderRadius: "12px",
};

