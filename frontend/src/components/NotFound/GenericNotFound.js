import { NavLink } from "react-router-dom";
import "./GenericNotFound.css"

export default function GenericNotFound() {
    return <div className="generic-404-container">
        <img height="128px" width="128px" src="https://www.redditstatic.com/desktop2x/img/snoomoji/snoo_thoughtful.png" />
        <h1 className="generic-404-title">Page Not Found</h1>
        <p className="generic-404-text">Sorry, the page you are looking for does not exist.</p>
        <p className="generic-404-text">Please check the URL or <NavLink className="generic-404-link" to="/">go back to the homepage</ NavLink>.</p>
    </div>
}
