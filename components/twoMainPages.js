import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./tabNavigator";
import MakeMyOutfitUI from "./makeMyOutfit";
import ClosetUI from "./closet";


const Stack = createStackNavigator();

const TwoMainPages = ({ route }) => {
  const { session } = route.params;
  return (
    <NavigationContainer independent={true} style={{ marginBottom: -20 }}>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        style={{ marginBottom: -20 }}
      >
        <Stack.Screen
          name="Tabs"
          component={TabNavigator}
          initialParams={{ session }}
        />
        <Stack.Screen
          name="MakeMyOutfit"
          component={MakeMyOutfitUI}
          initialParams={{ session }}
        />
       
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default TwoMainPages;
