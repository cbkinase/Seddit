import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubreddits } from "../../store/subreddits";
import IndividualAbridgedSubreddit from "../AbridgedSubredditOne";
import LoadingSpinner from "../LoadingSpinner";
import useInfiniteScrolling from "../../hooks/useInfiniteScrolling";

export default function AbridgedSubredditDisplay({ user }) {
    const dispatch = useDispatch();
    const page = useInfiniteScrolling();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        dispatch(getSubreddits(page, 10)).then(() => setLoaded(true));
    }, [dispatch, page]);

    const subreddits = useSelector((state) => state.subreddits.Subreddits);

    const allSubredditsArr = Object.values(subreddits);

    const filteredSubreddits = allSubredditsArr;

    return ( loaded ?
        <>
            <div style={{ height: "30px", backgroundColor: "#dae0e6" }}></div>

            <div className="subreddit-short-main-container">
                {filteredSubreddits.sort((a, b) => b.id - a.id).map((subreddit) => (
                    <IndividualAbridgedSubreddit
                        key={subreddit.id}
                        user={user}
                        subreddit={subreddit}
                    />
                ))}
            </div>
        </> : <LoadingSpinner />
    );
}
