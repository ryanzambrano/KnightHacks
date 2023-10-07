import React, { useState, useEffect } from "react";
import { StyleSheet, View, Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { supabase } from "./components/auth/supabase.js";
//import { logo } from "./logo.png";

import Authentication from "./components/auth/authentication.js";
import Questionaire from "./components/questionaire.js";
import TwoMainPages from "./components/miscellaneous/ThreeMainPages.js";

const Stack = createStackNavigator(); // Creating a stack is important for navigation. Must initialize the stack with creatStackNavigator().

const App = () => {
  const [session, setSession] = useState(null);
  const [hasProfile, setHasProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
        checkUserProfile(session);
      } else {
        setSession(false);
        setIsLoading(false); // If there is no session, we stop loading and allow the Authentication component to render
      }
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        checkUserProfile(session);
      } else {
        setSession(false);
        setIsLoading(false); // If there is no session, we stop loading and allow the Authentication component to render
      }
    });
  }, []);

  const checkUserProfile = async (session) => {
    if (session?.user) {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profile")
        .select("profile_complete")
        .eq("user_id", session.user.id)
        .single();

      if (data == null) {
        // User does not have a profile, insert a new profile
        const { data, error } = await supabase
          .from("profile")
          .insert([{ user_id: session.user.id, profile_complete: false }]);
      }
      if (imageData == null) {
        const { data: imageData, error: imageError } = await supabase
          .from("user_images")
          .insert([{ user_id: session.user.id }]);
      }
      if (error || imageError) {
        setIsLoading(false);
        throw new Error("error.message");
      }

      if (data.profile_complete == true && ugcData.has_ugc == true) {
        const hasProfile = !!data.profile_complete;

        setHasProfile(true);
      } else {
        console.log("profile invalid");
      }
    }
    setIsLoading(false);
  };

  if (isLoading) {
    // Render a loading state or splash screen
    return (
      <View style={styles.container}>
        {/*<Image source={} style={styles.headerImage} alt="Logo " />*/}
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {session && session.user ? (
          hasProfile ? (
            <Stack.Screen
              key={session?.user?.id ?? "TwoMainPages"}
              name="TwoMainPages"
              component={TwoMainPages}
              initialParams={{ session }}
            />
          ) : (
            <Stack.Screen
              key={session?.user?.id ?? "questionaire"}
              name="questionaire"
              component={Questionaire}
              initialParams={{ session }}
            />
          )
        ) : (
          <>
            <Stack.Screen name="Authentication" component={Authentication} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
    justifySelf: "center",
    backgroundColor: "#111111",
    width: "100%",
  },
  headerImage: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 25,
  },
});

export default App;
