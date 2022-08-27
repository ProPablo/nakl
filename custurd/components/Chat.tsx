import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, TouchableOpacity, Button, Image, Platform } from 'react-native';
import { GiftedChat, IMessage } from 'react-native-gifted-chat'
import DocumentPicker, { DocumentPickerResponse, isInProgress, types } from "react-native-document-picker";
import Clipboard from '@react-native-clipboard/clipboard';

export default function ChatScreen() {
  const [copiedText, setCopiedText] = useState('');
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [attachment, setAttachment] = React.useState<DocumentPickerResponse | null>(null)
  const [image, setImage] = useState<string | null>(null);
  // const [imageString, setImageString] = useState<string>('');

  useEffect(() => {
    console.log(JSON.stringify(attachment, null, 2))
    // const x : ImageSourcePropType;
  }, [attachment])
  
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

  const getClipboard = async () => {
    if (Platform.OS === 'android') {
      const image = await Clipboard.getImage();

      if (image) {
        setImage(image);
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
      renderActions={() => (  
        <View style={{ height: '100%', justifyContent: 'center', left: 5, alignItems: 'center', flexDirection: 'row' }}> 
          
          { (attachment != null) || (image != null) ||
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
                  setImage(null)
                }}
              />
            </View>
          }
        </View> 
      )}
    />
  )
}
