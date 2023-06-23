const LOAD_SUBREDDITS = "subreddits/LOAD_SUBREDDITS";
const ADD_SUBREDDIT = "subreddits/ADD_SUBREDDIT";
const DELETE_SUBREDDIT = "subreddits/DELETE_SUBREDDIT";

const addSubreddit = (subreddit) => {
    return {
        type: ADD_SUBREDDIT,
        subreddit,
    };
};

const loadSubreddits = (subreddits, page) => {
    return {
        type: LOAD_SUBREDDITS,
        subreddits,
        page,
    };
};

const deleteSubreddit = (name) => {
    return {
        type: DELETE_SUBREDDIT,
        name,
    };
};

export const getSubreddits = (page, per_page) => async (dispatch) => {
    let fetchUrl = "/api/s/";
    if (page && per_page) {
        fetchUrl += `?page=${page}&per_page=${per_page}`;
    }
    const res = await fetch(fetchUrl);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSubreddits(data, page));
        return data;
    }
};

export const getSubredditByName = (name) => async (dispatch) => {
    const res = await fetch(`/api/s/name/${name}`);

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSubreddits(data));
        return data;
    }
}

export const createSubreddit = (content) => async (dispatch) => {
    const res = await fetch("/api/s/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(addSubreddit(data));
        return data;
    } else {
        return { errors: "Name already taken" };
    }
};

export const editSubreddit = (content, subredditId) => async (dispatch) => {
    const res = await fetch(`/api/s/${subredditId}`, {
        method: "PUT",
        body: content,
    });

    const data = await res.json();

    if (res.ok) {
        dispatch(addSubreddit(data));

    }

    return data;
};

export const destroySubreddit = (subreddit) => async (dispatch) => {
    const res = await fetch(`/api/s/${subreddit.id}`, {
        method: "DELETE",
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(deleteSubreddit(subreddit.name));
        return data;
    } else {
        return { errors: "Something went wrong" };
    }
};

const initialState = { Subreddits: {} };

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_SUBREDDITS: {
            if (action.page && action.page > 1) {
                return {
                    ...state,
                    Subreddits: {
                        ...state.Subreddits,
                        ...action.subreddits.Subreddits
                    }
                }
            }
            return action.subreddits;
        }
        case ADD_SUBREDDIT: {
            return {
                ...state,
                Subreddits: {
                    ...state.Subreddits,
                    [action.subreddit.name]: action.subreddit,
                },
            };
        }
        case DELETE_SUBREDDIT: {
            const newState = { ...state, Subreddits: { ...state.Subreddits } };
            delete newState.Subreddits[action.name];
            return newState;
        }
        default:
            return state;
    }
}
