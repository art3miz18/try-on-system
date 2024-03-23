export default function NotFoundPage() {
    return (
        <div style={ContainerStyle}>
            <h1 style={TextStyle}>404: Page Not Found</h1>
        </div>
    );
}

const ContainerStyle = {
    width: "100vw",
    height: "100vh",
    backgroundColor: "#c9263f",
}

const TextStyle = {
    color: "white",
}
