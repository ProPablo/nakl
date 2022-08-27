import React, { Component, useContext } from 'react';

import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableOpacity,
  Linking,
  View,
} from 'react-native';

import QRCodeScanner from 'react-native-qrcode-scanner';
import { RNCamera } from 'react-native-camera';
import { ConnectionContext, PeerContext } from '../App';

export function QRScanScreen({ navigation }) {
  const conn = useContext(ConnectionContext)
  const peer = useContext(PeerContext)
  const onSuccess = (e: { data: string; }) => {
    conn.current = peer.current.connect(e.data); 
    conn.current.on("open", () => {
      navigation.navigate("Chat");
      console.log("Fully connected!")
      conn.current.send("Sent from client :(")
    })
    console.log(`Connecting to this peer ${e.data}`)
  };

  return (
    <QRCodeScanner
      onRead={onSuccess}
      reactivate={false}
      showMarker={true}
    />
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