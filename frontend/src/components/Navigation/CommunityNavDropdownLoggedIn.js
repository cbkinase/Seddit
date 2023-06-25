import CreateCommunityModal from "../CreateCommunityModal";
import { useSelector } from "react-redux";
import ellipsisIfLong from "../../utils/ellipsisIfLong";
import { useHistory } from "react-router-dom";

export default function CommunityNavDropdownLoggedIn({ onModalItemClick, setShowMenu }) {
    const userSubreddits = useSelector(state => state.subreddits.UserSubreddits);
    const subredditsArr = userSubreddits && Object.values(userSubreddits);
    const history = useHistory();
    const closeMenu = () => setShowMenu(false);

    return <>
        <li style={{ color: "#787c7e" }}>
            <p></p>
            <p>YOUR COMMUNITIES</p>
        </li>

        <li onClick={e => {
            onModalItemClick(<CreateCommunityModal />);
            closeMenu();
            }} className="dropdown-toggled-clickable">
            <span><i className="fa fa-plus" aria-hidden="true"></i></span>
            <p className="">Create Community</p>
        </li>

        {subredditsArr && subredditsArr.map(subreddit => {
            return (

                <li key={subreddit.id} onClick={e => {
                    history.push(`/r/${subreddit.name}`);
                    closeMenu();
                    }} style={{display: "flex", alignItems: "center"}} className="dropdown-toggled-clickable">
                    <span><img alt="" style={{height: "20px", width: "20px", borderRadius: "50px"}} src={subreddit.main_pic} /></span>
                    <p>r/{ellipsisIfLong(subreddit.name, 20, true, 10)}</p>
                </li>
            )
        })}

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
