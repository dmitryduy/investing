import React from 'react';
import { Input } from "../../Styled";
import { Hint } from "./SoldBuyInput.styles";

const SoldBuyInput = ({value, onInput, isAnimate, inputHintText, hintText}) => {
    return (
        <Input hint={inputHintText}>
            <input type="text" value={value} onInput={onInput}/>
            <Hint className={isAnimate && 'animate'}>{hintText}</Hint>
        </Input>
    );
};

export default SoldBuyInput;
