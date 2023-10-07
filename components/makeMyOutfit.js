import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Button,
  Image,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./auth/supabase";
import { decode } from "base64-arraybuffer";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import { createTimestamp } from "./profileUtils.js";
import { router } from "websocket";

const MakeMyOutfitUI = ({ route }) => {
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.mainHeader}>My Closet</Text>
      
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1D1D20",
  },
  mainHeader: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginVertical: 10,
  },
  verticalScroll: {
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 20,
    color: "white",
    fontWeight: "bold",
    marginVertical: 10,
  },
  scrollview: {
    marginBottom: 20,
  },
  item: {
    marginRight: 10,
    padding: 15,
    backgroundColor: "#e5e5e5",
    borderRadius: 8,
  },
});

export default MakeMyOutfitUI;
