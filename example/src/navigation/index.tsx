import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../pages/HomeScreen';
import TrackListScreen from '../pages/TrackListScreen';
import PlayerScreen from '../pages/PlayerScreen';

export type RootStackParamList = {
  Home: undefined;
  TrackList: undefined;
  Player: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="TrackList"
          component={TrackListScreen}
          options={{
            title: 'Track List',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{
            title: 'Player',
            headerBackTitle: 'Back',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
