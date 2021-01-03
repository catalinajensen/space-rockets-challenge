import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Flex, Text } from '@chakra-ui/core';

import Launches from './launches';
import Launch from './launch';
import Home from './home';
import LaunchPads from './launch-pads';
import LaunchPad from './launch-pad';

export default function App() {
	const [favouriteLaunches, setFavouriteLaunches] = useState([]);
	const [favouriteLaunchPads, setFavouriteLaunchPads] = useState([]);

	const markAsFavouriteLaunch = (launch, e) => {
		e.preventDefault();

		let newFavouriteLaunches = favouriteLaunches;

		const index = (newFavouriteLaunches || []).findIndex(
			item => item.flight_number === launch.flight_number
		);
		if (index > -1) {
			newFavouriteLaunches.splice(index, 1);
		} else {
			newFavouriteLaunches.push(launch);
		}

		setFavouriteLaunches([...newFavouriteLaunches]);
	};

	const markAsFavouriteLaunchPad = (launchPad, e) => {
		e.preventDefault();

		let newFavouriteLaunchPads = favouriteLaunchPads;

		const index = (newFavouriteLaunchPads || []).findIndex(item => item.id === launchPad.id);
		if (index > -1) {
			newFavouriteLaunchPads.splice(index, 1);
		} else {
			newFavouriteLaunchPads.push(launchPad);
		}

		setFavouriteLaunchPads([...newFavouriteLaunchPads]);
	};

	useEffect(() => {
		const favouriteLaunches = JSON.parse(localStorage.getItem('favouriteLaunches')) || [];
		if (favouriteLaunches.length > 0) {
			setFavouriteLaunches(favouriteLaunches);
		}
	}, []);

	useEffect(() => {
		const favouriteLaunchPads = JSON.parse(localStorage.getItem('favouriteLaunchPads')) || [];
		if (favouriteLaunchPads.length > 0) {
			setFavouriteLaunchPads(favouriteLaunchPads);
		}
	}, []);

	useEffect(() => {
		localStorage.setItem('favouriteLaunches', JSON.stringify(favouriteLaunches));
	}, [favouriteLaunches]);

	useEffect(() => {
		localStorage.setItem('favouriteLaunchPads', JSON.stringify(favouriteLaunchPads));
	}, [favouriteLaunchPads]);

	return (
		<div>
			<NavBar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route
					path="/launches"
					element={
						<Launches
							favouriteLaunches={favouriteLaunches}
							markAsFavouriteLaunch={markAsFavouriteLaunch}
						/>
					}
				/>
				<Route
					path="/launches/:launchId"
					element={
						<Launch
							favouriteLaunches={favouriteLaunches}
							markAsFavouriteLaunch={markAsFavouriteLaunch}
						/>
					}
				/>
				<Route
					path="/launch-pads"
					element={
						<LaunchPads
							favouriteLaunchPads={favouriteLaunchPads}
							markAsFavouriteLaunchPad={markAsFavouriteLaunchPad}
						/>
					}
				/>
				<Route
					path="/launch-pads/:launchPadId"
					element={
						<LaunchPad
							favouriteLaunchPads={favouriteLaunchPads}
							markAsFavouriteLaunchPad={markAsFavouriteLaunchPad}
						/>
					}
				/>
			</Routes>
		</div>
	);
}

function NavBar() {
	return (
		<Flex
			as="nav"
			align="center"
			justify="space-between"
			wrap="wrap"
			padding="6"
			bg="gray.800"
			color="white"
		>
			<Text fontFamily="mono" letterSpacing="2px" fontWeight="bold" fontSize="lg">
				¡SPACE·R0CKETS!
			</Text>
		</Flex>
	);
}
