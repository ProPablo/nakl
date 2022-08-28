import React, { useContext, useRef, useState } from 'react';

import {
  StyleSheet,
  View,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
// import { RNCamera } from 'react-native-camera';
import { ConnectionContext, GlobalContext, PeerContext } from '../App';
import { useFocusEffect } from '@react-navigation/native';

export function QRScanScreen({ navigation }) {
  const connRef = useContext(ConnectionContext)
  const peer = useContext(PeerContext)
  const [isLoadingChat, setisLoadingChat] = useState(false);
  const [globalState, setGlobalState] = useContext(GlobalContext);
  const QRef = useRef(null);
  useFocusEffect(
    React.useCallback(() => {
      setisLoadingChat(false);
      console.log(isLoadingChat);
      //@ts-ignore
      QRef.current.reactivate();

    }, [])
  )

  const onSuccess = (e: { data: string; }) => {
    const connTemp = peer.current.connect(e.data);
    
    if (!connTemp) {
      console.log("Invalid QR code");
      setisLoadingChat(false);
      return;
    }

    console.log(`Connecting to this peer ${e.data}`)
    setisLoadingChat(true);

    connTemp.on("open", () => {
      connRef.current = connTemp;
      setisLoadingChat(false);
      // setGlobalState({...globalState, isConnected:true});
      setGlobalState((prev) => ({ ...prev, isConnected: true }));
      console.log("Fully connected!");
      navigation.navigate("Chat");
    })
  };

  return (
    <View>
      <QRCodeScanner
        onRead={onSuccess}
        showMarker={true}
        ref={QRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777'
  },
  textBold: {
    fontWeight: '500',
    color: '#000'
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)'
  },
  buttonTouchable: {
    padding: 16
  }
});