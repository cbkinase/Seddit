const LOAD_POSTS = "posts/LOAD_POSTS";
const ADD_POST = "posts/ADD_POST";
const DELETE_POST = "posts/DELETE_POST";
const HANDLE_VOTE = "posts/HANDLE_VOTE";


const handleVote = (post) => {
    return {
        type: HANDLE_VOTE,
        post
    }
}

const addPost = (post) => {
    return {
        type: ADD_POST,
        post,
    };
};

const loadPosts = (posts, page) => {
    return {
        type: LOAD_POSTS,
        posts,
        page,
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
        dispatch(loadPosts(data, page));
        return data;
    }
};

export const getSubredditPosts = (subredditName) => async (dispatch) => {
    const res = await fetch(`/api/s/name/${subredditName}/posts`)

    if (res.ok) {
        const data = await res.json();
        dispatch(loadPosts(data));
        return data;
    }
}

export const getUserPosts = (username) => async (dispatch) => {
    const res = await fetch(`/api/users/u/${username}/posts`)

    if (res.ok) {
        const data = await res.json();
        dispatch(loadPosts(data));
        return data;
    }
}

export const getSinglePost = (postId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadPosts(data));
        return data;
    }
}

export const createPost = (post) => async (dispatch) => {
    const res = await fetch("/api/posts/", {
        method: "POST",
        body: post,
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
        body: content,
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

export const voteOnPost = (postId, vote) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vote),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(handleVote(data));
        return data;
    }
}

export const deletePostVote = (postId, voteId) => async (dispatch) => {
    const res = await fetch(`/api/posts/${postId}/votes/${voteId}`, {
        method: "DELETE",
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(handleVote(data));
        return data;
    }
}

const initialState = { Posts: {} };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_POSTS: {
            if (action.page && action.page > 1) {
                return {
                    ...state,
                    Posts: {
                        ...state.Posts, ...action.posts.Posts
                    }
                }

            }
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

        case HANDLE_VOTE: {
            const target = Object.values(action.post.Posts)[0]
            return {
                ...state,
                Posts: {...state.Posts, [target.id]: target}
            }
        }
        default:
            return state;
    }
}
