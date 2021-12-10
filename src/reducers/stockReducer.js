const initialState = {
    stockData: null,
    loaded: false,
}

const types = {
    FETCH_USER_STOCKS: 'FETCH_USER_STOCKS'
}

const stockReducer = (state=initialState, action) => {
    switch (action.type) {
        case types.FETCH_USER_STOCKS:
            return {
                ...state,
                stockData: action.payload,
                loaded: true
            }
        default:
            return {...state}
    }
}

export const fetchUserStockAC = (stock) => ({
    type: types.FETCH_USER_STOCKS,
    payload: stock
})

export const fetchUserStock = (stockIds) => (dispatch) => {
    fetch('http://localhost:5000/getStock', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(stockIds)
    })
        .then(response => response.json())
        .then(data => {
            dispatch(fetchUserStockAC(data));
        });
}

export default stockReducer;