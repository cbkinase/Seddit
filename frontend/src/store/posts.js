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

export const getAllPosts = (page, per_page) => async (dispatch) => {
    let fetchUrl = "/api/posts/";
    if (page && per_page) {
        fetchUrl += `?page=${page}&per_page=${per_page}`;
    }
    const res = await fetch(fetchUrl);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadPosts(data));
        return data;
    }
};

export const createPost = (post) => async (dispatch) => {
    const res = await fetch("/api/posts/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(post),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addPost(data));
        return data;
    } else {
        return { errors: "Not cool, man..." };
    }
};

export const editPost = (content, postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addPost(data));
        return data;
    }
};

export const destroyPost = (id) => async (dispatch) => {
    const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
    });

    if (res.ok) {
        // const data = await res.json();
        dispatch(deletePost(id));
        return "Success";
    }

    return "Failed";
};

const initialState = { Posts: {} };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_POSTS: {
            return action.posts;
        }

        case ADD_POST: {
            return {
                ...state,
                Posts: { ...state.Posts, [action.post.id]: action.post },
            };
        }

        case DELETE_POST: {
            const newState = { ...state, Posts: { ...state.Posts } };
            delete newState.Posts[action.id];
            return newState;
        }
        default:
            return state;
    }
}
