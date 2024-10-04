import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { launchImageLibrary } from 'react-native-image-picker';

const ProfileScreen = () => {
  const user = auth().currentUser;
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');
  const [bio, setBio] = useState('');
  const [profilePic, setProfilePic] = useState(user?.photoURL || 'https://via.placeholder.com/150');
  const [editingField, setEditingField] = useState('');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    if (user) {
      try {
        const userDoc = await firestore().collection('users').doc(user.uid).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          if (userData) {
            setFirstName(userData.firstName || '');
            setLastName(userData.lastName || '');
            setLocation(userData.location || '');
            setBio(userData.bio || '');
          }
        } else {
          // If the document doesn't exist, create it with default values
          const defaultData = {
            firstName: '',
            lastName: '',
            location: '',
            bio: '',
          };
          await firestore().collection('users').doc(user.uid).set(defaultData);
          setFirstName('');
          setLastName('');
          setLocation('');
          setBio('');
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        Alert.alert('Error', 'Failed to load profile data');
      }
    } else {
      console.log('No user is currently signed in');
      // Optionally, you can redirect to the login screen or show an alert here
    }
  };

  const handleSignOut = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Error signing out: ', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleSaveField = async (field) => {
    try {
      const updateData = {};
      if (field === 'name') {
        updateData.firstName = firstName;
        updateData.lastName = lastName;
        await user?.updateProfile({ 
          displayName: `${firstName} ${lastName}`,
        });
      } else {
        switch(field) {
          case 'firstName':
            updateData[field] = firstName;
            break;
          case 'lastName':
            updateData[field] = lastName;
            break;
          case 'location':
            updateData[field] = location;
            break;
          case 'bio':
            updateData[field] = bio;
            break;
          default:
            console.error('Unknown field:', field);
            return;
        }
      }
      
      if (user) {
        await firestore().collection('users').doc(user.uid).update(updateData);
        
        console.log('Field updated:', updateData);
        setEditingField('');
        Alert.alert('Success', 'Profile updated successfully');
      } else {
        throw new Error('No user is currently signed in');
      }
    } catch (error) {
      console.error('Error updating profile: ', error);
      Alert.alert('Error', 'Failed to update profile');
    }
  };

  const handleChangeProfilePic = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to pick image');
      } else if (response.assets && response.assets.length > 0) {
        const source = { uri: response.assets[0].uri };
        setProfilePic(source.uri);
        try {
          await user?.updateProfile({ photoURL: source.uri });
          await firestore().collection('users').doc(user.uid).update({ photoURL: source.uri });
        } catch (error) {
          console.error('Error updating profile picture:', error);
          Alert.alert('Error', 'Failed to update profile picture');
        }
      }
    });
  };

  const renderEditableField = (label, value, field, setFunction) => (
    <View style={styles.fieldContainer}>
      <Text style={styles.label}>{label}:</Text>
      {editingField === field ? (
        <View style={styles.editContainer}>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={setFunction}
            autoFocus
          />
          <TouchableOpacity style={styles.saveButton} onPress={() => handleSaveField(field)}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity onPress={() => setEditingField(field)}>
          <Text style={styles.text}>{value || 'Not set'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileHeader}>
        <TouchableOpacity onPress={handleChangeProfilePic}>
          <Image
            style={styles.profilePic}
            source={{ uri: profilePic }}
          />
          <Text style={styles.changePhotoText}>Change Photo</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.profileInfo}>
        {renderEditableField('First Name', firstName, 'firstName', setFirstName)}
        {renderEditableField('Last Name', lastName, 'lastName', setLastName)}
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.text}>{user?.email}</Text>
        {renderEditableField('Location', location, 'location', setLocation)}
        {renderEditableField('Bio', bio, 'bio', setBio)}
      </View>
      <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePic: {
    width: 150,
    height: 150,
    borderRadius: 75,
    marginBottom: 10,
  },
  changePhotoText: {
    color: '#007AFF',
    textAlign: 'center',
  },
  profileInfo: {
    alignItems: 'flex-start',
    width: '100%',
  },
  fieldContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    color: '#007AFF',
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 5,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
  },
  signOutButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;

// ... (styles remain unchanged)

export default ProfileScreen;