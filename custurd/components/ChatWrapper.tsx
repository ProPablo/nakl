import React, { useContext } from "react";
import { View, Text } from "react-native";
import { ConnectionContext, GlobalContext } from "../App";
import ChatScreen from "./Chat";


const ChatWrapper = () => {
    // const connRef = useContext(ConnectionContext);
    const [globalState, setGlobalState] = useContext(GlobalContext);;
    if (!globalState.isConnected) {
        return (
            <View>
                <Text>Scan QR first Text</Text>
            </View>
        )
    }
    else {
        return (<ChatScreen />)
    }

}

export default ChatWrapper;
