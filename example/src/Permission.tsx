import { useEffect, useState } from 'react';
import { Alert, Button, Platform, StyleSheet, Text, View } from 'react-native';
import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';
import { globalStyles } from './Styles';

interface PermissionResponse {
  status: PermissionStatus;
  granted: boolean;
  canAskAgain: boolean;
  accessPrivileges?: string;
}

export default function Permission() {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionResponse | null>(null);
  const [isFirstCheck, setIsFirstCheck] = useState(true);

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

      setIsFirstCheck(false);

      if (!isFirstCheck) {
        Alert.alert('Permission Status', JSON.stringify(permissionResponse));
      }

      setPermissionStatus(permissionResponse);
    } catch (error) {
      Alert.alert('Error', 'Check permission failed');
      console.error('Check permission failed:', error);
    }
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  if (!permissionStatus) {
    return null;
  }

  return (
    <>
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

      <View style={globalStyles.buttonContainer}>
        <Button title="Check Permission" onPress={checkPermissions} />
        <View style={globalStyles.buttonSpacer} />
        <Button title="Request Permission" onPress={requestPermissions} />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
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
  note: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 30,
    fontStyle: 'italic',
  },
});
