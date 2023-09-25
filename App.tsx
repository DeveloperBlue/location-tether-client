import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider, Button } from 'react-native-paper';
import * as Location from 'expo-location';

const LocationHandler = () => {

	const [location, setLocation] = useState<any | null>(null);

	useEffect(() => {
		(async () => {
		  
			let { status } = await Location.requestForegroundPermissionsAsync();
			if (status !== 'granted') {
				console.log('Permission to access location was denied');
				return;
			}

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);

		})();
	}, []);

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
				onPress={async () => {
					
					let { status } = await Location.requestForegroundPermissionsAsync();
					if (status !== 'granted') {
						console.log('Permission to access location was denied');
						return;
					}

					let location = await Location.getCurrentPositionAsync({});
					setLocation(location);

				}}
			>
				Update Location
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
