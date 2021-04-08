import React, { useEffect } from 'react';
import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';

export default class Start extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			colorChoice: '',
			colors: ['#0048BA','#c6b792','#4c00a4','#C46210','#3B7A57'],
		};
	}

	render() {
		const { navigation } = this.props;
		const { name, colors, colorChoice } = this.state;
		return (
			// Set background of app to image
			<ImageBackground source={require('../assets/sky.jpg')} style={styles.background} imageStyle={{ resizeMode: 'cover' }}>
				{/* Add component to move input container out of the way of the keyboard */}
				<KeyboardAvoidingView style={styles.keyboardContainer} behavior="height" keyboardVerticalOffset={Platform.OS === 'ios' ? 50 : 'height'}>
					<Text style={styles.title}>The Chat App Salutes You!</Text>
                    <Text style={styles.subtitle}>And So Do I</Text>
                    <Text style={styles.subtitle}>Michael Menges</Text>
                    <Text style={styles.subtitle}>The Developer</Text>

					{/* Create container for remaining app components */}
					<View style={styles.startContainer}>
						<View>
							<TextInput
								style={styles.textInput}
								// When name is changed, store as state to pass to Chat screen
								onChangeText={(name) => this.setState({ name })}
								value={this.state.name}
								placeholder="Enter Your Name"
							/>
						</View>

						<Text style={styles.chooseColorText}>Choose Your Background Color:</Text>

						{/* Create buttons for user to select background color, store as state to pass to Chat screen */}
						<View style={styles.colorContainer}>
							{colors.map((color) => (
								<View style={[styles.colorBorder, colorChoice === color ? { borderColor: color } : null]} key={color}>
									<TouchableOpacity onPress={() => this.setState({ colorChoice: color })} style={[styles.colorButton, { backgroundColor: color }]} accessible={true} accessibilityLabel="background color options" accessibilityHint="Choose the color for the background of your chat" accessibilityRole="button" />
								</View>
							))}
						</View>

						<TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Chat', { name: name, color: colorChoice })} accessible={true} accessibilityLabel="chat button" accessibilityHint="Start your chat" accessibilityRole="button">
							<Text style={styles.buttonText}>Click to Chat</Text>
						</TouchableOpacity>
					</View>
				</KeyboardAvoidingView>
			</ImageBackground>
		);
	}
}

const styles = StyleSheet.create({
	background: {
		flex: 1,
		resizeMode: 'cover',
		justifyContent: 'center',
		alignItems: 'center',
	},
	keyboardContainer: {
		flex: 1,
		alignItems: 'center',
	},
	title: {
		fontSize: 45,
		fontWeight: '600',
		color: '#fff',
		textAlign: 'center',
		marginTop: 50,
        marginBottom: 20
	},
    subtitle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#ffd700',
		textAlign: 'center',	
    },


	startContainer: {
		width: '88%',
		height: 300,
		margin: 20,
		padding: 10,
		backgroundColor: '#fff',
		position: 'absolute',
		bottom: 20,
	},
	textInput: {
		width: '88%',
		height: 50,
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		opacity: 50,
		borderColor: '#757083',
		borderWidth: 1,
		borderRadius: 2,
		padding: 10,
		marginLeft: 'auto',
		marginRight: 'auto',
		marginTop: 20,
	},
	chooseColorText: {
		fontSize: 16,
		fontWeight: '300',
		color: '#757083',
		marginTop: 30,
		marginLeft: 20,
	},
	colorContainer: {
		flex: 4,
		flexDirection: 'row',
		width: '70%',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		marginLeft: 20,
		marginTop: 5,
	},
	colorButton: {
		height: 40,
		width: 40,
		borderRadius: 20,
	},
	colorBorder: {
		justifyContent: 'center',
		alignItems: 'center',
		borderWidth: 3,
		borderStyle: 'solid',
		borderColor: '#fff',
		borderRadius: 100,
		padding: 3,
	},
	button: {
		width: '88%',
		backgroundColor: '#757083',
		borderRadius: 2,
		marginRight: 'auto',
		marginLeft: 'auto',
		marginBottom: 5,
		marginTop: 20,
	},
	buttonText: {
		fontSize: 16,
		fontWeight: '600',
		color: '#fff',
		padding: 20,
		textAlign: 'center',
	},
});