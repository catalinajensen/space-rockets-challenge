import React from 'react';
import { useParams } from 'react-router-dom';
import { MapPin, Navigation } from 'react-feather';
import { StarIcon } from '@chakra-ui/icons';
import {
	Flex,
	Heading,
	Badge,
	Stat,
	StatLabel,
	StatNumber,
	StatHelpText,
	SimpleGrid,
	Box,
	Text,
	Spinner,
	Stack,
	AspectRatio,
	IconButton
} from '@chakra-ui/react';

import { useSpaceX } from '../utils/use-space-x';
import Error from './error';
import Breadcrumbs from './breadcrumbs';
import { LaunchItem } from './launches';

export default function LaunchPad({ favouriteLaunchPads, markAsFavouriteLaunchPad }) {
	let { launchPadId } = useParams();
	const { data: launchPad, error } = useSpaceX(`/launchpads/${launchPadId}`);

	const { data: launches } = useSpaceX(launchPad ? '/launches/past' : null, {
		limit: 3,
		order: 'desc',
		sort: 'launch_date_utc',
		site_id: launchPad?.site_id
	});

	if (error) return <Error />;
	if (!launchPad) {
		return (
			<Flex justifyContent="center" alignItems="center" minHeight="50vh">
				<Spinner w="lg" h="lg" />
			</Flex>
		);
	}

	const isFavourite = (favouriteLaunchPads || []).findIndex(item => item.id === launchPad.id) > -1;

	return (
		<div>
			<Breadcrumbs
				items={[
					{ label: 'Home', to: '/' },
					{ label: 'Launch Pads', to: '..' },
					{ label: launchPad.name }
				]}
			/>
			<Header
				launchPad={launchPad}
				isFavourite={isFavourite}
				markAsFavouriteLaunchPad={markAsFavouriteLaunchPad}
			/>
			<Box m={[3, 6]}>
				<LocationAndVehicles launchPad={launchPad} />
				<Text color="gray.700" fontSize={['md', null, 'lg']} my="8">
					{launchPad.details}
				</Text>
				<Map location={launchPad.location} />
				<RecentLaunches launches={launches} />
			</Box>
		</div>
	);
}

const randomColor = (start = 200, end = 250) => `hsl(${start + end * Math.random()}, 80%, 90%)`;

function Header({ launchPad, isFavourite, markAsFavouriteLaunchPad }) {
	return (
		<Flex
			background={`linear-gradient(${randomColor()}, ${randomColor()})`}
			bgPos="center"
			bgSize="cover"
			bgRepeat="no-repeat"
			minHeight="15vh"
			position="relative"
			flexDirection={['column', 'row']}
			p={[2, 6]}
			alignItems="flex-end"
			justifyContent="space-between"
		>
			<Box>
				<Heading
					color="gray.900"
					display="inline"
					mx={[2, 4]}
					my="2"
					fontSize={['md', '3xl']}
					borderRadius="lg"
				>
					{launchPad.site_name_long}
				</Heading>
				<IconButton
					aria-label="Mark as favourite"
					icon={<StarIcon />}
					variant="ghost"
					fontSize={['lg', '4xl']}
					mb="5"
					colorScheme={isFavourite ? 'yellow' : 'gray'}
					onClick={e => markAsFavouriteLaunchPad(launchPad, e)}
				/>
			</Box>
			<Stack isInline spacing="3">
				<Badge colorScheme="purple" fontSize={['sm', 'md']}>
					{launchPad.successful_launches}/{launchPad.attempted_launches} successful
				</Badge>
				{launchPad.stats === 'active' ? (
					<Badge colorScheme="green" fontSize={['sm', 'md']}>
						Active
					</Badge>
				) : (
					<Badge colorScheme="red" fontSize={['sm', 'md']}>
						Retired
					</Badge>
				)}
			</Stack>
		</Flex>
	);
}

function LocationAndVehicles({ launchPad }) {
	return (
		<SimpleGrid columns={[1, 1, 2]} borderWidth="1px" p="4" borderRadius="md">
			<Stat>
				<StatLabel display="flex">
					<Box as={MapPin} width="1em" />{' '}
					<Box ml="2" as="span">
						Location
					</Box>
				</StatLabel>
				<StatNumber fontSize="xl">{launchPad.location.name}</StatNumber>
				<StatHelpText>{launchPad.location.region}</StatHelpText>
			</Stat>
			<Stat>
				<StatLabel display="flex">
					<Box as={Navigation} width="1em" />{' '}
					<Box ml="2" as="span">
						Vehicles
					</Box>
				</StatLabel>
				<StatNumber fontSize="xl">{launchPad.vehicles_launched.join(', ')}</StatNumber>
			</Stat>
		</SimpleGrid>
	);
}

function Map({ location }) {
	return (
		<AspectRatio ratio={16 / 5}>
			<Box
				as="iframe"
				src={`https://maps.google.com/maps?q=${location.latitude}, ${location.longitude}&z=15&output=embed`}
				alt="demo"
			/>
		</AspectRatio>
	);
}

function RecentLaunches({ launches }) {
	if (!launches?.length) {
		return null;
	}
	return (
		<Stack my="8" spacing="3">
			<Text fontSize="xl" fontWeight="bold">
				Last launches
			</Text>
			<SimpleGrid minChildWidth="350px" spacing="4">
				{launches.map(launch => (
					<LaunchItem launch={launch} key={launch.flight_number} />
				))}
			</SimpleGrid>
		</Stack>
	);
}
