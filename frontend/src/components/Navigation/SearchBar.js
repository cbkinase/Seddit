import { useState, useEffect, useRef } from "react";
import useViewportWidth from "../../hooks/useViewportWidth";
import SearchPreview from "./SearchPreview";
import "./SearchBar.css";

export default function SearchBar() {
    const [isHovered, setIsHovered] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const ulRef = useRef(null);
    const divRef = useRef(null);
    const viewportWidth = useViewportWidth();

    const onHover = () => setIsHovered(true);
    const onLeave = () => setIsHovered(false);

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                if (!divRef.current.contains(e.target)) {
                    setShowMenu(false);
                }
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    useEffect(() => {
        if (ulRef.current && divRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          ulRef.current.style.top = `${rect.bottom}px`;
          ulRef.current.style.left = `${rect.left}px`;
          ulRef.current.style.width = `${rect.width}px`;
          ulRef.current.style.minWidth = "175px";
        }
      }, [ulClassName, viewportWidth]);

    const closeMenu = () => setShowMenu(false);

    const formClass = isHovered || searchQuery ? 'search-form search-hovered' : 'search-form';

    return (
        <>
            <div className="search-bar-container">
                <form ref={divRef} className={formClass} onSubmit={e => e.preventDefault()} action="" method="get">
                    <input
                        autoComplete="off"
                        type="text"
                        id="search-input"
                        name="search-input"
                        placeholder="Search Reddit"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onClick={openMenu}
                        onMouseEnter={onHover}
                        onMouseLeave={onLeave} />
                    <button type="submit" id="search-button">
                        <i style={{ fontSize: "18px" }} className="fas fa-search clickable-item"></i>
                    </button>
                </form>
            </div>
            <ul style={{maxHeight: "400px", overflowY: "auto", overflowX: "hidden"}} className={ulClassName} ref={ulRef}>
                <SearchPreview query={searchQuery} closeMenu={closeMenu} setSearchQuery={setSearchQuery} />
            </ul>
        </>
    )
}
