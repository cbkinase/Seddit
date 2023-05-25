import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllUserComments } from "../../store/comments";
import LoadingSpinner from "../LoadingSpinner";
import SingleComment from "../CommentSection/SingleComment";

export default function ShortComments({ selectedUser, currUser, IsUserComments }) {
    const dispatch = useDispatch();
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(getAllUserComments(selectedUser.id)).then(() => setIsLoaded(true));
    }, [dispatch, selectedUser])

    const comments = useSelector((state) => state.comments.Comments);

    const sortingFunction = (a, b) =>
        Date.parse(b.created_at) -
        Date.parse(a.created_at)

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
