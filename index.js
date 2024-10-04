import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import '@react-native-firebase/firestore';

import { initializeApp } from '@react-native-firebase/app';

// Initialize Firebase
initializeApp();

AppRegistry.registerComponent(appName, () => App);