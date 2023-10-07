import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons, Foundation } from "@expo/vector-icons";

import MakeMyOutfitUI from "./makeMyOutfit";
import ClosetUI from "./closet";
import AddClothingItem from "./addClothingItem";  // Assuming this exists

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }) => (
    <TouchableOpacity
        style={{
            top: -25,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow
        }}
        onPress={onPress}
    >
        <View style={{
            width: 50,
            height: 50,
            borderRadius: 35,
            backgroundColor: '#00BFA6'
        }}>
            {children}
        </View>
    </TouchableOpacity>
);

const TabNavigator = ({ route }) => {
  const { session } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: -10,
         
          elevation: 0,
          backgroundColor: "#111111",
          borderRadius: 5,
          height: 100,
          ...styles.shadow
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
            return (
              <MaterialIcons
                name="add"
                size={24}
                color="white"
              />
            );
          }
        }
      })}
    >
      <Tab.Screen
        name="MakeMyOutfit"
        component={MakeMyOutfitUI}
        initialParams={{ session }}
      />
    
    <Tab.Screen
        name="Add"   
        component={AddClothingItem}
        initialParams={{ session }}
        options={{     
          tabBarIcon: ({ focused }) => (
            <MaterialIcons
              name="add"
              size={24}
              color="#FFF"
            />
    
          ),
          tabBarButton: (props) => (
            <CustomTabBarButton {...props} />
          )
          
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

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5
  }
})

export default TabNavigator;
