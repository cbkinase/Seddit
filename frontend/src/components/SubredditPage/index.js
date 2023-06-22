import React, { useEffect, useState } from "react";
import "./subredditPage.css";
import { useParams, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSubredditByName } from "../../store/subreddits";
import OpenModalButton from "../OpenModalButton";
import EditCommunityModal from "../EditCommunityModal";
import DeleteSubredditModal from "../DeleteSubredditModal";
import SubredditPostsPreview from "../SubredditPostsPreview";
import CreatePostModal from "../CreatePostModal";
import NoPostsSubreddit from "../NoPostsSubreddit";
import LoadingSpinner from "../LoadingSpinner";
import GenericNotFound from "../NotFound/GenericNotFound";
import ellipsisIfLong from "../../utils/ellipsisIfLong";
import getRawTextContent from "../../utils/getRawTextContent";

export default function SubredditPage({ user }) {
    const { subredditName } = useParams();
    const subreddit = useSelector((state) => state.subreddits.Subreddits[subredditName]);

    function isUserInSubreddit(user, subreddit) {
        return user && subreddit.subscribers[user.username];
    }

    const [userInSubreddit, setUserInSubreddit] = useState(null);

    const dispatch = useDispatch();
    //   const history = useHistory();
    const [hasLoaded, setHasLoaded] = useState(false);
    let found = false;
    const [numMembers, setNumMembers] = useState(null);

    const [isExpanded, setIsExpanded] = useState(false);

    function toggleExpanded() {
      setIsExpanded(!isExpanded);
    }

    const handleJoinCommunity = async (subredditId, userId, subredditName) => {
        const res = await fetch(`/api/s/${subredditId}/subscribers`, {
            method: "POST",
        });
        const data = await res.json();
        if (data.success) {
            setUserInSubreddit(true);
            setNumMembers((prevMems) => prevMems + 1);
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
            setUserInSubreddit(false);
            setNumMembers((prevMems) => prevMems - 1);
        } else {
            // alert("Please try again momentarily!");
        }
    };

    useEffect(() => {
        const loadAndWait = async () => {
            let data = await dispatch(getSubredditByName(subredditName));
            setHasLoaded(true);
            if (!data) {
                return;
            }
            let subreddit = data.Subreddits[subredditName]
            setNumMembers(subreddit.numSubscribers);
            setUserInSubreddit(isUserInSubreddit(user, subreddit))
        };
        loadAndWait();
    }, [dispatch, subredditName, user]);


    // let subreddit =
    //     subreddits &&
    //     Object.values(subreddits).filter(
    //         (subreddit) =>
    //             subreddit.name.toLowerCase() === subredditName.toLowerCase()
    //     )[0];

    if (hasLoaded && subreddit) {
        found = true;
    }

    // const capitalizeFirstLetter = (word) => {
    //     return word[0].toUpperCase() + word.slice(1);
    // };


    if (hasLoaded && !subreddit) {
        return <GenericNotFound />
    }


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
                                    buttonText="Edit Community"
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
                                    buttonText="Delete Community"
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
                            {subreddit.name}
                        </h2>
                        { getRawTextContent(subreddit.about).length <= 50 ? <div className="subreddit-description-text"><div className="dangerous-content" dangerouslySetInnerHTML={{ __html: subreddit.about }} /></div>
                        : isExpanded ?
                        <div>
                            <div className="subreddit-description-text">
                            <div className="dangerous-content" dangerouslySetInnerHTML={{ __html: subreddit.about }} />
                        </div>
                        <button className="show-less-btn" onClick={toggleExpanded}>Show less</button>
                        </div>
                             : <div className="truncated-text-container">
                             <p style={{marginLeft: "20px"}} className="subreddit-description-text">{ellipsisIfLong(getRawTextContent(subreddit.about))}</p>
                             <button className="read-more-btn" onClick={toggleExpanded}>Read more</button>
                             </div> }
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
                        {user && <div style={{paddingBottom: "10px"}}></div>}
                        <div className="subreddit-stat">
                            {/* User is not in community already */}
                            {user && !userInSubreddit && (
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
                            {user && userInSubreddit && (
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
            {subreddit.num_posts >= 1 ? <SubredditPostsPreview user={user} subreddit={subreddit} /> : <NoPostsSubreddit user={user} subreddit={subreddit} />}
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
       <LoadingSpinner />
    );
}
