import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PaperProvider, Button } from 'react-native-paper';
import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import * as TaskManager from 'expo-task-manager';

const TASK_NAME = 'LOCATION_TETHER'

TaskManager.defineTask<{locations : LocationObject[]}>('LOCATION_TETHER', ({ data: { locations }, error }) => {
	if (error) {
		// check `error.message` for more details.
		console.log(error.message);
		return;
	}
	console.log('Received new locations [fg/bg]', locations);
});


const LocationHandler = () => {

	const [location, setLocation] = useState<LocationObject | null>(null);

	useEffect(() => {

		(async () => {
		  
			const { status: foregroundStatus } = await Location.requestForegroundPermissionsAsync();
			
			if (foregroundStatus !== 'granted') {
				console.log('Permission to access foreground location was denied');
				return;
			}

			const { status: backgroundStatus } = await Location.requestBackgroundPermissionsAsync();
			
			if (backgroundStatus !== 'granted') {
				console.log('Permission to access background location was denied');
				return;
			}

			await Location.startLocationUpdatesAsync(TASK_NAME, {
				accuracy: Location.Accuracy.Balanced,
			});

			let location = await Location.getCurrentPositionAsync({});
			setLocation(location);

		})();

		Location.startLocationUpdatesAsync(TASK_NAME, {})

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
