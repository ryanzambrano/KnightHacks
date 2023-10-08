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
import { TextInput } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "./auth/supabase";
import { decode } from "base64-arraybuffer";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";

// Inside the AddClothingItem component:
const base_url =
  "https://vzdnrdsqkzwzihnqfong.supabase.co/storage/v1/object/public/user_pictures";

const clothingTypeOptions = [
  { label: "Hat", value: "hat" },
  { label: "Jacket / Sweater", value: "jacket /sweater" },
  { label: "Shirt", value: "shirt" },
  { label: "Pants", value: "pants" },
  { label: "Shoes", value: "shoes" },
  { label: "Accessory", value: "accessory" },
  { label: "Suit / Dress:", value: "suit / dress" },
];

const colorOptions = [
  { label: "Black", value: "black" },
  { label: "Blue", value: "blue" },
  { label: "Brown", value: "brown" },
  { label: "Green", value: "green" },
  { label: "Grey", value: "grey" },
  { label: "Silver", value: "silver" },
  { label: "Gold", value: "gold" },
  { label: "Orange", value: "orange" },
  { label: "Pink", value: "pink" },
  { label: "Purple", value: "purple" },
  { label: "Red", value: "red" },
  { label: "White", value: "white" },
  { label: "Cream", value: "cream" },
  { label: "Yellow", value: "yellow" },
  { label: "Violet", value: "violet" },
];

const fitOptions = [
  { label: "Loose", value: "loose" },
  { label: "Tight", value: "tight" },
  { label: "Regular", value: "regular" },
  { label: "Slim", value: "slim" },
  { label: "Relaxed", value: "relaxed" },
  { label: "Baggy", value: "baggy" },
  { label: "Fitted", value: "fitted" },
  { label: "Oversized", value: "oversized" },
  { label: "Tailored", value: "tailored" },
  { label: "Stretch", value: "stretch" },
];

const materialOptions = [
  { label: "Cotton", value: "cotton" },
  { label: "Polyester", value: "polyester" },
  { label: "Silk", value: "silk" },
  { label: "Denim", value: "denim" },
  { label: "Wool", value: "wool" },
  { label: "Linen", value: "linen" },
  { label: "Leather", value: "leather" },
  { label: "Metal", value: "metal" },
  { label: "Suede", value: "suede" },
  { label: "Rayon", value: "rayon" },
  { label: "Spandex", value: "spandex" },
  { label: "Nylon", value: "nylon" },
  { label: "Velvet", value: "velvet" },
  { label: "Cashmere", value: "cashmere" },
];

const settingOptions = [
  { label: "Casual", value: "casual" },
  { label: "Formal", value: "formal" },
  { label: "Fashion", value: "fashion" },
  { label: "Business Casual", value: "business_casual" },
  { label: "Athletic", value: "athletic" },
  { label: "Party", value: "party" },
  { label: "Outdoor", value: "outdoor" },
  { label: "Beach", value: "beach" },
  { label: "Lounge", value: "lounge" },
  { label: "Night Out", value: "night_out" },
  { label: "Travel", value: "travel" },
  { label: "Festival", value: "festival" },
  { label: "Wedding", value: "wedding" },
  { label: "Costume", value: "costume" },
];

const AddClothingItem = ({ route }) => {
  const navigation = useNavigation();
  const { session } = route.params;
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFit, setSelectedFit] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [clothingName, setClothingName] = useState("");
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
          name: clothingName,
          url: `${base_url}/${session.user.id}/${session.user.id}-${timestamp}`,
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

          <Text
            style={{
              fontSize: 20,
              fontWeight: "500",
              color: "white",
              marginRight: 8,
              flexShrink: 1,
            }}
            alignSelf={"center"}
            paddingTop={20}
          >
            Name:
          </Text>
          <TextInput
            style={styles.textInput}
            placeholder="Name of Clothing"
            placeholderTextColor="white"
            fontSize={15}
            value={clothingName}
            onChangeText={setClothingName}
          />

          <View style={styles.filterContainer}>
            <Text style={styles.filterLabel}>Type of Clothing:</Text>
            <Dropdown
              style={styles.dropdown}
              data={clothingTypeOptions}
              placeholder="Select Clothing Type"
              placeholderTextColor="white"
              maxHeight={300}
              placeholderStyle={{ color: "white" }}
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
              placeholderStyle={{ color: "white" }}
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
              placeholderStyle={{ color: "white" }}
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
              placeholderStyle={{ color: "white" }}
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
              placeholderStyle={{ color: "white" }}
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

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleImageUpload}
          >
            <Text style={styles.addButtonText}>Add Piece</Text>
          </TouchableOpacity>
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
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginTop: 10,
    marginBottom: 20,
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
    marginBottom: -50,
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
    backgroundColor: "lightgrey",
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
  textInput: {
    borderColor: "#A5A5A5",
    //borderWidth: 1,
    borderRadius: 8,
    height: 40,
    width: "90%",
    color: "white",
    paddingHorizontal: 8,
    paddingVertical: 10,
    marginTop: 15,
    marginBottom: 20,
    alignSelf: "center",
    width: "85%",
    backgroundColor: "#2D2D30",
  },
  addButton: {
    backgroundColor: "#cd9625",
    padding: 10,
    marginBottom: 70,
    marginHorizontal: 140,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10, // or any margin if needed
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default AddClothingItem;
