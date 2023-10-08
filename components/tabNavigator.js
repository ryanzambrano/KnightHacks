import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { MaterialIcons } from "@expo/vector-icons";
import { Foundation } from "@expo/vector-icons";
import { FontAwesome5 } from "@expo/vector-icons";
import MakeMyOutfitUI from "./makeMyOutfit";
import { useNavigation } from '@react-navigation/native';
import AddClothingItem from "./addClothingItem";
import ClosetUI from "./closet";

const Tab = createBottomTabNavigator();
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -25,
      justifyContent: "center",
      alignItems: "center",
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 50,
        height: 50,
        borderRadius: 35,
        backgroundColor: "#cd9625",
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

const TabNavigator = ({ route, navigation }) => {
  const { session } = route.params;
 

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: -10,
          elevation: 0,
          paddingHorizontal: 5,
          backgroundColor: "#111111",
          borderRadius: 5,
          height: 100,
          borderTopWidth: 0, 
          // ...styles.shadow
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
          } else if (route.name === "Add") {
            return <MaterialIcons name="add" size={24} color="white" />;
          }
        },
      })}
    >
      <Tab.Screen
        name="MakeMyOutfit"
        component={MakeMyOutfitUI}
        initialParams={{ session }}
      />

<Tab.Screen
    name="Add"
    component={View} // A placeholder, won't actually render this.
    listeners={{
        tabPress: e => {
            // Prevent the default tab press behavior
            e.preventDefault();
            
            // Navigate to your modal screen
            navigation.navigate('AddClothingItem');
        },
    }}
    options={{
        tabBarIcon: ({ focused }) => (
            <MaterialIcons name="add" size={24} color="#FFF" />
        ),
        tabBarButton: (props) => <CustomTabBarButton {...props} />,
    }}
/>


      <Tab.Screen
        name="Closet"
        component={ClosetUI}
        initialParams={{ session }}
      />
    </Tab.Navigator>
  );
};
export default TabNavigator;
