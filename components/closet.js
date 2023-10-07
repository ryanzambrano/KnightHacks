import React from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from "react-native";

const ClosetUI = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.mainHeader}>My Closet</Text>
      <ScrollView style={styles.verticalScroll}>
        <Text style={styles.header}>Hats</Text>
        <ScrollView horizontal={true} style={styles.scrollview}>
          {/* Sample items for shoes */}
          <View style={styles.item}>
            <Text>Hat 1</Text>
          </View>
          <View style={styles.item}>
            <Text>Hat 2</Text>
          </View>
          <View style={styles.item}>
            <Text>Hat 3</Text>
          </View>
          {/* ... add more shoes as needed */}
        </ScrollView>
        <Text style={styles.header}>Shirts</Text>
        <ScrollView horizontal={true} style={styles.scrollview}>
          {/* Sample items for shirts */}
          <View style={styles.item}>
            <Text>Shirt 1</Text>
          </View>
          <View style={styles.item}>
            <Text>Shirt 2</Text>
          </View>
          <View style={styles.item}>
            <Text>Shirt 3</Text>
          </View>
          {/* ... add more shirts as needed */}
        </ScrollView>

        <Text style={styles.header}>Pants</Text>
        <ScrollView horizontal={true} style={styles.scrollview}>
          {/* Sample items for pants */}
          <View style={styles.item}>
            <Text>Pant 1</Text>
          </View>
          <View style={styles.item}>
            <Text>Pant 2</Text>
          </View>
          <View style={styles.item}>
            <Text>Pant 3</Text>
          </View>
          {/* ... add more pants as needed */}
        </ScrollView>

        <Text style={styles.header}>Shoes</Text>
        <ScrollView horizontal={true} style={styles.scrollview}>
          {/* Sample items for shoes */}
          <View style={styles.item}>
            <Text>Shoe 1</Text>
          </View>
          <View style={styles.item}>
            <Text>Shoe 2</Text>
          </View>
          <View style={styles.item}>
            <Text>Shoe 3</Text>
          </View>
          {/* ... add more shoes as needed */}
        </ScrollView>

        <Text style={styles.header}>Accessories</Text>
        <ScrollView horizontal={true} style={styles.scrollview}>
          {/* Sample items for shoes */}
          <View style={styles.item}>
            <Text>Accessory 1</Text>
          </View>
          <View style={styles.item}>
            <Text>Accessory 2</Text>
          </View>
          <View style={styles.item}>
            <Text>Accessory 3</Text>
          </View>
          {/* ... add more shoes as needed */}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
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

export default ClosetUI;
