const initialState = {
    soldPrice: null,
    buyPrice: null
}

const types = {
    CHANGE_SOLD_PRICE: 'CHANGE_SOLD_PRICE',
    CHANGE_BUY_PRICE: 'CHANGE_BUY_PRICE'
}

const settingsReducer = (state=initialState, action) => {
    switch (action.type) {
        case types.CHANGE_SOLD_PRICE:
            return {...state, soldPrice: action.payload}
        case types.CHANGE_BUY_PRICE:
            return {...state, buyPrice: action.payload}
        default:
            return {...state}
    }
}

export const changeSoldPriceAC = (newPrice) => ({
    type: types.CHANGE_SOLD_PRICE,
    payload: newPrice
})

export const changeBuyPriceAC = (newPrice) => ({
    type: types.CHANGE_BUY_PRICE,
    payload: newPrice
})

export default settingsReducer;