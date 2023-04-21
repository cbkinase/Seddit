import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch } from "react-router-dom";
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

    const ellipsisIfLong = (paragraph) => {
        let wordArr = paragraph.split(" ");
        let newStr = "";
        if (wordArr.length > 20) {
            for (let i = 0; i < 20; i++) {
                newStr += wordArr[i] + " ";
            }
            newStr += "...";
            return newStr;
        }
        return paragraph;
    };

    const handleJoinCommunity = async (subredditId, userId) => {
        const res = await fetch(`/api/s/${subredditId}/subscribers`, {
            method: "POST",
        });

        const data = await res.json();
        if (data.success) {
            let btn = document.getElementById(
                `subreddit-${subredditId}-button`
            );
            btn.classList = "act-subreddit-btn button-leave";
            btn.innerText = "Joined";
            btn.onclick = (e) => handleLeaveCommunity(subredditId, userId);
        }
    };

    const handleLeaveCommunity = async (subredditId, userId) => {
        const res = await fetch(`/api/s/${subredditId}/subscribers/${userId}`, {
            method: "DELETE",
        });

        const data = await res.json();

        if (data.success) {
            let btn = document.getElementById(
                `subreddit-${subredditId}-button`
            );
            btn.classList = "act-subreddit-btn button-join";
            btn.innerText = "Join Community";
            btn.onclick = (e) => handleJoinCommunity(subredditId, userId);
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
                                            <img
                                                className="subreddit-preview-img"
                                                src={subreddit.main_pic}
                                            ></img>
                                            <h1 className="card-title">
                                                r/{subreddit.name}{" "}
                                            </h1>
                                            <span className="subreddit-preview-creator">
                                                {" "}
                                                • created by{" "}
                                                {
                                                    subreddit.owner_info
                                                        .username
                                                }{" "}
                                                {moment(
                                                    Date.parse(
                                                        subreddit.created_at
                                                    )
                                                ).fromNow()}
                                            </span>
                                        </span>
                                    </span>
                                    {user &&
                                        !Object.keys(
                                            subreddit.subscribers
                                        ).includes(user.id.toString()) && (
                                            <button
                                                id={`subreddit-${subreddit.id}-button`}
                                                onClick={(e) =>
                                                    handleJoinCommunity(
                                                        subreddit.id,
                                                        user.id
                                                    )
                                                }
                                                className="act-subreddit-btn button-join"
                                            >
                                                Join Community
                                            </button>
                                        )}

                                    {user &&
                                        Object.keys(
                                            subreddit.subscribers
                                        ).includes(user.id.toString()) && (
                                            <button
                                                onClick={(e) =>
                                                    handleLeaveCommunity(
                                                        subreddit.id,
                                                        user.id
                                                    )
                                                }
                                                id={`subreddit-${subreddit.id}-button`}
                                                onMouseOver={(e) =>
                                                    (e.target.innerText =
                                                        "Leave")
                                                }
                                                onMouseOut={(e) =>
                                                    (e.target.innerText =
                                                        "Joined")
                                                }
                                                className="act-subreddit-btn button-leave"
                                            >
                                                Joined
                                            </button>
                                        )}

                                    <h2 className="card-info">
                                        {ellipsisIfLong(subreddit.about)}
                                    </h2>
                                    <h3 className="card-category">
                                        Category: {subreddit.category}
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
