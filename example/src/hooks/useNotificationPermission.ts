import { useEffect } from 'react';
import { Platform, PermissionsAndroid } from 'react-native';

export function useNotificationPermission() {
  useEffect(() => {
    const requestNotificationPermission = async () => {
      if (Platform.OS === 'android') {
        try {
          if (Platform.Version >= 33) {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
              {
                title: 'Notification Permission',
                message:
                  'Need notification permission to show music playback control',
                buttonNeutral: 'Ask later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              }
            );
            console.log('Notification permission status:', granted);
          }
        } catch (err) {
          console.warn('Request notification permission failed:', err);
        }
      }
    };

    requestNotificationPermission();
  }, []);
}
