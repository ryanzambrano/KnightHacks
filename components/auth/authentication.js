import "react-native-url-polyfill";
import React from "react";
import SignIn from "./signIn.js";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

const Authentication = ({ navigation }) => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      {/*<Stack.Screen name="SignUp" component={SignUp} />*/}
    </Stack.Navigator>
  );
};

export default Authentication;
