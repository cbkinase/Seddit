import { useState, useEffect } from "react";
import CommentInput from "./CommentInput";
import PostComments from "./PostComments";
import useViewportWidth from "../../hooks/useViewportWidth";
import "./commentSection.css";

export default function CommentSection({comments, user, post}) {
    const [sortingBy, setSortingBy] = useState("new");
    const viewportWidth = useViewportWidth();
    const [divWidth, setDivWidth] = useState("100%");

    // let setDivWidth = () => {}
    // useEffect(() => {
    //     setDivWidth = () => {
    //         if (window.visualViewport.width > 700) {
    //             return "600px"
    //         }
    //         else {
    //             return `${window.visualViewport.width - 20}px`
    //         }
    //     }
    // }, [window.visualViewport.width])
    // function setDivWidth() {
    //     if (window.visualViewport.width > 700) {
    //         return "600px"
    //     }
    //     else {
    //         return `${window.visualViewport.width - 20}px`
    //     }
    // }
    useEffect(() => {
        if (viewportWidth > 700) {
            setDivWidth("600px");
        }
        else {
            setDivWidth(`${viewportWidth}px)`)
        }
    }, [viewportWidth])
    return (
    <div>
        <div style={{width: divWidth}} className="subreddit-short-container post-short-container comment-short-container post-full-container box-dec-1">
        {user ? <CommentInput user={user} post={post} /> : null}
        {user ? <div style={{borderBottom: "1px solid #EDEFF1", height: "10px"}}></div> : null}
        <PostComments comments={comments} user={user} sortingState={sortingBy} post={post} />
        </div>
    </div>
    )
}
