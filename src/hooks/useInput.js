import { useState } from "react";


const useInput = (initialState, regex = '') => {
    const [inputValue, setInputValue] = useState(initialState);
    const changeState = (event, notInput= false) => {
        if (notInput) {
            setInputValue(event);
            return;
        }
        if (!regex) {
            setInputValue(event.target.value);
        } else {
            if (regex.test(event.target.value)) {
                setInputValue(event.target.value);
            }
        }
    }
    return [
        inputValue,
        changeState
    ]
}

export default useInput;