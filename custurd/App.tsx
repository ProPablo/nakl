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

import QRCode from "react-qr-code";

// @ts-ignore
import Peer from 'react-native-peerjs';


function QRScanScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <ScanScreen 
        onRead={(e) => (console.log(e.data))}
        reactivate={true}
        showMarker={true}
      />
    </View>
  );
}

export const PeerContext = React.createContext<Peer|null>(null);

export interface GlobalState {
  peerId: string,
}

const initialState: GlobalState = {
  peerId: '',
}

// @ts-ignore
export const GlobalContext = React.createContext<[GlobalState, React.Dispatch<React.SetStateAction<GlobalState>>]>(null);

function QRGenerateScreen() {
  const peer = useContext(PeerContext);
  const [state, useState] = useContext(GlobalContext);  

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <QRCode value={state.peerId}/>
      {/* <Button
        title="disconnect"
      /> */}
    </View>
  );
}


const App = () => {
  const stateAndDispatch = useState(initialState);
  const peer = useRef<Peer | null>(null);

  useEffect(() => {

    const peerInstance = new Peer();
    peerInstance.on('open', (id: any) => {
      console.log(peerInstance);
      stateAndDispatch[1]({
        ...initialState,
        peerId: id,
      })
      console.log(id)
      // console.log(stateAndDispatch[0]);
    })
    peer.current = peerInstance;
  }, [])

  const Tab = createMaterialTopTabNavigator();

  return (
    <GlobalContext.Provider value={stateAndDispatch}>
      <PeerContext.Provider value={peer.current}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen name="Scan" component={QRScanScreen} />
            <Tab.Screen name="Chat" component={ChatScreen} />
            <Tab.Screen name="Generate" component={QRGenerateScreen} />
          </Tab.Navigator>
        </NavigationContainer>    
      </PeerContext.Provider>
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
