import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import firebase from 'firebase';
import 'firebase/firestore';

export default class CustomActions extends React.Component {
	constructor() {
		super();
	}

	// Displays ActionSheet when user clicks action button
	onActionPress = () => {
		const options = ['Choose From Library', 'Take Picture', 'Send Location', 'Cancel'];
		const cancelButtonIndex = options.length - 1;
		this.context.actionSheet().showActionSheetWithOptions(
			{
				options,
				cancelButtonIndex,
			},
			async (buttonIndex) => {
				switch (buttonIndex) {
					case 0:
						console.log('user wants to pick an image');
						return this.pickImage();
					case 1:
						console.log('user wants to take a photo');
						return this.takePhoto();
					case 2:
						console.log('user wants to share their location');
						return this.getLocation();
					default:
				}
			}
		);
	};

	// Allows user to choose image from their library to send
	pickImage = async () => {
		// Asks user for permission to access library
		const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

		if (status === 'granted') {
			// Launches image gallery to select image
			let result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
			}).catch((error) => console.log(error));

			// Loads image to db and sends image in chat
			if (!result.cancelled) {
				const imageUrl = await this.uploadImageFetch(result.uri);
				this.props.onSend({ image: imageUrl, text: '' });
			}
		}
	};

	// Allows user to take a photo on their camera to send
	takePhoto = async () => {
		// Asks user for permission to access library
		const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);

		if (status === 'granted') {
			// Launches image gallery to select image
			let result = await ImagePicker.launchCameraAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
			}).catch((error) => console.log(error));

			// Loads image to db
			if (!result.cancelled) {
				const imageUrl = await this.uploadImageFetch(result.uri);
				this.props.onSend({ image: imageUrl, text: '' });
			}
		}
	};

	// Upload image to cloud storge as blob
	uploadImageFetch = async (uri) => {
		try {
			// Convert image to blob
			const blob = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.onload = function () {
					resolve(xhr.response);
				};
				xhr.onerror = function (error) {
					console.log(error);
					reject(new TypeError('Network request failed'));
				};
				// Opens connection to receive image data
				xhr.responseType = 'blob';
				xhr.open('GET', uri, true);
				xhr.send(null);
			});

			// Creates unique file name for storage
			const uriParse = uri.split('/');
			const fileName = uriParse[uriParse.length - 1];

			// References Firestore
			const ref = firebase.storage().ref().child(`${fileName}`);
			const snapshot = await ref.put(blob);
			blob.close();

			// Returns image's unique URL from database
			return await snapshot.ref.getDownloadURL();
		} catch (error) {
			console.log(error.message);
		}
	};

	// Get and send user's location
	getLocation = async () => {
		// Asks user for permission to access location
		const { status } = await Permissions.askAsync(Permissions.LOCATION);

		if (status === 'granted') {
			// Gets user's location
			let result = await Location.getCurrentPositionAsync({});

			const longitude = JSON.stringify(result.coords.longitude);
			const latitude = JSON.stringify(result.coords.latitude);

			// Sends location
			if (result) {
				this.props.onSend({
					location: {
						longitude: longitude,
						latitude: latitude,
					},
					text: '',
				});
			}
		}
	};

	render() {
		return (
			<TouchableOpacity style={[styles.container]} onPress={this.onActionPress} accessibilityLabel="Action Button" accessibilityHint="Choose an image from your library, take a picture, or send your current location">
				<View style={[styles.wrapper, this.props.wrapperStyle]}>
					<Text style={[styles.iconText, this.props.iconTextStyle]}>+</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		width: 26,
		height: 26,
		marginLeft: 10,
		marginBottom: 10,
	},
	wrapper: {
		borderRadius: 13,
		borderColor: '#b2b2b2',
		borderWidth: 2,
		flex: 1,
	},
	iconText: {
		color: '#b2b2b2',
		fontWeight: 'bold',
		fontSize: 16,
		backgroundColor: 'transparent',
		textAlign: 'center',
	},
});

CustomActions.contextTypes = {
	actionSheet: PropTypes.func,
};