import { StyleSheet, View, Text, Alert, StatusBar, Button } from 'react-native';
import { getTracksAsync } from 'react-native-music-library';
import Permission from './Permission';

export default function App() {
  const getAllTracks = async () => {
    try {
      const results = await getTracksAsync();
      console.log(results, 'tracks');
      Alert.alert('Success', JSON.stringify(results));
    } catch (e) {
      console.error(e, 'error');
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>React Native Music Library</Text>

        <Permission />

        <View style={styles.buttonContainer}>
          <View style={styles.buttonSpacer} />
          <Button title="Get All Tracks" onPress={getAllTracks} />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonSpacer: {
    height: 15,
  },
});
