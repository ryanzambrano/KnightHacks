
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
import { useNavigation } from "@react-navigation/native";

const AddClothingItem = ({ route }) => {
    const navigation = useNavigation();
    const { session } = route.params;
    const handleImageUpload = async (index) => {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        alert("Permission to access camera roll is required!");
        return;
      }
  
      try {
        const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          base64: true,
          aspect: [1, 1],
          quality: 1,
        });
  
        if (!imagePickerResult.canceled) {
          const timestamp = new Date().toISOString();
  
          //deletePictures(index);
          const filename = `${session.user.id}/${session.user.id}-${timestamp}`;
  
          const compressedImage = await manipulateAsync(
            imagePickerResult.assets[0].uri,
            [], // No transforms
            { compress: 0.2, format: "jpeg", base64: true }
          );
          //compressedUri = compressedImage.uri;
          const buffer = decode(compressedImage.base64);
  
          const { data, error: uploadError } = await supabase.storage
            .from("user_pictures")
            .upload(filename, buffer, {
              contentType: "image/jpeg",
            });
  
          createTimestamp(session.user.id, timestamp);
  
          if (uploadError) {
            alert(uploadError.message);
          } else {
            alert("uploaded successfully");
          }
        }
      } catch (error) {
        alert(error.message);
      }
    };
    return (
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.headerContainer}>
            <Text style={styles.mainHeader}>Add Clothing Item</Text>
            <TouchableOpacity style={styles.imageBox} onPress={handleImageUpload}>
              <Text style={styles.addText}>+</Text>
            </TouchableOpacity>
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
    imageBox: {
        width: '85%',
        height: 325,
        backgroundColor: 'white',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        alignSelf: 'center',
      },
      addText: {
        fontSize: 50,
        color: '#1D1D20',
      },
  });

export default AddClothingItem;
