import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav style={NavbarStyle}>
            <ul style={ListStyle}>
                <li style={Item}>
                    <NavLink to="/">Home</NavLink>
                </li>
                <li style={Item}>
                    <NavLink to="/model">Model</NavLink>
                </li>
                <li style={Item}>
                    <NavLink to="/model-evaluation">Evaluation</NavLink>
                </li>
                <li style={Item}>
                    <NavLink to="/history">History</NavLink>
                </li>
            </ul>
        </nav>
    );
}

const NavbarStyle = {
    width: "100vw",
    display: "flex",
    justifyContent: "center",
}

const ListStyle = {
    listStyleType: "none",
    display: "flex",
    justifyContent: "space-around",
}

const Item = {
    padding: "0 6rem",
    display: "inline-block",
    textDecoration: "none",
    textTransform: "uppercase",
}
