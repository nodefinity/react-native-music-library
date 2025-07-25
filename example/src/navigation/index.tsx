import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../pages/HomeScreen';
import TrackListScreen from '../pages/TrackListScreen';
import PlayerScreen from '../pages/PlayerScreen';
import AlbumListScreen from '../pages/AlbumListScreen';
import AlbumTrackListScreen from '../pages/AlbumTrackListScreen';
import ArtistListScreen from '../pages/ArtistListScreen';
import ArtistAlbumAndTrackListScreen from '../pages/ArtistAlbumAndTrackListScreen';
import type { Album, Artist } from '@nodefinity/react-native-music-library';

export type RootStackParamList = {
  Home: undefined;
  TrackList: undefined;
  AlbumList: undefined;
  AlbumTrackList: { album: Album };
  ArtistList: undefined;
  ArtistAlbumAndTrackList: { artist: Artist };
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
          name="AlbumList"
          component={AlbumListScreen}
          options={{
            title: 'Album List',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="AlbumTrackList"
          component={AlbumTrackListScreen}
          options={{
            title: 'Album Tracks',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="ArtistList"
          component={ArtistListScreen}
          options={{
            title: 'Artist List',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="ArtistAlbumAndTrackList"
          component={ArtistAlbumAndTrackListScreen}
          options={{
            title: 'Artist Albums',
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
