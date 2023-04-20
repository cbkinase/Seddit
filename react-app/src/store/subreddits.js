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


const initialState = {subreddits: {}};

export default function reducer(state = initialState, action) {
    switch(action.type) {
        case LOAD_SUBREDDITS: {
            return action.subreddits
        }
        default:
            return state;
    }
}
