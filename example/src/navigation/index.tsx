import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import IndexScreen from '../pages/IndexScreen';
import PlayerScreen from '../pages/PlayerScreen';

export type RootStackParamList = {
  Index: undefined;
  Player: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Index"
          component={IndexScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Player"
          component={PlayerScreen}
          options={{
            title: '正在播放',
            headerBackTitle: '返回',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
