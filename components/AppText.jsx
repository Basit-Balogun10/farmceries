import { Text } from "react-native";

// SEE IF THERE IS A BETTER WAY OF TYPING THE PROPS

const AppText = (props) => {
    return (
        <Text
            className={`font-rubik text-green-dark text-base leading-relaxed ${props.textStyle}`}
            {...props}
        >
            {props.children}
        </Text>
    );
};

export default AppText;
