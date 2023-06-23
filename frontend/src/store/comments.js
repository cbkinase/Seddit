const LOAD_COMMENTS = "comments/LOAD_COMMENTS";
const ADD_COMMENT = "comments/ADD_COMMENT";
const DELETE_COMMENT = "comments/DELETE_COMMENT";

const addComment = (comment) => {
    return {
        type: ADD_COMMENT,
        comment,
    };
};

const loadComments = (comments, page) => {
    return {
        type: LOAD_COMMENTS,
        comments,
        page,
    };
};

const deleteComment = (comment) => {
    return {
        type: DELETE_COMMENT,
        comment,
    };
};

export const getAllPostComments = (postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/comments`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadComments(data));
        return data;
    }
};

export const getAllUserComments = (userId, page, per_page) => async (dispatch) => {
    let fetchUrl = `/api/users/u/${userId}/comments`
    if (page && per_page) {
        fetchUrl += `?page=${page}&per_page=${per_page}`;
    }
    const res = await fetch(fetchUrl);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadComments(data, page));
        return data;
    }
}

export const createComment = (comment) => async (dispatch) => {
    const res = await fetch("/api/comments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addComment(data));
        return data;
    } else {
        return { errors: "Not today..." }
    }
};

export const editComment = (comment, commentId) => async (dispatch) => {
    const res = await fetch(`/api/comments/${commentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(comment),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addComment(data));
        return data;
    } else {
        return { errors: "Not today..." }
    }
};

export const destroyComment = (commentId, postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE"
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(deleteComment(data));
        return data;
    } else {
        return { errors: "Whoopsies..." }
    }
}

export const voteOnComment = (commentId, vote, IsUserComments, refUser=null) => async (dispatch) => {
    const payload = {
        ...vote,
        "refUser": refUser,
    }
    const res = await fetch(`/api/comments/${commentId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addComment(data));
        return data;
    }

    else {
        const data = await res.json();
        return data;
    }
}

export const deleteCommentVote = (postId, commentId, voteId, IsUserComments=false, refUser=null) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/comments/${commentId}/votes/${voteId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"IsUserComments": IsUserComments, "refUser": refUser}),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addComment(data));
        return data;
    }
}

// const bfs = (tree, comment) => {
//     let queue = tree;
//     while (queue.length > 0) {
//       let curr = queue.shift();
//       if (curr.id === comment.parent_id) return curr;
//       if (curr.replies) {
//         for (const reply of Object.values(curr.replies)) {
//             queue.push(reply);
//           }
//       }
//     }
//     return tree;
//   };

const initialState = { Comments: {} };

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case LOAD_COMMENTS: {
            if (action.page && action.page > 1) {
                return {
                    ...state,
                    Comments: {
                        ...state.Comments, ...action.comments.Comments
                    }
                }
            }
            return action.comments;
        }
        case ADD_COMMENT: {
            return action.comment;
            // console.log(Object.values(state.Comments));
            // let n = bfs(Object.values(state.Comments), action.comment)
            // console.log(n);
            // return {
            //     ...state,
            //     Comments: { ...state.Comments, [action.comment.id]: action.comment },
            // };
        }
        case DELETE_COMMENT: {
            return action.comment;
        }
        default:
            return state;
    }
}
