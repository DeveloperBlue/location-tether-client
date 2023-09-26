import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { ColorValue, StyleSheet, Text, View } from 'react-native';
import { PaperProvider, Button, Surface } from 'react-native-paper';

import * as Location from 'expo-location';
import { LocationObject } from 'expo-location';
import * as TaskManager from 'expo-task-manager';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps'; // remove PROVIDER_GOOGLE import if not using Google Maps

import DeviceInfo from 'react-native-device-info';

const TASK_NAME = 'LOCATION_TETHER'

/* Sent updates to the service */
TaskManager.defineTask<{locations : LocationObject[]}>('LOCATION_TETHER', ({ data: { locations }, error }) => {
	if (error) {
		// check `error.message` for more details.
		console.log(error.message);
		return;
	}
	
	if (locations.length == 0) return;

	const topLocation = locations.sort((locationA, locationB) => {
		return locationA.timestamp - locationB.timestamp;
	})[0];

	console.log('Received new location [foreground/background]', topLocation);

	fetch('')
});

const CustomMarker = ({backgroundColor, outlineColor, size = 24} : {backgroundColor : ColorValue, outlineColor : ColorValue, size? : number}) => {
	return (
		<View
			style={{
				backgroundColor : backgroundColor,
				width : size,
				height : size,
				borderRadius : size,
				borderWidth : 2,
				borderColor: outlineColor
			}}
		/>
	)
}

const LocationHandler = () => {

	const [initialLocation, setInitialLocation] = useState<LocationObject | null>(null);
	const [location, setLocation] = useState<LocationObject | null>(null);
	const [tetherLocation, setTetherLocation] = useState();

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
			console.log('Get initial location on mount', location);
			setInitialLocation(location);
			setLocation(location);

		})();

		Location.startLocationUpdatesAsync(TASK_NAME, {})

		Location.watchPositionAsync({}, (location) => {
			console.log('Received new location [foreground]', location);
			setLocation(location);
		})

		const deviceID = DeviceInfo.getDeviceId();
		const deviceName = DeviceInfo.getDeviceNameSync();

		// Poll for positional data
		const interval = setInterval(() => {

		}, 30 * 1000)

		return (() => {
			clearInterval(interval);
		})

	}, []);

	return (
		<View>
			{
				initialLocation && <MapView
					provider={PROVIDER_GOOGLE} // remove if not using Google Maps
					style={styles.map}
					initialRegion={{
						latitude: initialLocation.coords.latitude,
						longitude: initialLocation.coords.longitude,
						latitudeDelta: 0.015,
						longitudeDelta: 0.0121,
					}}
				>
					{location &&
						<Marker
							key={'Device'}
							title={'Device'}
							description={'This device'}
							coordinate={{
								latitude : location.coords.latitude,
								longitude: location.coords.longitude
							}}
						>
							<CustomMarker backgroundColor={'#fff'} outlineColor={'#000'}/>
						</Marker>
					}
					
				</MapView>
			}
			
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
		padding : 16,
		gap : 10
	},
	map: {
		height: 220,
	}
});
