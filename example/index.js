import { AppRegistry, Platform } from 'react-native';
import App from './src/App';
import appJson from './app.json';
const appName = appJson.name;
import { setupAudioPro } from './src/hooks/useSetupAudio';

AppRegistry.registerComponent(appName, () => App);

setupAudioPro();

if (Platform.OS === 'web') {
  AppRegistry.runApplication(appName, {
    rootTag: document.getElementById('root'),
  });
}
