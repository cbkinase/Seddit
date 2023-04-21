import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, NavLink } from "react-router-dom";
import SignupFormPage from "./components/SignupFormPage";
import LoginFormPage from "./components/LoginFormPage";
import { authenticate } from "./store/session";
import Navigation from "./components/Navigation";
import { getSubreddits } from "./store/subreddits";
import moment from "moment";

function App() {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);
    useEffect(() => {
        dispatch(authenticate()).then(() => setIsLoaded(true));
        dispatch(getSubreddits());
    }, [dispatch]);

    const subreddits = useSelector((state) => state.subreddits.Subreddits);
    const user = useSelector((state) => state.session.user);

    const shortenWord = (word, long=20) => {
        if (!word) return null;
        if (word.length < long) return word;
        return word.slice(0,long) + "..."
    }

    const ellipsisIfLong = (paragraph, long=20) => {
        if (!paragraph) return null;
        let wordArr = paragraph.split(" ");
        let newStr = "";
        if (wordArr.length > long) {
            for (let i = 0; i < long; i++) {
                newStr += wordArr[i];
                if (i !== long - 1) newStr += " "
            }

                newStr += "...";
            return newStr;
        }
        return paragraph;
    };

    const capitalizeFirstLetter = (word) => {
        return word[0].toUpperCase() + word.slice(1)
    }

    const handleJoinCommunity = async (subredditId, userId, subredditName) => {
        const res = await fetch(`/api/s/${subredditId}/subscribers`, {
            method: "POST",
        });

        const data = await res.json();
        if (data.success) {
            let btn = document.getElementById(
                `subreddit-${subredditId}-button`
            );
            btn.classList = "act-subreddit-btn button-leave remove-bottom-margin";
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
            let btn = document.getElementById(
                `subreddit-${subredditId}-button`
            );
            btn.classList = "act-subreddit-btn button-join remove-bottom-margin";
            btn.innerText = "Left Community";
            btn.onclick = (e) => alert(`Already left r/${subredditName}!`);
            // btn.onclick = (e) => handleJoinCommunity(subredditId, userId);
        } else {
            // alert("Please try again momentarily!");
        }
    };

    return (
        <>
            <Navigation isLoaded={isLoaded} />
            {isLoaded && subreddits && (
                <Switch>
                    <Route exact path="/explore">
                        <div className="subreddit-short-main-container">
                            {Object.values(subreddits).map((subreddit) => (
                                <div className="box-dec-1 subreddit-short-container">
                                    <span className="subreddit-abridged-top">

                                        <span className="subreddit-title-preview">
                                        <NavLink className="subreddit-title-nav" to={`/r/${subreddit.name}`}>
                                            <img
                                                className="subreddit-preview-img"
                                                src={subreddit.main_pic}
                                            ></img>
                                            </NavLink>
                                            <NavLink className="subreddit-title-nav" to={`/r/${subreddit.name}`}>
                                            <h1 className="card-title">
                                                r/{subreddit.name}{" "}
                                            </h1></NavLink>
                                            <span className="subreddit-preview-creator">
                                                {" "}
                                                • created by{" "}
                                                <NavLink className="card-username-link" to={`/u/${subreddit.owner_info.username}`}>
                                                {
                                                    shortenWord(subreddit.owner_info
                                                        .username, 10)
                                                }</NavLink>{" "}
                                                {moment(
                                                    Date.parse(
                                                        subreddit.created_at
                                                    )
                                                ).fromNow()}
                                            </span>
                                        </span>
                                    </span>
                                    {/* User is not in community already */}
                                    {user &&
                                        !Object.keys(
                                            subreddit.subscribers
                                        ).includes(user.id.toString()) && (
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
                                    {user &&
                                        Object.keys(
                                            subreddit.subscribers
                                        ).includes(user.id.toString()) && (
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
                                    <NavLink className="subreddit-title-nav" to={`/r/${subreddit.name}`}>
                                    <h2 className="card-info">
                                        {ellipsisIfLong(subreddit.about)}
                                    </h2></NavLink>
                                    <h3 className="card-category">
                                        {subreddit.category && capitalizeFirstLetter(subreddit.category)}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </Route>
                    <Route path="/login">
                        <LoginFormPage />
                    </Route>
                    <Route path="/signup">
                        <SignupFormPage />
                    </Route>
                </Switch>
            )}
        </>
    );
}

export default App;
