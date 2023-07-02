import useQuery from "../../hooks/useQuery";
import { useState } from "react";
import PostResults from "./Posts/PostResults";
import CommentResults from "./Comments/CommentResults";
import UserResults from "./Users/UserResults";
import SubredditResults from "./Subreddits/SubredditResults";

export default function SearchResults() {
    const [selectedTab, setSelectedTab] = useState("posts");
    let queryParams = useQuery();
    let query = queryParams.get("q");

    const tabMap = {
        posts: <PostResults query={query} />,
        comments: <CommentResults query={query} />,
        users: <UserResults query={query} />,
        subreddits: <SubredditResults query={query} />
    };

    let resultType = tabMap[selectedTab] || <PostResults query={query} />;



    return (
        <>
        <h1>Yoyo</h1>
        {resultType}
        </>
    )
}
