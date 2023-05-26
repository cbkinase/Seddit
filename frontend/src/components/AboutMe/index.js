import "./AboutMe.css"

export default function AboutMe() {
    return (
        <div className="home-section hide-if-small">
        <div className="home-header">
          {/* <div class="header-pic"></div> */}
          <h2>Created by Cameron Beck</h2>
          <p className="subtitle">Welcome to my Reddit clone!</p>
        </div>
        <div className="home-buttons">
            <a target="_blank" href="https://github.com/cbkinase/Seddit" className="gh-repo-btn"><span>Github Repo</span></a>
            <a target="_blank" href="https://www.linkedin.com/in/cameron-beck-4a9a44274/" className="linkedin-btn"><span>My LinkedIn</span></a>
        </div>
      </div>
    )
}
