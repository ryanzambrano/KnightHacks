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
import { Dropdown } from "react-native-element-dropdown";

// Inside the AddClothingItem component:

const clothingTypeOptions = [
  { label: "Hat", value: "hat" },
  { label: "Shirt", value: "shirt" },
  { label: "Pants", value: "pants" },
  { label: "Shoes", value: "shoes" },
  // Add other colors...
];

const colorOptions = [
  { label: "Red", value: "red" },
  { label: "Blue", value: "blue" },
  // Add other colors...
];

const fitOptions = [
  { label: "Loose", value: "loose" },
  { label: "Tight", value: "tight" },
  // ... other fits
];

const materialOptions = [
  { label: "Cotton", value: "cotton" },
  { label: "Polyester", value: "polyester" },
  // ... other materials
];

const settingOptions = [
  { label: "Casual", value: "casual" },
  { label: "Formal", value: "formal" },
  // ... other types
];

const AddClothingItem = ({ route }) => {
  const navigation = useNavigation();
  const { session } = route.params;
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFit, setSelectedFit] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // New state variable
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const handleImageSelection = async () => {
    // Just the selection process
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const imagePickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      base64: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!imagePickerResult.canceled) {
      setSelectedImage(imagePickerResult.assets[0].uri); // Set the selected image URI
    }
  };

  const handleImageUpload = async () => {
    try {
      const timestamp = new Date().toISOString();

      const compressedImage = await manipulateAsync(selectedImage, [], {
        compress: 0.2,
        format: "jpeg",
        base64: true,
      });

      const buffer = decode(compressedImage.base64);
      const filename = `${session.user.id}/${session.user.id}-${timestamp}`;

      const { data: imageData, error: uploadError } = await supabase.storage
        .from("user_pictures")
        .upload(filename, buffer, {
          contentType: "image/jpeg",
        });
      createTimestamp(session.user.id, timestamp);
      if (uploadError) {
        alert(uploadError.message);
        return;
      }

      const { data, error } = await supabase.from("user_images").insert([
        {
          user_id: session.user.id,
          last_modified: timestamp,
          clothing_type: selectedType,
          color: selectedColor,
          fit: selectedFit,
          material: selectedMaterial,
          setting: selectedSetting,
          // ... add other fields as necessary
        },
      ]);

      if (error) {
        alert(error.message);
      } else {
        alert("uploaded successfully");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.mainHeader}>Add Clothing Item</Text>
        <ScrollView style={{ height: "90%" }}>
          <TouchableOpacity
            style={styles.imageBox}
            onPress={handleImageSelection}
          >
            {selectedImage ? ( // If an image is selected, show it
              <Image
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "100%", borderRadius: 15 }}
              />
            ) : (
              // Otherwise show the + sign
              <Text style={styles.addText}>+</Text>
            )}
          </TouchableOpacity>

          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Type of Clothing:</Text>
            <Dropdown
              style={styles.dropdown}
              data={clothingTypeOptions}
              placeholder="Select Clothing Type"
              maxHeight={300}
              labelField="label"
              valueField="value"
              selectedTextStyle={styles.placeholderText}
              itemTextStyle={styles.placeholderText}
              itemContainerStyle={styles.listContainer}
              containerStyle={styles.border}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              activeColor="#2D2D30"
              value={selectedType}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                // <-- This is the issue.
                setSelectedType(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          <View style={styles.divider}></View>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Color:</Text>
            <Dropdown
              style={styles.dropdown}
              data={colorOptions}
              placeholder="Select Fit"
              maxHeight={300}
              labelField="label"
              valueField="value"
              selectedTextStyle={styles.placeholderText}
              itemTextStyle={styles.placeholderText}
              itemContainerStyle={styles.listContainer}
              containerStyle={styles.border}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              activeColor="#2D2D30"
              value={selectedColor}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setSelectedColor(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          <View style={styles.divider}></View>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Fit:</Text>
            <Dropdown
              style={styles.dropdown}
              data={fitOptions}
              placeholder="Select Color"
              maxHeight={300}
              labelField="label"
              valueField="value"
              selectedTextStyle={styles.placeholderText}
              itemTextStyle={styles.placeholderText}
              itemContainerStyle={styles.listContainer}
              containerStyle={styles.border}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              activeColor="#2D2D30"
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              value={selectedFit}
              onChange={(item) => {
                setSelectedFit(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          <View style={styles.divider}></View>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Material:</Text>
            <Dropdown
              style={styles.dropdown}
              data={materialOptions}
              placeholder="Select Material"
              maxHeight={300}
              labelField="label"
              valueField="value"
              selectedTextStyle={styles.placeholderText}
              itemTextStyle={styles.placeholderText}
              itemContainerStyle={styles.listContainer}
              containerStyle={styles.border}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              activeColor="#2D2D30"
              value={selectedMaterial}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setSelectedMaterial(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          <View style={styles.divider}></View>
          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Setting:</Text>
            <Dropdown
              style={styles.dropdown}
              data={settingOptions}
              placeholder="Select Setting"
              maxHeight={300}
              labelField="label"
              valueField="value"
              selectedTextStyle={styles.placeholderText}
              itemTextStyle={styles.placeholderText}
              itemContainerStyle={styles.listContainer}
              containerStyle={styles.border}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              activeColor="#2D2D30"
              value={selectedType}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setSelectedSetting(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          {selectedImage && (
            <Button title="Add Piece" onPress={handleImageUpload} />
          )}
        </ScrollView>
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

  headerContainer: {
    paddingBottom: 60,
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
    width: "85%",
    height: 325,
    backgroundColor: "white",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    alignSelf: "center",
  },
  addText: {
    fontSize: 50,
    color: "#1D1D20",
  },

  dropdownContainer: {
    padding: 10,
    width: "100%",
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 16,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "white",
    marginRight: 8,
    flexShrink: 1,
  },
  dropdown: {
    flex: 1,
    borderColor: "gray",

    //borderWidth: 0.5,
    borderRadius: 8,
    color: "white",
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: "white",
    backgroundColor: "#2D2D30",
  },
  listContainer: {
    backgroundColor: "#1D1D20",
  },
  border: {
    borderColor: "grey",
    borderRadius: 2,
    backgroundColor: "#1D1D20",
  },
  placeholderText: {
    color: "white",
    paddingLeft: 5,
    //backgroundColor: "white",
  },
  divider: {
    height: 0.5,
    paddingVertical: 0.4,
    marginRight: 18,
    marginLeft: 18,
    backgroundColor: "#2B2D2F",
    marginVertical: 8,
    marginHorizontal: -10,
  },
});

export default AddClothingItem;
