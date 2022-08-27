import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, TouchableOpacity, Button, Image, ImageSourcePropType } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import DocumentPicker, { DirectoryPickerResponse, DocumentPickerResponse, isInProgress, types } from "react-native-document-picker";

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [result, setResult] = React.useState<DocumentPickerResponse | null>(null)

  useEffect(() => {
    console.log(JSON.stringify(result, null, 2))
    // const x : ImageSourcePropType;
  }, [result])
  
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

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages as any)}
      user={{
        _id: 1,
      }}
      renderActions={() => ( 
        <View style={{ height: '100%', justifyContent: 'center', left: 5 }}> 
          <Button
            title="pick"
            onPress={async () => {
              const pickerResult = await DocumentPicker.pickSingle({
                presentationStyle: 'fullScreen',
                copyTo: 'cachesDirectory',
              })
              setResult(pickerResult)
            }}
          />
          
          { 
            (result && result.fileCopyUri) &&
            <Image
              source={{
                width: 100,
                height: 100,
                uri: result.fileCopyUri
              }}
            />
          }
        </View> 
      )}
    />
  )
}
