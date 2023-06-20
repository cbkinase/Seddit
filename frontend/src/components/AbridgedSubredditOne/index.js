import { NavLink } from "react-router-dom";
import moment from "moment";
// import { useDispatch } from "react-redux";
import SubredditHover from "../SubredditHover";
import UserHover from "../UserHover";
import { useState } from "react";

export default function IndividualAbridgedSubreddit({ user, subreddit }) {

    function isUserInSubreddit(user, subreddit) {
        return user && subreddit.subscribers[user.username];
    }

    const [userInSubreddit, setUserInSubreddit] = useState(isUserInSubreddit(user, subreddit));

    // const dispatch = useDispatch();
    const shortenWord = (word, long = 20) => {
        if (!word) return null;
        if (word.length <= long) return word;
        return word.slice(0, long) + "...";
    };

    const ellipsisIfLong = (paragraph, long = 20) => {
        if (!paragraph) return null;
        let wordArr = paragraph.split(" ");
        let newStr = "";
        if (wordArr.length > long) {
            for (let i = 0; i < long; i++) {
                newStr += wordArr[i];
                if (i !== long - 1) newStr += " ";
            }

            newStr += "...";
            return newStr;
        }

        if (wordArr.length < long && paragraph.length > 100) {
            return paragraph.slice(0, 100) + "...";
        }
        return paragraph;
    };

    const capitalizeFirstLetter = (word) => {
        return word[0].toUpperCase() + word.slice(1);
    };

    const handleJoinCommunity = async (subredditId, userId, subredditName) => {
        const res = await fetch(`/api/s/${subredditId}/subscribers`, {
            method: "POST",
        });
        const data = await res.json();
        if (data.success) {
            setUserInSubreddit(true);
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
        } else {
            // alert("Please try again momentarily!");
        }
    };
    return (
        <div className="box-dec-1 subreddit-short-container">
            <span className="subreddit-abridged-top subreddit-abridged-top-short">
                <span className="subreddit-title-preview">
                    <NavLink
                        className="subreddit-title-nav"
                        style={{alignSelf: "revert"}}
                        to={`/r/${subreddit.name}`}
                    >
                        <img
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    "https://i.redd.it/72kquwbkihq91.jpg";
                            }}
                            alt="Pic"
                            className="subreddit-preview-img"
                            src={subreddit.main_pic}
                        ></img>
                    </NavLink>
                    <NavLink
                        style={{ margin: "0px 0px", marginLeft: "2px" }}
                        className="subreddit-title-nav subreddit-preview"
                        to={`/r/${subreddit.name}`}
                    >
                        <SubredditHover subreddit={subreddit} />
                        <h1 className="card-title">
                            r/{shortenWord(subreddit.name, 10)}{" "}
                        </h1>
                    </NavLink>
                    <span className="subreddit-preview-creator hide-if-small">
                        {" "}
                        <span className="hide-if-small">•</span> created by{" "}
                        <NavLink
                            style={{ margin: "0px 0px" }}
                            className="card-username-link subreddit-preview"
                            to={`/u/${subreddit.owner_info.username}`}
                        >
                            <UserHover subreddit={subreddit} />
                            {shortenWord(subreddit.owner_info.username, 10)}
                        </NavLink>{" "}
                        <span className="hide-if-small">{moment(Date.parse(subreddit.created_at)).fromNow()}</span>
                    </span>
                </span>
            </span>
            {/* User is not in community already */}
            {user && !userInSubreddit && (
                <button
                    id={`subreddit-${subreddit.id}-button`}
                    onClick={(e) =>
                        handleJoinCommunity(
                            subreddit.id,
                            user.id,
                            subreddit.name
                        )
                    }
                    className="act-subreddit-btn button-join remove-bottom-margin"
                >
                    Join Community
                </button>
            )}
            {/* User is in community already */}
            {userInSubreddit && (
                <button
                    onClick={(e) =>
                        handleLeaveCommunity(
                            subreddit.id,
                            user.id,
                            subreddit.name
                        )
                    }
                    id={`subreddit-${subreddit.id}-button`}
                    className="act-subreddit-btn button-leave remove-bottom-margin"
                >
                    Already Joined
                </button>
            )}
            <NavLink
                className="subreddit-title-nav"
                to={`/r/${subreddit.name}`}
            >
                <h2 className="card-info">{ellipsisIfLong(subreddit.about)}</h2>
            </NavLink>
            <h3 className="card-category">
                {subreddit.category &&
                    capitalizeFirstLetter(subreddit.category)}
            </h3>
        </div>
    );
}
