import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, Foundation } from "@expo/vector-icons";

import MakeMyOutfitUI from "./makeMyOutfit";
import ClosetUI from "./closet";
import AddClothingItem from "./addClothingItem";
import ClothingItem from "./clothingItem";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./tabNavigator";
const Stack = createStackNavigator();

// Assuming this exists
// Assuming this exists

const Tab = createBottomTabNavigator();

const TwoMainPages = ({ route }) => {
  const { session } = route.params;

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator mode="modal" screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          initialParams={{ session }}
        />
        <Stack.Screen
        name="AddClothingItem"
        component={AddClothingItem}
        initialParams={{ session }}
    />
        <Stack.Screen
          name="ClothingItem"
          component={ClothingItem}
          initialParams={{ session }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
const styles = StyleSheet.create({
  // shadow: {
  //   shadowColor: '#7F5DF0',
  //   shadowOffset: {
  //     width: 0,
  //     height: 10,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.5,
  //   elevation: 5
  // }
});

export default TwoMainPages;
