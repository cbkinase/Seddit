import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubreddits } from "../../store/subreddits";
import IndividualAbridgedSubreddit from "../AbridgedSubredditOne";

export default function AbridgedSubredditDisplay({ user }) {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        dispatch(getSubreddits());
    }, [dispatch]);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const subreddits = useSelector((state) => state.subreddits.Subreddits);

    const allSubredditsArr = Object.values(subreddits);

    const filteredSubreddits = allSubredditsArr.filter((subreddit) => {
        return subreddit.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <>
            <div style={{ height: "30px", backgroundColor: "#dae0e6" }}></div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: "20px",
                    paddingBottom: "20px",
                    backgroundColor: "#dae0e6",
                }}
            >
                <input
                    id="subreddit-search"
                    type="text"
                    placeholder="Search for a subreddit"
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="subreddit-short-main-container">
                {filteredSubreddits.map((subreddit) => (
                    <IndividualAbridgedSubreddit
                        key={subreddit.id}
                        user={user}
                        subreddit={subreddit}
                    />
                ))}
            </div>
        </>
    );
}
