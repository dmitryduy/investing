const initialState = {
    soldPrice: null
}

const types = {
    CHANGE_SOLD_PRICE: 'CHANGE_SOLD_PRICE'
}

const settingsReducer = (state=initialState, action) => {
    switch (action.type) {
        case types.CHANGE_SOLD_PRICE:
            return {...state, soldPrice: action.payload}
        default:
            return {...state}
    }
}

export const changeSoldPriceAC = (newPrice) => ({
    type: types.CHANGE_SOLD_PRICE,
    payload: newPrice
})


export default settingsReducer;