import "./userInfo.css";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useParams, NavLink, useLocation } from "react-router-dom";
import UserPostsPreview from "../UserPostsPreview";
import NoPostsUserProfile from "../NoPostsUserProfile";
import LoadingSpinner from "../LoadingSpinner";
import ShortComments from "../CommentsShort";

export default function UserInfo({ currentUser, subreddits, posts }) {
    const dispatch = useDispatch();
    const { userName } = useParams();

    const location = useLocation();
    const [user, setUser] = useState(null);
    const [error, setError] = useState(false);
    const [loaded, setLoaded] = useState(false);

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
    // Yeah, yeah... I could probably (definitely) DRY this up. Lol.
    const isDisplayComments = (user) => {
        return onUserEnding(user, "/comments");
    };

    const isDisplaySaved = (user) => {
        return onUserEnding(user, "/saved");
    };

    const isDisplayUpvoted = (user) => {
        return onUserEnding(user, "/upvoted");
    };

    const isDisplayDownvoted = (user) => {
        return onUserEnding(user, "/downvoted");
    };

    useEffect(() => {
        const fn = async () => {
            let data = await fetch(`/api/users/u/${userName}`);
            let user = await data.json();
            if (user.errors) {
              setError(true);
              setLoaded(true);
            };
            if (!user.errors) {
              setUser(user);
              setLoaded(true);
            }
        };
        fn();
    }, [dispatch, userName]);

    if (error) {
      return <h1>Error Loading!!</h1>
    }

    // The whole currentUser.id === user.id business in the header is to ensure the component gets re-rendered when a user edits their own profile
    return loaded ? (
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
                            <span className="label">Post{user.num_posts !== 1 && "s"}</span>
                        </div>
                        <div className="stat-item">
                            <span className="count">{user.num_comments}</span>
                            <span className="label">Comment{user.num_comments !== 1 && "s"}</span>
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
                        {currentUser?.id === user.id && <li className={isDisplaySaved(user) ? "active" : ""}>
                            <NavLink to={`/u/${user.username}/saved`}>
                                Saved
                            </NavLink>
                        </li>}
                        {currentUser?.id === user.id && <li className={isDisplayUpvoted(user) ? "active" : ""}>
                            <NavLink to={`/u/${user.username}/upvoted`}>
                                Upvoted
                            </NavLink>
                        </li>}
                        {currentUser?.id === user.id && <li className={isDisplayDownvoted(user) ? "active" : ""}>
                            <NavLink to={`/u/${user.username}/downvoted`}>
                                Downvoted
                            </NavLink>
                        </li>}
                    </ul>
                </div>
                {isDisplayPosts(user) && Boolean(user.num_posts) && (
                    <UserPostsPreview posts={posts} subreddits={subreddits} user={user} currentUser={currentUser} />
                )}
                {isDisplayPosts(user) && !user.num_posts && (
                    <NoPostsUserProfile username={user.username} isOwnProfile={user.username === currentUser?.username} />
                )}
                {isDisplayComments(user) && !user.num_comments && (
                    <NoPostsUserProfile username={user.username} isComment={true} isOwnProfile={user.username === currentUser?.username} />
                )}
                {isDisplayComments(user) && Boolean(user.num_comments) && (
                    <ShortComments selectedUser={user} currUser={currentUser} />
                )}
                {isDisplaySaved(user) && <NoPostsUserProfile username={user.username} isSaved={true} />}

                {isDisplayUpvoted(user) && <NoPostsUserProfile username={user.username} isUpvoted={true} />}
                {isDisplayDownvoted(user) && <NoPostsUserProfile username={user.username} isDownvoted={true} />}
            </div>
        </div>
    ) : (
        <LoadingSpinner />
    );
}
