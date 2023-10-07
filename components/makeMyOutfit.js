import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, StyleSheet, Text, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import axios from 'axios';
import OpenAI from "openai";

const MakeMyOutfitUI = ({ route }) => {
  const { session } = route.params;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [translatedResponse, setTranslatedResponse] = useState('');
  
  const apiKey = ''; // Replace with your actual API key
  const openai = new OpenAI({
    apiKey
  });
  
  const translateText = async (message) => {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            "role": "system",
            "content": "You are a stylist who needs to help me a male decide on one outfit. To decide on the outfit you should do it in this hierarchy: socially acceptable, then color theory. It has to be clothes in their wardrobe do not mention clothes that are not in their wardrobe. If you think that there is nothing in this person's wardrobe that is acceptable for the event they are attending you should mention that based on what is in their wardrobe. If you think they would like an outfit that is not socially acceptable for said event you should mention that type of outfit isn't socially acceptable for said event but give them an outfit with their wardrobe. It should be outputted in this exactly in this format so don't say anything before the outfit: \"\nOutfit: \nTop:\n Your x, \nBottom:  \nYour x, \nshoes: \nYour x\n\" If the user mentions where they are going tell them to enjoy said event. If they don't mention where they are going just say \"enjoy your new drip!\""
          },
          {
            "role": "user",
            "content": "My wardrobe include: \"Blue Dress shirt, White Polo shirt, Black Button-down shirt, Pink Blouse, Yellow Flannel shirt, Gray Henley shirt, Green Tank top, Blue Jeans, Black Slacks, Khaki Chinos, Brown Cargo pants, Gray Sweatpants, White Sneakers, Brown Loafers, Black Oxford shoes, Red High-top sneakers, Blue Running shoes, Purple V-neck sweater, Striped long-sleeve shirt, Floral-print blouse, Plaid flannel shirt, Orange graphic tee, Maroon polo shirt, Denim jacket, Gray turtleneck sweater, Olive cargo shorts, Camouflage joggers, White linen pants, Slim-fit gray trousers, Corduroy pants, Ripped skinny jeans, Leather biker pants, Black yoga leggings, High-heeled ankle boots, Canvas slip-on sneakers, Suede desert boots, Patent leather loafers, Hiking sandals, Classic Converse Chuck Taylors, Wingtip brogues, Athletic running shoes\""
          },
          {
            "role": "user",
            "content": message
          }
        ],
        temperature: 1,
        max_tokens: 738,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      });
      const translated = response.choices[0].message;
      console.log(translated);
      setTranslatedResponse(translated);
      // console.log(response.data.choices[0].text.trimStart());
   
       return translated; // Return the translated text
     } catch (error) {
       console.error('Error translating text:', error);
       throw error; // Rethrow the error for handling in sendMessage
     }
   };

   const sendMessage = async () => {
    if (message.trim() !== '') {
      // Set the user's message immediately
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: message, user: true },
      ]);
      setMessage('');
  
      // Always call the translation function
      try {
        const translatedText = await translateText(message);
        // Update the translated message in the state
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: translatedText, user: false },
        ]);
      } catch (error) {
        console.error('Error translating text:', error);
      }
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#1D1D20", marginBottom: 80,}}>
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
    >
      <View style={styles.header}></View>
      <View style={styles.messagesContainer}>
      <FlatList
  data={messages}
  renderItem={({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.user ? styles.userMessage : styles.translatedMessage,
      ]}
    >
      <Text style={styles.message}>
        {item.user ? item.text : item.text.content}
      </Text>
    </View>
  )}
  keyExtractor={(_, index) => index.toString()}
  contentContainerStyle={styles.messagesContent}
/>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          marginBottom={0}
          keyboardAppearance='dark'
          onChangeText={(text) => setMessage(text)}
          placeholder="Type a message..."
          placeholderTextColor="#888"
        />
        <Button title="Send" onPress={sendMessage} color="#cd9625" />
      </View>
    </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#1D1D20',
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 10,
    paddingBottom: 20,
  },
  messageContainer: {
    borderRadius: 20,
    paddingVertical: 10,
    padding: 15,
    marginBottom: 15,
    
    maxWidth: '70%', // Limit the width of message containers
  },
  userMessage: {
    backgroundColor: 'white',
    alignSelf: 'flex-end',
  },
  translatedMessage: {
    backgroundColor: '#cd9625',
    alignSelf: 'flex-start',
  },
  message: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2B2D2F',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    marginRight: 10,
    color: 'white',
    borderRadius: 20,
    paddingHorizontal: 10,
    backgroundColor: "#2B2D2F",
  },

  //#cd9625
});
export default MakeMyOutfitUI;
