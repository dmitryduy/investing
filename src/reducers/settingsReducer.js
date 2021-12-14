const initialState = {
    soldPrice: null,
    buyPrice: null,
    start: false,
}

const types = {
    CHANGE_SOLD_PRICE: 'CHANGE_SOLD_PRICE',
    CHANGE_BUY_PRICE: 'CHANGE_BUY_PRICE',
    SET_START: 'SET_START'
}

const settingsReducer = (state=initialState, action) => {
    switch (action.type) {
        case types.CHANGE_SOLD_PRICE:
            return {...state, soldPrice: action.payload}
        case types.CHANGE_BUY_PRICE:
            return {...state, buyPrice: action.payload}
        case types.SET_START:
            return {...state, start: true}
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

export const setStart = () => ({
    type: types.SET_START
})

export default settingsReducer;