import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUserComments } from "../../store/comments";
import LoadingSpinner from "../LoadingSpinner";
import SingleComment from "../CommentSection/SingleComment";
import useInfiniteScrolling from "../../hooks/useInfiniteScrolling";

export default function ShortComments({ selectedUser, currUser, IsUserComments }) {
    const dispatch = useDispatch();
    const page = useInfiniteScrolling();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getAllUserComments(selectedUser.id, page, 10)).then(() => setIsLoaded(true));
    }, [dispatch, selectedUser, page])

    const comments = useSelector((state) => state.comments.Comments);

    const sortingFunction = (a, b) => b.id - a.id

    return (
        isLoaded
        ? <>
        <div>
            {Object.values(comments).sort(sortingFunction).map((comment) =>
            <>

            <SingleComment IsUserComments={IsUserComments} key={comment.id} comment={comment} user={currUser} soloComment={true} sortingFunction={sortingFunction} post={comment.post_info} />
            <div style={{height: "5px", backgroundColor: "rgb(218, 224, 230)"}}></div>
            </> )}
        </div>
        </>
        : <LoadingSpinner />
    )
}
