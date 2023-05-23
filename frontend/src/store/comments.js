const LOAD_COMMENTS = "comments/LOAD_COMMENTS";
const ADD_COMMENT = "comments/ADD_COMMENT";
const DELETE_COMMENT = "comments/DELETE_COMMENT";

const addComment = (comment) => {
    return {
        type: ADD_COMMENT,
        comment,
    };
};

const loadComments = (comments) => {
    return {
        type: LOAD_COMMENTS,
        comments,
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

export const getAllUserComments = (userId) => async (dispatch) => {
    const res = await fetch(`/api/users/u/${userId}/comments`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadComments(data));
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
