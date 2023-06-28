import CommunityNavDropdownLoggedIn from "../Navigation/CommunityNavDropdownLoggedIn";
import { useRef, useState, useEffect } from "react";
import useViewportWidth from "../../hooks/useViewportWidth";
import { getUserSubreddits } from "../../store/subreddits";
import { useDispatch, useSelector } from "react-redux";

export default function SubredditDropdownController({ user, selectedSubreddit, subredditName, setSubredditName }) {

    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const divRef = useRef(null);
    const parentRef = useRef(null);
    const viewportWidth = useViewportWidth();
    const dispatch = useDispatch();

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

    const openMenu = async () => {
        if (showMenu) return;
        setShowMenu(true);
        if (user) dispatch(getUserSubreddits());
    };

    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener("click", closeMenu);

        return () => document.removeEventListener("click", closeMenu);
    }, [showMenu]);

    useEffect(() => {
        if (ulRef.current && divRef.current && parentRef.current) {
            const rect = divRef.current.getBoundingClientRect();
            ulRef.current.style.top = `${rect.bottom + 1}px`;
            ulRef.current.style.left = `${rect.left}px`;

            const parentWidth = parentRef.current.offsetWidth;
            ulRef.current.style.width = `${parentWidth - 50}px`; // set the width of the dropdown

        }
    }, [ulClassName, viewportWidth]);

    const subreddit = useSelector(state => state.subreddits.UserSubreddits[subredditName]);

    return (<div style={{ maxWidth: "350px" }} id="comm-parent" ref={parentRef}>
        <div style={{ backgroundColor: "white", borderRadius: "5px", height: "38px", width: "350px", paddingLeft: "5px", paddingRight: "5px", outline: "none" }} id="comm-nav-container" onClick={openMenu} ref={divRef} className="profile-dropdown-container override-border">
            <div style={{ alignSelf: "center", padding: "0px 5px" }}>
                {subredditName && subreddit
                    ? <img alt="" style={{ width: "20px", height: "20px", borderRadius: "9999px" }} src={subreddit.main_pic} />
                    : <i style={{ marginBottom: "5px", fontSize: "17px" }} className="fa fa-users" aria-hidden="true"></i>}
            </div>
            <div style={{ alignSelf: "center", padding: "0px 5px", marginBottom: "1px" }}>
                <p style={{ fontFamily: "Arial, sans-serif", color: "#1c1c1c", fontWeight: "bold", fontSize: "12px", minWidth: "max-content" }}>
                    {subredditName && subreddit
                        ? `r/${subredditName}`
                        : "Choose a Community"}</p>
            </div>
            <div style={{ justifyContent: "flex-end" }} className="comm-nav-chev">
                <i style={{ fontSize: "13px", color: "grey" }}
                    className={!showMenu
                        ? "fas fa-chevron-down"
                        : "fas fa-chevron-up"
                    }
                />
            </div>
        </div>
        <ul style={{ minWidth: "250px", maxHeight: "30vh", overflowY: "auto", borderRadius: "5px" }} className={ulClassName} ref={ulRef}>
            <>
                <div style={{overflowY: "initial"}} className="dropdown-toggled-container">
                    <CommunityNavDropdownLoggedIn
                        setShowMenu={setShowMenu}
                        setSubredditName={setSubredditName} />
                </div>

            </>
        </ul>
    </ div>)
}
