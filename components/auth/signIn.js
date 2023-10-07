import React, { useState, useRef } from "react";
import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { supabase } from "./supabase.js";
import { startShakeAnimation } from "./profileUtils.js";

export const SignIn = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const shakeAnimationValue = useRef(new Animated.Value(0)).current;
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  async function validateUserSession() {
    const {
      data: { user, error },
    } = await supabase.auth.getUser();
    if (error) {
      console.error(error.message);
    } else if (user == null) {
      console.error("invalid authentication");
    }
  }

  async function signInUser(email, password) {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError("Invalid email or password, please try again");
      startShakeAnimation(shakeAnimationValue); // Set error message
      setLoading(false);
    } else {
      validateUserSession();
    }
  }

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const shakeAnimationStyle = {
    transform: [
      {
        translateX: shakeAnimationValue.interpolate({
          inputRange: [-1, 0, 1],
          outputRange: [-5, 0, 5],
        }),
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#111111" }}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image source={logo} style={styles.headerImage} alt="Logo " />
            <Text style={styles.titleText}>Sign into Outfitme</Text>
            <Text style={styles.sloganText}>
              create absolutely BANGIN outfits!
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputHeader}>Email Address:</Text>
              <TextInput
                style={styles.inputControl}
                hi
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                placeholderTextColor="#6b7280"
                value={form.email}
                onChangeText={(email) => setForm({ ...form, email })}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputHeader}>Password:</Text>
              <TextInput
                style={styles.inputControl}
                styles={styles.inputControl}
                autoCorrect={false}
                placeholderTextColor="#6b7280"
                value={form.password}
                onChangeText={(password) => setForm({ ...form, password })}
                secureTextEntry={true}
              />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity
                onPress={() => {
                  signInUser(form.email, form.password);
                }}
              >
                <View style={styles.continue}>
                  <Text style={styles.continueText}>Sign in</Text>
                </View>
              </TouchableOpacity>
            </View>
            {error && (
              <Animated.Text style={[styles.errorText, shakeAnimationStyle]}>
                {error}
              </Animated.Text>
            )}
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("SignUp");
              }}
              style={{ marginTop: "auto" }}
            >
              <Text style={styles.formFooter}>
                Don't have an account?{" "}
                <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
      <StatusBar style="light" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    flex: 1,
  },

  header: {
    marginVertical: 36,
  },

  headerImage: {
    width: 90,
    height: 90,
    alignSelf: "center",
    marginBottom: 25,
  },

  titleText: {
    fontFamily: "Verdana-Bold",
    fontSize: 27,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    color: "#fff",
  },

  sloganText: {
    //fontFamily: "Verdana",
    fontSize: 17,
    fontWeight: "500",
    color: "#929292",
    textAlign: "center",
  },

  input: {
    marginBottom: 16,
  },

  inputHeader: {
    fontSize: 17,
    fontWeight: "500",
    color: "#fff",
    marginBottom: 10,
  },

  inputControl: {
    backgroundColor: "#1D1D20",
    color: "#fff",
    fontWeight: "500",
    height: 44,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
  },

  form: {
    marginBottom: 24,
    flex: 1,
  },

  formAction: {
    marginVertical: 24,
  },

  formFooter: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    textAlign: "center",
    letterSpacing: 0.15,
  },

  continue: {
    marginTop: 5,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#14999999",
    //borderColor: "#14999999",
  },

  continueText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },

  none: {},
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default SignIn;
