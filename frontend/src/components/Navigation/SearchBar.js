import { useState } from "react";
import "./SearchBar.css";

export default function SearchBar() {
    const [isHovered, setIsHovered] = useState(false);
    const onHover = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);

    const formClass = isHovered ? 'search-form search-hovered' : 'search-form';

    return (
        // <div className="search-bar">
        //     <input role="search" autocomplete="off" type="text" className="search-input" placeholder="&#128269; Search Reddit" />
        // </div>
        <div className="search-bar-container">
        <form className={formClass} onSubmit={e => e.preventDefault()} action="" method="get">
            <input
                autoComplete="off"
                type="text"
                id="search-input"
                name="search-input"
                placeholder="Search Reddit"
                onMouseEnter={onHover}
                onMouseLeave={onLeave} />
            <button type="submit" id="search-button">
                <i style={{fontSize: "18px"}} className="fas fa-search clickable-item"></i>
            </button>
        </form>
    </div>
    )
}
