import React from "react";
import { TouchableOpacity } from "react-native";
import AppText from "./AppText";

const CommonButton = ({
    bgColor,
    borderColor,
    borderWidth,
    buttonText,
    isDisabled,
    marginBottom,
    marginTop,
    width,
    onPressHandler,
}) => {
    return (
        <TouchableOpacity
            className={`w-${width} mx-auto bg-${bgColor} px-4 py-4 ${
                marginBottom ? "mb-" + marginBottom : ""
            } ${marginTop ? "mt-" + marginTop : ""} ${
                borderWidth ? "border " + borderWidth : ""
            } ${borderColor ? "border-" + borderColor : ""} rounded-full`}
            disabled={isDisabled}
            onPress={onPressHandler}
        >
            <AppText className="font-GilroyBold text-white text-center">
                {buttonText}
            </AppText>
        </TouchableOpacity>
    );
};

export default CommonButton;
