import "./userInfo.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, NavLink, useLocation } from "react-router-dom";
import UserPostsPreview from "../UserPostsPreview";
import NoPostsUserProfile from "../NoPostsUserProfile";

export default function UserInfo({ currentUser }) {
    const dispatch = useDispatch();
    const { userName } = useParams();

    const location = useLocation();
    const [user, setUser] = useState(null);

    const onUserEnding = (user, ending) => {
        return location.pathname.includes(`/u/${user.username}${ending}`);
    };

    const isDisplayPosts = (user) => {
        return (
            onUserEnding(user, "/posts") ||
            location.pathname.toLowerCase() ===
                `/u/${user.username.toLowerCase()}` ||
                location.pathname.toLowerCase() ===
                `/u/${user.username.toLowerCase()}/`
        );
    };

    const isDisplayComments = (user) => {
        return onUserEnding(user, "/comments");
    };

    useEffect(() => {
        const fn = async () => {
            let data = await fetch(`/api/users/u/${userName}`);
            let user = await data.json();
            if (!user.errors) setUser(user);
        };
        fn();
    }, [dispatch, userName]);

    // The whole currentUser.id === user.id business is to ensure the component gets re-rendered when a user edits their own profile
    return user ? (
        <div className="user-page">
            <div className="header">
                <div className="avatar">
                    <img
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://cdn-icons-png.flaticon.com/512/1384/1384051.png";
                        }}
                        src={
                            currentUser?.id === user.id
                                ? currentUser?.avatar
                                : user.avatar
                        }
                        alt="Avatar"
                    ></img>
                </div>
                <div className="user-info">
                    <h1 className="username">
                        {currentUser?.id === user.id
                            ? currentUser?.username
                            : user.username}
                    </h1>
                    <div className="stats">
                        <div className="stat-item">
                            <span className="count">500</span>
                            <span className="label">Karma</span>
                        </div>
                        <div className="stat-item">
                            <span className="count">{user.num_posts}</span>
                            <span className="label">Posts</span>
                        </div>
                        <div className="stat-item">
                            <span className="count">50</span>
                            <span className="label">Comments</span>
                        </div>
                    </div>
                    <div className="bio">
                        <p>
                            {currentUser?.id === user.id
                                ? currentUser?.bio
                                : user.bio}
                        </p>
                    </div>
                </div>
            </div>
            <div className="content">
                <div className="tabs">
                    <ul>
                        <li className={isDisplayPosts(user) ? "active" : ""}>
                            <NavLink to={`/u/${user.username}/posts`}>
                                Posts
                            </NavLink>
                        </li>
                        <li className={isDisplayComments(user) ? "active" : ""}>
                            <NavLink to={`/u/${user.username}/comments`}>
                                Comments
                            </NavLink>
                        </li>
                    </ul>
                </div>
                {isDisplayPosts(user) && Boolean(user.num_posts) && (
                    <UserPostsPreview user={user} currentUser={currentUser} />
                )}
                {isDisplayPosts(user) && !user.num_posts && (
                    <NoPostsUserProfile username={user.username} />
                )}
                {isDisplayComments(user) && (
                    <NoPostsUserProfile username={user.username} isComment={true} />
                )}
            </div>
        </div>
    ) : (
        <h1>User Not found...</h1>
    );
}
