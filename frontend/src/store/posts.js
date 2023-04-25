const LOAD_POSTS = "posts/LOAD_POSTS";
const ADD_POST = "posts/ADD_POST";
const DELETE_POST = "posts/DELETE_POST";

const addPost = (post) => {
    return {
        type: ADD_POST,
        post,
    };
};

const loadPosts = (posts) => {
    return {
        type: LOAD_POSTS,
        posts,
    };
};

const deletePost = (id) => {
    return {
        type: DELETE_POST,
        id,
    };
};

export const getAllPosts = () => async (dispatch) => {
    const res = await fetch("/api/posts/");

    if (res.ok) {
        const data = await res.json();
        dispatch(loadPosts(data));
        return data;
    }
};

const initialState = { Posts: {} };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_POSTS: {
            return action.posts;
        }
        default:
            return state;
    }
}
