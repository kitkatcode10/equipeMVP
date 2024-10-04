import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Image, Dimensions } from 'react-native';
import auth from '@react-native-firebase/auth';
import LoginScreen from './components/LoginScreen';
import ProfileScreen from './components/ProfileScreen';
import RegisterScreen from './components/RegisterScreen';
import ProductsScreen from './components/ProductsScreen';

const screenWidth = Dimensions.get('window').width;

function App(): React.JSX.Element {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  // Handle user state changes
  function onAuthStateChanged(user) {
    setUser(user);
    if (initializing) setInitializing(false);
    if (user) {
      setShowProfile(false); // Set to false when user logs in to show products first
    }
  }

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);

  useEffect(() => {
    const signInAnonymously = async () => {
      try {
        await auth().signInAnonymously();
      } catch (error) {
        console.error('Anonymous sign in error:', error);
      }
    };

    if (!user) {
      signInAnonymously();
    }
  }, [user]);

  if (initializing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Initializing...</Text>
      </View>
    );
  }

  const renderContent = () => {
    if (user) {
      return (
        <View style={styles.contentContainer}>
          {showProfile ? (
            <>
              <ProfileScreen />
              <TouchableOpacity style={styles.button} onPress={() => setShowProfile(false)}>
                <Text style={styles.buttonText}>View Products</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <ProductsScreen />
              <TouchableOpacity style={styles.button} onPress={() => setShowProfile(true)}>
                <Text style={styles.buttonText}>View Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      );
    } else {
      return (
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image
              source={require('./assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          {isRegistering ? (
            <RegisterScreen 
              onRegisterSuccess={() => setIsRegistering(false)}
              switchToLogin={() => setIsRegistering(false)}
            />
          ) : (
            <LoginScreen switchToRegister={() => setIsRegistering(true)} />
          )}
        </View>
      );
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {renderContent()}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 90,
    marginBottom: 40,
    width: screenWidth,
    height: screenWidth * 0.7,
  },
  logo: {
    width: '100%',
    height: '100%',
    maxWidth: 500,
    maxHeight: 500,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginHorizontal: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default App;