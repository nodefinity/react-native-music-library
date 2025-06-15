import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';
import { PlayerProvider } from './contexts/PlayerContext';
import { useSetupAudioPro } from './hooks/useSetupAudio';

function AppContent() {
  useSetupAudioPro();

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Navigation />
    </>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <PlayerProvider>
        <AppContent />
      </PlayerProvider>
    </SafeAreaProvider>
  );
}
