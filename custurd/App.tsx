/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useCallback, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import {
  Button,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

// import {
//   Colors,
//   DebugInstructions,
//   Header,
//   LearnMoreLinks,
//   ReloadInstructions,
// } from 'react-native/Libraries/NewAppScreen';
import Chat from './components/Chat';

import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import ScanScreen from 'react-native-qrcode-scanner';
import ChatScreen from './components/Chat';

// @ts-ignore
import Peer from 'react-native-peerjs';
import { QRScanScreen } from './components/QRScan';
import { QRGenerateScreen } from './components/QRGenerate';
import ChatWrapper from './components/ChatWrapper';

// @ts-ignore
export const GlobalContext = React.createContext<[GlobalState, React.Dispatch<React.SetStateAction<GlobalState>>]>(null);
export const PeerContext = React.createContext<Peer | null>(null);
export const ConnectionContext = React.createContext<any>(null);

export interface GlobalState {
  peerId: string,
  isConnected: boolean
}

const initialState: GlobalState = {
  peerId: '',
  isConnected: false
}

const App = () => {
  const stateAndDispatch = useState(initialState);
  const peer = useRef<Peer | null>(null);
  const conRef = useRef<any>(null);


  useEffect(() => {
    const peerInstance = new Peer();
    peerInstance.on('open', (id: any) => {
      stateAndDispatch[1]({
        ...initialState,
        peerId: id,
      })
    })
    peer.current = peerInstance;

    peerInstance.on("connection", (conn: any) => {
      conRef.current = conn;
      stateAndDispatch[1]({
        ...initialState,
        isConnected: true,
      })
    })
  }, [])

  const Tab = createMaterialTopTabNavigator();

  return (
    <GlobalContext.Provider value={stateAndDispatch}>
      <ConnectionContext.Provider value={conRef}>
        <PeerContext.Provider value={peer}>
          <NavigationContainer>
            <Tab.Navigator>
              <Tab.Screen name="Scan" component={QRScanScreen} />
              <Tab.Screen name="Chat" options={{lazy: true}} component={ChatWrapper} />
              <Tab.Screen name="Generate" component={QRGenerateScreen} />
            </Tab.Navigator>
          </NavigationContainer>
        </PeerContext.Provider>
      </ConnectionContext.Provider>
    </GlobalContext.Provider>
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
