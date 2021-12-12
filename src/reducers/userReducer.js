const initialState = {
    user: null,
    loaded: false,
    error: false
}

const types = {
    FETCH_USER: 'FETCH_USER',
    SET_ERROR: 'SET_ERROR'
}

const userReducer = (state=initialState, action) => {
    switch (action.type) {
        case types.FETCH_USER:
            return {
                ...state,
                user: action.payload,
                loaded: true,
                error: false
            }
        case types.SET_ERROR:
            return {
                ...state,
                error: true
            }
        default:
            return {...state};
    }
}

export const fetchUserAC = (user) => ({
    type: types.FETCH_USER,
    payload: user
})

export const setError = () => ({
    type: types.SET_ERROR
})

export const fetchUser = (userName) => dispatch => {
    fetch(`http://localhost:5000/user/${userName}`)
        .then((response) => {
            if (response.status === 400) {
                dispatch(setError());
            }
            return response.json()
        })
        .then(data => dispatch(fetchUserAC(data)));
}

export default userReducer;