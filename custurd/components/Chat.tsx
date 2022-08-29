import React, { useState, useCallback, useEffect, useContext } from 'react'
import { View, Text, TouchableOpacity, Button, Image, Platform } from 'react-native';
import { Bubble, GiftedChat, IMessage, Message, MessageImageProps } from 'react-native-gifted-chat'
import DocumentPicker, { DocumentPickerResponse, isInProgress, types } from "react-native-document-picker";
import Clipboard from '@react-native-clipboard/clipboard';
import { ConnectionContext, GlobalContext } from '../App';
import { useFocusEffect } from '@react-navigation/native';


interface ChatScreenProps {
  navigation: any,
}

const renderMessage = (props) => {
  const isLastMessage = props.nextMessage && !props.nextMessage._id
  return (
    <Message
      {...props}
      containerStyle={{
        left: {
          marginBottom: !isLastMessage ? 0 : 40,
        },
        right: {
          marginBottom: !isLastMessage ? 0 : 40,
        },
      }}
    />
  )
}

const renderMessageImage = (props: MessageImageProps<IMessage>) => {

  if (props.currentMessage?.image == null) {
    return (
      <></>
    )
  }
  return (
    <Image
      style={{ height: 100, width: 100 }}
      source={{ uri: props.currentMessage?.image }}
    />
  )
}

export default function ChatScreen<ChatScreenProps>(props) {
  const [copiedText, setCopiedText] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [attachment, setAttachment] = React.useState<DocumentPickerResponse | null>(null)
  const [image, setImage] = useState<string | undefined>(undefined);

  const connRef = useContext(ConnectionContext);
  // useEffect(() => {
  //   console.log(JSON.stringify(attachment, null, 2))
  //   // const x : ImageSourcePropType;
  // }, [attachment])
  const [globalState, setGlobalState] = useContext(GlobalContext);
  // useFocusEffect(
  //   React.useCallback(() => {
  //     connRef.current.removeAllListeners();
  //     connRef.current.close();
  //     setGlobalState((prev) => ({ ...prev, isConnected: false }));
  //     console.log("CHAT FOCUS")
  //   }, [])
  // )
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('blur', (e) => {
      connRef.current.removeAllListeners();
      connRef.current.close();
      setGlobalState((prev) => ({ ...prev, isConnected: false }));
      console.log("CHAT FOCUS")
    });

    connRef.current.on("data", (data) => {
      console.log("Data recieved: ", data);
      if (typeof (data) == "string") {
        setMessages((previousMessages) => {
          const newModel: IMessage = {
            _id: previousMessages.length,
            text: data,
            createdAt: new Date(),
            user: {
              _id: 2,
            },
          }
          return GiftedChat.append(previousMessages, [newModel])
        })
      }
      else if (data instanceof Blob) {

      }
    })

    return () => {
      connRef.current.removeAllListeners();
      connRef.current.close();
      setGlobalState((prev) => ({ ...prev, isConnected: false }));
    }
  }, []);


  const onSend = useCallback((messages = []) => {
    setMessages(previousMessages => GiftedChat.append(previousMessages, messages))
    messages.forEach((msg: IMessage) => {
      connRef.current.send(msg.text);
    });
    // Image send
    if (image != undefined) {
      connRef.current.send(image);
      setMessages(previousMessages => {

        const imageMessage: IMessage = {
          _id: previousMessages.length,
          text: "",
          image: image,
          createdAt: new Date(),
          user: {
            _id: 2,
          },
        }
        return GiftedChat.append(previousMessages, [imageMessage])
      });
      setImage(undefined);
    }
  }, [image]);

  const getClipboard = async () => {
    if (Platform.OS === 'android') {
      const image = await Clipboard.getImage();
      if (image) {
        setImage(image);
        console.log(image);
        return;
      }
    }
    const text = await Clipboard.getString();
    setCopiedText(text);
  }

  const getAttachment = async () => {
    try {
      const pickerResult = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        copyTo: 'cachesDirectory',
      })
      setAttachment(pickerResult)
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
      } else {
        throw err;
      }
    }
  }

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages as any)}
      user={{
        _id: 1,
      }}
      renderMessage={renderMessage}
      renderMessageImage={renderMessageImage}
      renderActions={() => (
        <View style={{ height: '100%', justifyContent: 'center', left: 5, alignItems: 'center', flexDirection: 'row' }}>

          { // Conditional rendering of buttons based image attachment or picker
            (attachment != null) || (image != undefined) ||
            <View>
              <Button
                title="cl"
                onPress={getClipboard}
              />

              <Button
                title="pi"
                onPress={getAttachment}
              />
            </View>
          }

          { // Attachment handling
            (attachment && attachment.fileCopyUri) &&
            <View>
              <Image
                source={{
                  width: 50,
                  height: 50,
                  uri: attachment.fileCopyUri
                }}
              />
              <Button
                title='kill'
                onPress={() => {
                  setAttachment(null)
                }}
              />
            </View>
          }

          { // Image clipboard handling
            image &&
            <View>
              <Image
                source={{
                  width: 50,
                  height: 50,
                  uri: image
                }}
              />
              <Button
                title='kill'
                onPress={() => {
                  setImage(undefined)
                }}
              />
            </View>
          }
        </View>
      )}
    />
  )
}
