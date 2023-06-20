import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/session";
import { useHistory } from "react-router-dom";

function NewProfileButton({ user }) {
    const dispatch = useDispatch();
    const [showMenu, setShowMenu] = useState(false);
    const ulRef = useRef();
    const history = useHistory();

    const openMenu = () => {
        if (showMenu) return;
        setShowMenu(true);
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

    const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");
    const closeMenu = () => setShowMenu(false);

    return (
        <>
            <div onClick={openMenu} className="profile-dropdown-container">
                <button
                    className="topright-avatar-btn"

                >
                    {/* <i className="fas fa-user-circle" /> */}
                    <img
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://cdn-icons-png.flaticon.com/512/1384/1384051.png";
                        }}
                        style={{
                            borderRadius: "4px",
                            width: "25px",
                            height: "25px",
                            cursor: "pointer",
                            marginRight: "5px",
                        }}
                        className="topright-avatar"
                        src={user.avatar}
                        alt={user.username}
                    ></img>
                </button>
                <div className="user-info-dropdown">
                    <div>
                        <p className="user-dropdown-container-name">{user.username}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                        <img src="https://i.gyazo.com/70063a7c7fbfaadec9c88e6eb9f87b2e.png"></img>
                        <p className="user-dropdown-container-karma">{user.karma} karma</p>
                    </div>
                </div>
                <div className="nav-chev">
                    <i
                        className={!showMenu
                            ? "fas fa-chevron-down"
                            : "fas fa-chevron-up"
                        }
                    />
                </div>
            </div>
            <ul className={ulClassName} ref={ulRef}>
                <>
                    <div className="dropdown-toggled-container">

                        <li style={{color: "#787c7e"}}>
                            <span style={{fontSize: "16px"}}><i className="far fa-user-circle"/></span>
                             <p>My Stuff</p>
                        </li>

                        <li onClick={handleProfileClick} className="dropdown-toggled-clickable">
                            <span></span>
                            <p className="dropdown-toggled-panel">Profile</p>
                        </li>

                        <div className="dropdown-sep"></div>

                        <li onClick={handleLogout} className="dropdown-toggled-clickable">
                            <span><i className="fa fa-sign-out-alt" /></span>
                            <p>Log Out</p>
                        </li>
                    </div>

                </>
            </ul>
        </>
    );
}

export default NewProfileButton;
