// mobile/App.tsx
import './global.css';
import * as React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';

export default function App() {
  return (
    <SafeAreaView className="flex-1 bg-zinc-950">
      <StatusBar barStyle="light-content" backgroundColor="#09090b" />
      <HomeScreen />
    </SafeAreaView>
  );
}
