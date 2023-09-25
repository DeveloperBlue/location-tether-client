import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider, Button } from 'react-native-paper';
import GetLocation, { Location } from 'react-native-get-location'

const LocationHandler = () => {

	const [location, setLocation] = useState<Location | null>(null);

	useEffect(() => {
		GetLocation.getCurrentPosition({
			enableHighAccuracy: true,
			timeout: 60000,
		})
		.then(location => {
			console.log(location);
			setLocation(location);
		})
		.catch(error => {
			const { code, message } = error;
			console.warn(code, message);
		})
	}, [])

	return (
		<View>
			{
				location ? <Text>
					{JSON.stringify(location)}
				</Text> : <Text>
					No Location
				</Text>
			}
			<Button
				mode={'contained'}
				onPress={() => {
					console.log("Location Lib", GetLocation);
					GetLocation.getCurrentPosition({
						enableHighAccuracy: false,
						timeout: 60000
					})
					.then(location => {
						console.log(location);
						setLocation(location);
					})
					.catch(error => {
						const { code, message } = error;
						console.warn(code, message);
					})
				}}
			>
				Update Location
			</Button>
			<Button
				mode={'contained'}
				onPress={() => {
					GetLocation.openSettings();
				}}
			>
				Open Settings
			</Button>
		</View>
	)
}

export default function App() {
	return (
		<PaperProvider>
			<View style={styles.container}>
				<Text>Open up App.tsx to start working on your app!</Text>
				<StatusBar style="auto" />
				<LocationHandler/>
			</View>
		</PaperProvider>
		
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
	},
});
