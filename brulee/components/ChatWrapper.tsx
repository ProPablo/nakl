import { useFocusEffect } from "@react-navigation/native";
import React, { useContext } from "react";
import { View, Text } from "react-native";
import { ConnectionContext, GlobalContext } from "../App";
import ChatScreen from "./Chat";

const ChatWrapper = ({navigation}) => {
    const [globalState, setGlobalState] = useContext(GlobalContext);
    
    if (!globalState.isConnected) {
        return (
            <View>
                <Text>Scan QR first Text</Text>
            </View>
        )
    }
    else {
        return (<ChatScreen navigation={navigation}/>)
    }

}

export default ChatWrapper;
