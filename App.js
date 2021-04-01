// importing dependencies
import React, { Component } from 'react';
// import react Navigation
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// importing screens
import Start from './components/start';
import Chat from './components/chat';

const firebase = require('firebase');
require('firebase/firestore');
	
// creating the navigator
const Stack = createStackNavigator();

export default class ChatApp extends Component {
	render() {
		return (
			// Navigation between Start and Chat
			<NavigationContainer>
				<Stack.Navigator initialRouteName="Start">
					<Stack.Screen name="Start" component={Start} />
					<Stack.Screen name="Chat" component={Chat} />
				</Stack.Navigator>
			</NavigationContainer>
		);
	}
}