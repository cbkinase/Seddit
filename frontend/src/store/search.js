const LOAD_SEARCH = "search/LOAD_SEARCH";

const loadSearch = (results, page) => {
    return {
        type: LOAD_SEARCH,
        results,
        page
    }
}

export const makeSearch = (query, page, per_page) => async (dispatch) => {
    let fetchUrl = "/api/search/";

    if (page && per_page) {
        fetchUrl += `?page=${page}&per_page=${per_page}`;
    }

    const res = await fetch(fetchUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(query),
    });

    if (res.ok) {
        const data = await res.json();
        dispatch(loadSearch(data, page));
        return data;
    }
}


const initialState = {
    users: [],
    subreddits: [],
    posts: [],
    comments: [],
    // preview: {
    //     subreddits: [],
    //     users: [],
    // },
}

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case LOAD_SEARCH: {
            return {
                ...state,
                users: [...action.results.users],
                subreddits: [...action.results.subreddits],
                posts: [...action.results.posts],
                comments: [...action.results.comments]
            };
        }
        // case LOAD_PREVIEW_SEARCH: {
        //     return {
        //         ...state,
        //         preview: {
        //             users: [...action.results.users],
        //             subreddits: [...action.results.subreddits],
        //         }
        //     };
        // }
        default:
            return state;
    }
}
