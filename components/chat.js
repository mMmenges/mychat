import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { Bubble, Day, GiftedChat, InputToolbar, SystemMessage } from 'react-native-gifted-chat';
import AsynStorage from '@react-native-community/async-storage';
import NetInfo from '@react-native-community/netinfo';
import MapView from 'react-native-maps';
import CustomActions from './CustomActions';

const firebase = require('firebase');
require('firebase/firestore');

export default class Chat extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			text: '',
			messages: [],
			user: {
				_id: '',
				name: '',
				avatar: '',
			},
			isConnected: false,
			image: null,
			location: null,
		};

		// Firebase configuration for app
		const firebaseConfig = {
			apiKey: "AIzaSyB0v2DAZxRwji7iAg_-so3psN0pgMUmm6Q",
        authDomain: "test1-5a4d2.firebaseapp.com",
        projectId: "test1-5a4d2",
        storageBucket: "test1-5a4d2.appspot.com",
        messagingSenderId: "301781037413",
        //appId: "1:301781037413:web:7e8b8476587e5f4e8c718c",
        //measurementId: "G-DNW9NPHPDW"
		};

		// Initialize Firestore
		if (!firebase.apps.length) {
			firebase.initializeApp(firebaseConfig);
		}
	}

	componentDidMount() {
		// Define props passed from Start screen
		const { name } = this.props.route.params;

		// Populate user's name, if entered
		this.props.navigation.setOptions({ title: name });

		// Check if user is online
		NetInfo.fetch().then((connection) => {
			if (connection.isConnected) {
				console.log('online');
				this.setState({
					isConnected: true,
				});

				// Connect to Firestore to store messages in the database
				this.referenceChatMessages = firebase.firestore().collection('messages');

				// Authenticate user with Firebase
				this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
					if (!user) {
						firebase.auth().signInAnonymously();
					}
					this.setState({
						user: {
							_id: user.uid,
							name: name,
							avatar: 'https://placeimg.com/140/140/any',
							createdAt: new Date(),
						},
						messages: [],
					});
					this.unsubscribe = this.referenceChatMessages.orderBy('createdAt', 'desc').onSnapshot(this.onCollectionUpdate);
				});
			} else {
				console.log('offline');
				this.setState({
					isConnected: false,
				});
				this.getMessages();
				window.alert('You are currently offline and will not be able to send messages.');
			}
		});
	}

	componentWillUnmount() {
		// Stop listening for authentication
		this.unsubscribe();

		// Stop listening for collection changes
		this.authUnsubscribe();
	}

	// Load messages from storage when offline
	async getMessages() {
		let messages = [];
		try {
			messages = (await AsynStorage.getItem('messages')) || [];
			this.setState({
				messages: JSON.parse(messages),
			});
		} catch (error) {
			console.log(error.message);
		}
	}

	// Save messages locally when a new message is sent
	async saveMessages() {
		try {
			await AsynStorage.setItem('messages', JSON.stringify(this.state.messages));
		} catch (error) {
			console.log(error.message);
		}
	}

	// Add new message to Firestore db
	addMessage() {
		const message = this.state.messages[0];
		this.referenceChatMessages.add({
			_id: message._id,
			createdAt: message.createdAt,
			text: message.text || '',
			user: message.user,
			image: message.image || null,
			location: message.location || null,
		});
	}

	// Append new message to messages array
	onSend(messages = []) {
		this.setState(
			(previousState) => ({
				messages: GiftedChat.append(previousState.messages, messages),
			}),
			() => {
				this.addMessage();
				this.saveMessages();
			}
		);
	}

	// Update messages state when new message is added to Firestore db
	onCollectionUpdate = (querySnapshot) => {
		const messages = [];

		// Go through each document
		querySnapshot.forEach((doc) => {
			// Get the QueryDocumentSnapshot's data
			let data = doc.data();
			messages.push({
				_id: data._id,
				createdAt: data.createdAt.toDate(),
				text: data.text,
				user: {
					_id: data.user._id,
					name: data.user.name,
					avatar: data.user.avatar,
				},
				image: data.image || null,
				location: data.location || null,
			});
		});
		this.setState({
			messages,
		});
	};

	// Change styles for System Messages
	renderSystemMessage(props) {
		return (
			<SystemMessage
				{...props}
				textStyle={{
					color: '#fff',
					fontSize: 12,
					fontWeight: '600',
				}}
			/>
		);
	}

	// Change styles for date
	renderDay(props) {
		return (
			<Day
				{...props}
				textStyle={{
					color: '#fff',
					fontSize: 12,
					fontWeight: '600',
				}}
			/>
		);
	}

	// Change styles for chat bubbles
	renderBubble(props) {
		return (
			<Bubble
				{...props}
				wrapperStyle={{
					right: {
						backgroundColor: '#757083',
					},
				}}
			/>
		);
	}

	// Hide input bar if user is offline
	renderInputToolbar(props) {
		if (this.state.isConnected == false) {
		} else {
			return <InputToolbar {...props} />;
		}
	}

	// Import CustomActions to display ActionSheet
	renderCustomActions = (props) => {
		return <CustomActions {...props} />;
	};

	// Render view of map if location is included in message
	renderCustomView(props) {
		const { currentMessage } = props;
		if (currentMessage.location) {
			return (
				<MapView
					style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
					region={{
						latitude: Number(currentMessage.location.latitude),
						longitude: Number(currentMessage.location.longitude),
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421,
					}}
				/>
			);
		}
		return null;
	}

	render() {
		// Define props passed from Start screen
		const { color } = this.props.route.params;

		return (
			// Sets colorChoice from Start screen as Chat screen background color
			<View style={{ flex: 1, backgroundColor: color }}>
				<GiftedChat renderSystemMessage={this.renderSystemMessage.bind(this)} renderDay={this.renderDay.bind(this)} renderBubble={this.renderBubble.bind(this)} renderInputToolbar={this.renderInputToolbar.bind(this)} renderActions={this.renderCustomActions} renderCustomView={this.renderCustomView} messages={this.state.messages} onSend={(messages) => this.onSend(messages)} user={this.state.user} />

				{/* Prevent keyboard from hiding input field */}
				{Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null}
			</View>
		);
	}
}