/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { IMessage, GiftedChat, InputToolbar } from 'react-native-gifted-chat';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
import Chat from './components/Chat';



const App = () => {

  const [messages, setMessages] = useState<IMessage[]>([]);

  useEffect(() => {
    setMessages([
      {
        _id: 1,
        text: 'Hello developer',
        createdAt: new Date(),
        user: {
          _id: 2,
          name: 'React Native',
          avatar: 'https://placeimg.com/140/140/any',
        },
      },
    ])
  }, [])

  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
  }, [])
  const RenderInputToolbar = (props: any) => (
    <InputToolbar
      containerStyle={{
        backgroundColor: '#222B45',
        paddingTop: 6,
        color: "black"
      }}
      // primaryStyle={{
      //   alignItems: 'center',
      //   color: "black"
      // }}
      // accessoryStyle={{ color:"black" }}
      {...props} />
  );

  const messagePressed = (context: any, message: IMessage) => {
    console.log({ message, context });
    //https://github.com/FaridSafi/react-native-gifted-chat/blob/master@%7B2017-09-25%7D/src/Bubble.js#L96-L119
  }

  return (
    //https://stackoverflow.com/questions/60078901/react-native-gifted-chat-change-color-under-inputtoolbar
    //https://github.com/FaridSafi/react-native-gifted-chat/issues/662
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages as any)}
      onPress={messagePressed}
      user={{
        _id: 1,
      }}
      renderInputToolbar={RenderInputToolbar}
    />
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  inputBar: {
    color: "black"
  }
});

export default App;
