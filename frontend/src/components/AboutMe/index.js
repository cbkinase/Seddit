import { NavLink } from "react-router-dom"
import "./AboutMe.css"

export default function AboutMe({ adjustDown }) {
    let headerClassName = "hide-if-small home-section";

    if (adjustDown === "short") {
        headerClassName += " home-adj-down";
    }

    if (adjustDown === "far") {
        headerClassName += " home-adj-far-down"
    }

    return (
        <div className={headerClassName}>
        <div className="home-header">
          {/* <div class="header-pic"></div> */}
          <h2>Created by Cameron Beck</h2>
          <p className="subtitle">Welcome to my Reddit clone!</p>
        </div>
        <div className="home-buttons">
            <a target="_blank" rel="noreferrer" href="https://github.com/cbkinase/Seddit" className="gh-repo-btn"><span>
                <i className="fab fa-github home-extra-icon"></i>
                Github Repo</span></a>
            <a target="_blank" rel="noreferrer" href="https://www.linkedin.com/in/cameron-beck-4a9a44274/" className="linkedin-btn"><span>
                <i className="fab fa-linkedin home-extra-icon"></i>
                My LinkedIn
                </span></a>
        </div>
        <div className="home-footer">
            <NavLink className="home-footer-link" exact to="/policy">Privacy Policy</NavLink>
            <NavLink className="home-footer-link" exact to="/agreement">User Agreement</NavLink>
            <NavLink className="home-footer-link" exact to="/content-policy">Content Policy</NavLink>
        </div>
      </div>
    )
}
