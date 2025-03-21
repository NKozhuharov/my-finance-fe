import {components} from "react-select";
import React from "react";

export const IconOption = (props) => {
    return (
        <components.Option {...props}>
            <div className="icon-option">
                <img src={props.data.url} alt="icon.text"/>&nbsp;{props.data.label}
            </div>
        </components.Option>
    );
};

// Custom SingleValue component (for selected item)
export const CustomSingleValue = (props) => {
    return (
        <components.SingleValue {...props}>
            <div className="icon-option">
                <img src={props.data.url} alt="icon.text"/>&nbsp;{props.data.label}
            </div>
        </components.SingleValue>
    );
};