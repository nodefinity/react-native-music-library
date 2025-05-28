import { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Button,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';

interface PermissionResponse {
  status: PermissionStatus;
  granted: boolean;
  canAskAgain: boolean;
  accessPrivileges?: string;
}

export default function App() {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionResponse | null>(null);

  const getAudioPermission = () => {
    if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.MEDIA_LIBRARY;
    } else {
      // Android 13 (API 33) and above use granular media permissions
      const androidVersion =
        typeof Platform.Version === 'string'
          ? parseInt(Platform.Version, 10)
          : Platform.Version;

      if (androidVersion >= 33) {
        return PERMISSIONS.ANDROID.READ_MEDIA_AUDIO;
      } else {
        // Android 12 and below use traditional storage permissions
        return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    }
  };

  const checkPermissions = async () => {
    try {
      const permission = getAudioPermission();
      const result = await check(permission);

      const permissionResponse: PermissionResponse = {
        status: result,
        granted: result === RESULTS.GRANTED,
        canAskAgain:
          result === RESULTS.DENIED || result === RESULTS.UNAVAILABLE,
      };

      setPermissionStatus(permissionResponse);
      Alert.alert(
        'Permission Status',
        `Status: ${result}\nGranted: ${permissionResponse.granted ? 'Yes' : 'No'}`
      );
    } catch (error) {
      Alert.alert('Error', 'Check permission failed');
      console.error('Check permission failed:', error);
    }
  };

  const requestPermissions = async () => {
    try {
      const permission = getAudioPermission();
      const result = await request(permission);

      const permissionResponse: PermissionResponse = {
        status: result,
        granted: result === RESULTS.GRANTED,
        canAskAgain: result === RESULTS.DENIED,
      };

      setPermissionStatus(permissionResponse);

      if (permissionResponse.granted) {
        Alert.alert('Success', 'Audio permission granted!');
      } else {
        Alert.alert('Failed', 'Audio permission denied');
      }
    } catch (error) {
      Alert.alert('Error', 'Request permission failed');
      console.error('Request permission failed:', error);
    }
  };

  const getStatusColor = (status: PermissionStatus) => {
    switch (status) {
      case RESULTS.GRANTED:
        return '#4CAF50';
      case RESULTS.DENIED:
        return '#F44336';
      case RESULTS.UNAVAILABLE:
        return '#FF9800';
      case RESULTS.BLOCKED:
        return '#9C27B0';
      case RESULTS.LIMITED:
        return '#2196F3';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>React Native Music Library</Text>
        <Text style={styles.subtitle}>
          Get Audio Permission (using react-native-permissions)
        </Text>

        {permissionStatus && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>Current Permission Status:</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(permissionStatus.status) },
              ]}
            >
              <Text style={styles.statusText}>{permissionStatus.status}</Text>
            </View>
            <Text style={styles.statusDetail}>
              Granted: {permissionStatus.granted ? 'Yes' : 'No'}
            </Text>
            <Text style={styles.statusDetail}>
              Can Ask Again: {permissionStatus.canAskAgain ? 'Yes' : 'No'}
            </Text>
            {permissionStatus.accessPrivileges && (
              <Text style={styles.statusDetail}>
                Access Privileges: {permissionStatus.accessPrivileges}
              </Text>
            )}
          </View>
        )}

        <View style={styles.buttonContainer}>
          <Button title="Check Permission" onPress={checkPermissions} />
          <View style={styles.buttonSpacer} />
          <Button title="Request Permission" onPress={requestPermissions} />
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
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  statusContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusText: {
    color: 'white',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statusDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  buttonSpacer: {
    height: 15,
  },
  note: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  },
});
