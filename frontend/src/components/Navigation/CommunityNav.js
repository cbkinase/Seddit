import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { useHistory, useLocation, matchPath } from "react-router-dom";
import { useModal } from "../../context/Modal";
import EditModal from "../EditUserInfoModal";
import { useSelector } from "react-redux";
import ellipsisIfLong from "../../utils/ellipsisIfLong";
import "./CommunityNav.css";
import useViewportWidth from "../../hooks/useViewportWidth";
import CommunityNavDropdownLoggedIn from "./CommunityNavDropdownLoggedIn";
import { getUserSubreddits } from "../../store/subreddits";

function CommunityNav({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const divRef = useRef(null);
    const parentRef = useRef(null);
    const history = useHistory();
    const viewportWidth = useViewportWidth();
    const { setModalContent, setOnModalClose } = useModal();
    let subredditName;
    const location = useLocation();
    const match = matchPath(location.pathname, {
        path: "/r/:subredditName",
        exact: false,
        strict: false,
    });

    if (match) {
        subredditName = match.params.subredditName;
    }

    const onModalItemClick = (modalComponent, onModalClose, onItemClick) => {
        if (onModalClose) setOnModalClose(onModalClose);
        setModalContent(modalComponent);
        if (onItemClick) onItemClick();
    };

    const openMenu = async () => {
        if (showMenu) return;
        setShowMenu(true);
        if (user) dispatch(getUserSubreddits());
    };

    const subreddit = useSelector(state => state.subreddits.Subreddits[subredditName])

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

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
    const closeMenu = () => setShowMenu(false);

    useEffect(() => {
        if (ulRef.current && divRef.current && parentRef.current) {
          const rect = divRef.current.getBoundingClientRect();
          ulRef.current.style.top = `${rect.bottom + 7}px`;
          ulRef.current.style.left = `${rect.left}px`;

          const parentWidth = parentRef.current.offsetWidth;
          ulRef.current.style.width = `${parentWidth - 50}px`; // set the width of the dropdown

        }
      }, [ulClassName, viewportWidth]);

    const handleLogout = (e) => {
        e.preventDefault();
        dispatch(logout());
        closeMenu();
    };

    const handleProfileClick = (e) => {
        e.preventDefault();
        closeMenu();
        history.push(`/u/${user.username}`);
    }

    return (
        <div id="comm-parent" ref={parentRef}>
        <div id="comm-nav-container" onClick={openMenu} ref={divRef} className="profile-dropdown-container">
                <div style={{alignSelf: "center", padding: "0px 5px"}}>
                    {subredditName && subreddit
                    ? <img style={{ width: "20px", height: "20px", borderRadius: "9999px" }} src={subreddit.main_pic} />
                    : <i style={{marginBottom: "5px", fontSize: "17px"}} className="fa fa-home" aria-hidden="true"></i>}
                </div>
                <div className="hide-if-800" style={{alignSelf: "center", padding: "0px 5px", marginBottom: "1px"}}>
                    <p style={{fontFamily: "Arial, sans-serif", color: "#1c1c1c" ,fontWeight: "bold"}}>
                        {subredditName && subreddit
                        ? `r/${ellipsisIfLong(subredditName, 20, true, 5)}`
                        : "Home"}</p>
                </div>
                <div style={{alignSelf: "center", padding: "0px 5px", width: "100%", display: "flex", justifyContent: "flex-end"}}>
                    <i style={{fontSize: "13px", color: "grey"}}
                        className={!showMenu
                            ? "fas fa-chevron-down"
                            : "fas fa-chevron-up"
                        }
                    />
                </div>
            </div>
            <ul style={{minWidth: "250px"}} className={ulClassName} ref={ulRef}>
                <>
                    <div className="dropdown-toggled-container">
                        {user
                            ? <CommunityNavDropdownLoggedIn
                                onModalItemClick={onModalItemClick}
                                user={user}
                                setShowMenu={setShowMenu} /> : null}
                    </div>

                </>
            </ul>
        </ div>
    );
}

export default CommunityNav;
