import React from "react";
import { StyleSheet, View, Text, ScrollView, SafeAreaView } from "react-native";

const ClosetUI = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.mainHeader}>My Closet</Text>
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
