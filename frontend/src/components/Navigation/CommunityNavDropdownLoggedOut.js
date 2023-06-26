import { useHistory } from "react-router-dom";

export default function CommunityNavDropdownLoggedOut({ onModalItemClick, setShowMenu }) {
    const history = useHistory();
    const closeMenu = () => setShowMenu(false);

    return <>
        <li style={{ color: "#787c7e" }}>
            <p></p>
            <p>FEEDS</p>
        </li>

        <li onClick={e => {
            history.push("/");
            closeMenu();
            }} className="dropdown-toggled-clickable">
            <span><i className="fa fa-home" aria-hidden="true"></i></span>
            <p className="">Home</p>
        </li>

        <div className="dropdown-sep"></div>

        <li onClick={e => {
            history.push("/explore");
            closeMenu();
            }} className="dropdown-toggled-clickable">
            <span><i className="fas fa-list"></i></span>
            <p>Explore <span className="hide-if-800" style={{padding: "0px 0px", margin: "0px 0px"}}>Communities</span></p>
        </li>
    </>
}
