export const PERMISSIONS = {};
export const RESULTS = {
  UNAVAILABLE: 'unavailable',
  DENIED: 'denied',
  LIMITED: 'limited',
  GRANTED: 'granted',
  BLOCKED: 'blocked',
};
export const check = async () => RESULTS.GRANTED;
export const request = async () => RESULTS.GRANTED;
export const checkMultiple = async () => ({});
export const requestMultiple = async () => ({});
export const checkNotifications = async () => ({
  status: RESULTS.GRANTED,
  settings: {},
});
export const requestNotifications = async () => ({
  status: RESULTS.GRANTED,
  settings: {},
});
export const openSettings = async () => {};
