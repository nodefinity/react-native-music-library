import { useEffect, useState, useCallback } from 'react';
import { Platform } from 'react-native';
import {
  check,
  PERMISSIONS,
  request,
  RESULTS,
  type PermissionStatus,
} from 'react-native-permissions';

interface PermissionResponse {
  status: PermissionStatus;
  granted: boolean;
  canAskAgain: boolean;
  accessPrivileges?: string;
}

export const usePermission = () => {
  const [permissionStatus, setPermissionStatus] =
    useState<PermissionResponse | null>(null);

  const getAudioPermission = () => {
    if (Platform.OS === 'ios') {
      return PERMISSIONS.IOS.MEDIA_LIBRARY;
    } else {
      const androidVersion =
        typeof Platform.Version === 'string'
          ? parseInt(Platform.Version, 10)
          : Platform.Version;

      if (androidVersion >= 33) {
        return PERMISSIONS.ANDROID.READ_MEDIA_AUDIO;
      } else {
        return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
      }
    }
  };

  const checkPermissions = useCallback(async () => {
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
      return permissionResponse;
    } catch (error) {
      console.error('Check permission failed:', error);
      throw error;
    }
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
      return permissionResponse;
    } catch (error) {
      console.error('Request permission failed:', error);
      throw error;
    }
  };

  useEffect(() => {
    checkPermissions();
  }, [checkPermissions]);

  return {
    permissionStatus,
    checkPermissions,
    requestPermissions,
  };
};
