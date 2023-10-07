import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import View from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import MakeMyOutfitUI from "./makeMyOutfit";
import ClosetUI from "./closet";

const Tab = createBottomTabNavigator();

const TabNavigator = ({ route }) => {
  const { session } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          paddingHorizontal: 5,
          paddingTop: 0,
          backgroundColor: "#111111",
          //position: "absolute",
          borderTopWidth: 1.5,
          borderTopColor: "#1D1D20",
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === "MakeMyOutfit") {
            return (
              <MaterialIcons
                name="chat-bubble-outline"
                size={24}
                color={focused ? "white" : "grey"}
              />
            );
          } else if (route.name === "Closet") {
            return (
              <Foundation
                name="home"
                size={24}
                color={focused ? "white" : "grey"}
              />
            );
          }
        },
        tabBarLabel: () => null,
      })}
    >
      <Tab.Screen
        name="Closet"
        component={ClosetUI}
        initialParams={{ session }}
      />

      <Tab.Screen
        name="MakeMyOutfit"
        component={MakeMyOutfitUI}
        initialParams={{ session }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
