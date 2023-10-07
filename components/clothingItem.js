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

import * as ImagePicker from "expo-image-picker";
import { supabase } from "./auth/supabase";
import { decode } from "base64-arraybuffer";
import { manipulateAsync, FlipType, SaveFormat } from "expo-image-manipulator";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Dropdown } from "react-native-element-dropdown";

// Inside the AddClothingItem component:

const clothingTypeOptions = [
  { label: "Hat", value: "hat" },
  { label: "Jacket / Suit:", value: "jacket / suit" },
  { label: "Shirt", value: "shirt" },
  { label: "Pants", value: "pants" },
  { label: "Shoes", value: "shoes" },
  { label: "Accessory", value: "accessory" },
];

const colorOptions = [
  { label: "Black", value: "black" },
  { label: "Blue", value: "blue" },
  { label: "Brown", value: "brown" },
  { label: "Green", value: "green" },
  { label: "Grey", value: "grey" },
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
];

const ClothingItem = ({ route }) => {
  const navigation = useNavigation();
  const { session } = route.params;
  const { item } = route.params;
  console.log(item.url);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFit, setSelectedFit] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [clothingName, setClothingName] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  // New state variable
  const [selectedSetting, setSelectedSetting] = useState(null);
  const [isFocus, setIsFocus] = useState(false);
  const [fetched, setFetched] = useState(false);

  const saveImageData = async () => {
    try {
      const { data, error } = await supabase
        .from("user_images")
        .update([
          {
            clothing_type: selectedType,
            color: selectedColor,
            fit: selectedFit,
            material: selectedMaterial,
            setting: selectedSetting,
            name: clothingName,
          },
        ])
        .eq("url", item.url);

      if (error) {
        alert(error.message);
      } else {
        alert("uploaded successfully");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  async function fetchItem() {
    try {
      const { data, error } = await supabase
        .from("user_images")
        .select("clothing_type, color, fit, material, setting, name")
        .eq("url", item.url)
        .single();

      if (error) throw error;

      if (data) {
        setClothingName(data.name);
        setSelectedType(data.clothing_type);
        setSelectedColor(data.color);
        setSelectedFit(data.fit);
        setSelectedMaterial(data.material);
        setSelectedSetting(data.setting);
        setFetched(true);
      } else {
        alert("Name not found.");
      }
    } catch (error) {
      alert(error.message);
    }
  }
  useEffect(() => {
    if (!fetched) {
      fetchItem();
    }
  });
  [fetched];

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.headerContainer}>
        <Text style={styles.mainHeader}>Clothing Item</Text>
        <ScrollView style={{ height: "90%" }}>
          <Image
            source={{ uri: item.url }}
            style={{
              width: "85%",
              height: 325,
              borderRadius: 15,
              alignSelf: "center",
            }}
          />

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
              placeholderStyle={{ color: "white" }}
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
              placeholderStyle={{ color: "white" }}
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
              placeholderStyle={{ color: "white" }}
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
              placeholderStyle={{ color: "white" }}
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
              placeholderStyle={{ color: "white" }}
              selectedTextStyle={styles.placeholderText}
              itemTextStyle={styles.placeholderText}
              itemContainerStyle={styles.listContainer}
              containerStyle={styles.border}
              autoScroll={false}
              showsVerticalScrollIndicator={false}
              activeColor="#2D2D30"
              value={selectedSetting}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={(item) => {
                setSelectedSetting(item.value);
                setIsFocus(false);
              }}
            />
          </View>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
              gap: 20,
            }}
          >
            <TouchableOpacity style={styles.addButton} onPress={saveImageData}>
              <Text style={styles.addButtonText}>Update Piece</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              //onPress={delete}
            >
              <Text style={styles.addButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
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
    marginTop: 10,
    marginBottom: 25,
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
    paddingBottom: 0,
  },
  scrollview: {
    marginBottom: 0,
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
    //marginBottom: 40,
    //marginHorizontal: 140,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10, // or any margin if needed
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 7,
    //marginBottom: 40,
    //marginHorizontal: 140,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10, // or any margin if needed
    
  },
});

export default ClothingItem;
