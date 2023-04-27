import React, { useEffect, useState } from "react";
import "./subredditPage.css";
import { useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSubreddits } from "../../store/subreddits";
import OpenModalButton from "../OpenModalButton";
import EditCommunityModal from "../EditCommunityModal";
import DeleteSubredditModal from "../DeleteSubredditModal";
import SubredditPostsPreview from "../SubredditPostsPreview";
import CreatePostModal from "../CreatePostModal";

export default function SubredditPage() {
    const { subredditName } = useParams();
    const dispatch = useDispatch();
    //   const history = useHistory();
    const [hasLoaded, setHasLoaded] = useState(false);
    let found = false;
    const [numMembers, setNumMembers] = useState(null);

    const handleJoinCommunity = async (subredditId, userId, subredditName) => {
        const res = await fetch(`/api/s/${subredditId}/subscribers`, {
            method: "POST",
        });

        const data = await res.json();
        if (data.success) {
            memberCount++;
            setNumMembers(memberCount);
            let btn = document.getElementById(
                `subreddit-${subredditId}-button`
            );
            btn.classList = "button-leave adjust-btn-height-subreddit";
            btn.innerText = "Joined";
            btn.onclick = (e) => alert(`Already joined r/${subredditName}!`);
            // btn.onclick = (e) => handleLeaveCommunity(subredditId, userId);
        } else {
            // alert("Please try again momentarily!");
        }
    };

    const handleLeaveCommunity = async (subredditId, userId, subredditName) => {
        const res = await fetch(`/api/s/${subredditId}/subscribers/${userId}`, {
            method: "DELETE",
        });

        const data = await res.json();

        if (data.success) {
            memberCount--;
            setNumMembers(memberCount);
            let btn = document.getElementById(
                `subreddit-${subredditId}-button`
            );
            btn.classList = "button-join adjust-btn-height-subreddit";
            btn.innerText = "Left";
            btn.onclick = (e) => alert(`Already left r/${subredditName}!`);
            // btn.onclick = (e) => handleJoinCommunity(subredditId, userId);
        } else {
            // alert("Please try again momentarily!");
        }
    };

    useEffect(() => {
        const loadAndWait = async () => {
            await dispatch(getSubreddits());
            setHasLoaded(true);
        };
        loadAndWait();
    }, [dispatch]);

    const subreddits = useSelector((state) => state.subreddits.Subreddits);
    const user = useSelector((state) => state.session.user);
    let subreddit =
        subreddits &&
        Object.values(subreddits).filter(
            (subreddit) =>
                subreddit.name.toLowerCase() === subredditName.toLowerCase()
        )[0];

    if (hasLoaded && subreddit) {
        found = true;
    }

    const capitalizeFirstLetter = (word) => {
        return word[0].toUpperCase() + word.slice(1);
    };

    let memberCount = subreddit && subreddit.numSubscribers;

    useEffect(() => {
        setNumMembers(memberCount);
    }, [memberCount]);

    return found ? (
        <div>
            <header className="subreddit-header">
                <NavLink to={`/r/${subreddit.name}`} className="subreddit-logo">
                    <img
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://i.redd.it/72kquwbkihq91.jpg";
                        }}
                        style={{
                            width: "57px",
                            height: "57px",
                            borderRadius: "50%",
                        }}
                        src={subreddit.main_pic}
                        alt="Logo"
                    />
                    <h1 className="subreddit-name">r/{subreddit.name}</h1>
                </NavLink>
                {user?.id === subreddit.owner_id && (
                    <nav className="subreddit-nav">
                        <ul>
                            <li>
                                <OpenModalButton
                                    buttonText="Edit"
                                    className="button-alt"
                                    modalComponent={
                                        <EditCommunityModal
                                            subreddit={subreddit}
                                        />
                                    }
                                ></OpenModalButton>
                            </li>
                            <span
                                style={{
                                    marginLeft: "3px",
                                    marginRight: "3px",
                                }}
                            ></span>
                            <li>
                                <OpenModalButton
                                    buttonText="Delete"
                                    className="button-alt"
                                    modalComponent={
                                        <DeleteSubredditModal
                                            subreddit={subreddit}
                                        />
                                    }
                                />
                            </li>
                        </ul>
                    </nav>
                )}
            </header>
            <div>
                <section className="subreddit-info">
                    <div className="subreddit-description">
                        <h2 className="subreddit-title">
                            {capitalizeFirstLetter(subreddit.name)}
                        </h2>
                        <p className="subreddit-description-text">
                            {subreddit.about}
                        </p>
                    </div>
                    <div className="subreddit-stats">
                        <div className="subreddit-stat">
                            <span className="subreddit-stat-number">
                                {numMembers}
                            </span>
                            <span className="subreddit-stat-label">
                                Member{numMembers !== 1 && "s"}
                            </span>
                        </div>
                        <div className="subreddit-stat">
                            {/* User is not in community already */}
                            {user && !subreddit.subscribers[user.username] && (
                                <button
                                    style={{ width: "130px" }}
                                    id={`subreddit-${subreddit.id}-button`}
                                    onClick={(e) =>
                                        handleJoinCommunity(
                                            subreddit.id,
                                            user.id,
                                            subreddit.name
                                        )
                                    }
                                    className="button-join adjust-btn-height-subreddit"
                                >
                                    Join
                                </button>
                            )}
                            {/* User is in community already */}
                            {user && subreddit.subscribers[user.username] && (
                                <button
                                    style={{ width: "130px" }}
                                    onClick={(e) =>
                                        handleLeaveCommunity(
                                            subreddit.id,
                                            user.id,
                                            subreddit.name
                                        )
                                    }
                                    // style={{padding: "2px 20px 2px 20px", lineHeight: 1}}
                                    id={`subreddit-${subreddit.id}-button`}
                                    className="button-leave adjust-btn-height-subreddit"
                                >
                                    Joined
                                </button>
                            )}
                            {user && (
                                <OpenModalButton
                                    id="create-post-btn-sub-page"
                                    buttonText="Create Post"
                                    modalComponent={
                                        <CreatePostModal
                                            subreddit={subreddit}
                                        />
                                    }
                                    style={{ width: "130px" }}
                                    className="button-join adjust-btn-height-subreddit"
                                >
                                    Create Post
                                </OpenModalButton>
                            )}
                        </div>
                    </div>
                </section>
            </div>
            <SubredditPostsPreview user={user} subreddit={subreddit} />
        </div>
    ) : (
        //   <div>
        //     <div className='subreddit-top-banner'></div>
        //     <div className='subreddit-title-banner'>
        //         <div className='subreddit-title'>
        //             <img className='subreddit-main-pic' src={subreddit.main_pic}></img>
        //             <h1 className='subreddit-main-name'>
        //                 {capitalizeFirstLetter(subreddit.name)}
        //             </h1>
        // {/* User is not in community already */}
        // {user &&
        //     !Object.keys(subreddit.subscribers).includes(
        //         user.id.toString()
        //     ) && (
        //         <button
        //             id={`subreddit-${subreddit.id}-button`}
        //             onClick={(e) =>
        //                 handleJoinCommunity(
        //                     subreddit.id,
        //                     user.id,
        //                     subreddit.name
        //                 )
        //             }
        //             className="button-join adjust-btn-height-subreddit"
        //         >
        //             Join Community
        //         </button>
        //     )}
        // {/* User is in community already */}
        // {user &&
        //     Object.keys(subreddit.subscribers).includes(
        //         user.id.toString()
        //     ) && (
        //         <button
        //             onClick={(e) =>
        //                 handleLeaveCommunity(
        //                     subreddit.id,
        //                     user.id,
        //                     subreddit.name
        //                 )
        //             }
        //             // style={{padding: "2px 20px 2px 20px", lineHeight: 1}}
        //             id={`subreddit-${subreddit.id}-button`}
        //             className="button-leave adjust-btn-height-subreddit"
        //         >
        //             Joined
        //         </button>
        //     )}

        //         </div>
        //         <div>
        //         <p className='subreddit-name'>
        //             r/{subreddit.name}
        //         </p>
        //         </div>
        //     </div>

        //     <div className='subreddit-remaining-info'>

        //     </div>

        //   </div>
        <h1>
            Sorry, but this Community does not exist. Maybe you'd like to create
            it?
        </h1>
    );
}
