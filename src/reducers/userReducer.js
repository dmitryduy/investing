const initialState = {
    user: null,
    loaded: false,
}

const types = {
    FETCH_USER: 'FETCH_USER',
}

const userReducer = (state=initialState, action) => {
    switch (action.type) {
        case types.FETCH_USER:
            return {
                ...state,
                user: action.payload,
                loaded: true
            }
        default:
            return {...state};
    }
}

export const fetchUserAC = (user) => ({
    type: types.FETCH_USER,
    payload: user
})

export const fetchUser = (userName) => dispatch => {
    fetch(`http://localhost:5000/user/${userName}`)
        .then((response) => response.json())
        .then(data => {
            dispatch(fetchUserAC(data))
        });
}

export default userReducer;