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

const deleteComment = (id) => {
    return {
        type: DELETE_COMMENT,
        id,
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

const initialState = { Comments: {} };

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case LOAD_COMMENTS: {
            return action.comments
        }
        default:
            return state;
    }
}
