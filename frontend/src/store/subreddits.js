const LOAD_SUBREDDITS = "subreddits/LOAD_SUBREDDITS";
const ADD_SUBREDDIT = "subreddits/ADD_SUBREDDIT";
const DELETE_SUBREDDIT = "subreddits/DELETE_SUBREDDIT"


const addSubreddit = (subreddit) => {
    return {
        type: ADD_SUBREDDIT,
        subreddit
    }
}

const loadSubreddits = (subreddits) => {
    return {
        type: LOAD_SUBREDDITS,
        subreddits
    }
}

const deleteSubreddit = (id) => {
    return {
        type: DELETE_SUBREDDIT,
        id
    }
}


export const getSubreddits = () => async dispatch => {
    const res = await fetch("/api/s/");

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSubreddits(data));
        return data;
    }
}

export const createSubreddit = (content) => async dispatch => {
    const res = await fetch ("/api/s/", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(content)
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(addSubreddit(data))
        return data;
    }
    else {
        return {errors: "Name already taken"}
    }
}

export const editSubreddit = (content, subredditId) => async dispatch => {
    const res = await fetch(`/api/s/${subredditId}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(content)
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(addSubreddit(data))
        return data;
    }
    else {
        return {errors: "Name already taken"}
    }
}

export const destroySubreddit = (id) => async dispatch => {
    const res = await fetch(`/api/s/${id}`, {
        method: "DELETE"
    })

    if (res.ok) {
        const data = await res.json();
        dispatch(deleteSubreddit(id));
        return data;
    }
    else {
        return {errors: "Something went wrong"}
    }
}


const initialState = {Subreddits: {}};

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case LOAD_SUBREDDITS: {
            return action.subreddits
        }
        case ADD_SUBREDDIT: {
            return {...state, Subreddits: {...state.Subreddits, [action.subreddit.id]: action.subreddit}}
        }
        case DELETE_SUBREDDIT: {
            const newState = {...state, Subreddits: {...state.Subreddits}};
            delete newState.Subreddits[action.id];
            return newState;
        }
        default:
            return state;
    }
}
