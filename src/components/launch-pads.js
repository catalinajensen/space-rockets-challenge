import React from 'react';
import { StarIcon } from '@chakra-ui/icons';
import { Badge, Box, SimpleGrid, Text, IconButton } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import Error from './error';
import Breadcrumbs from './breadcrumbs';
import FavouritesDrawer from './favouritesDrawer';
import LoadMoreButton from './load-more-button';
import { useSpaceXPaginated } from '../utils/use-space-x';

const PAGE_SIZE = 12;

export default function LaunchPads({ favouriteLaunchPads, markAsFavouriteLaunchPad }) {
	const { data, error, isValidating, size, setSize } = useSpaceXPaginated('/launchpads', {
		limit: PAGE_SIZE
	});

	return (
		<div>
			<Box d="flex" alignItems="baseline">
				<Box width="85%">
					<Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Launch Pads' }]} />
				</Box>
				<FavouritesDrawer
					favouriteItems={favouriteLaunchPads}
					markAsFavourite={markAsFavouriteLaunchPad}
				/>
			</Box>
			<SimpleGrid m={[2, null, 6]} minChildWidth="350px" spacing="4">
				{error && <Error />}
				{data &&
					data
						.flat()
						.map(launchPad => (
							<LaunchPadItem
								key={launchPad.site_id}
								launchPad={launchPad}
								favouriteLaunchPads={favouriteLaunchPads}
								markAsFavouriteLaunchPad={markAsFavouriteLaunchPad}
							/>
						))}
			</SimpleGrid>
			<LoadMoreButton
				loadMore={() => setSize(size + 1)}
				data={data}
				pageSize={PAGE_SIZE}
				isLoadingMore={isValidating}
			/>
		</div>
	);
}

export function LaunchPadItem({ launchPad, favouriteLaunchPads, markAsFavouriteLaunchPad }) {
	const isFavourite = (favouriteLaunchPads || []).findIndex(item => item.id === launchPad.id) > -1;
	return (
		<Box
			as={Link}
			to={`/launch-pads/${launchPad.site_id}`}
			boxShadow="md"
			borderWidth="1px"
			rounded="lg"
			overflow="hidden"
			position="relative"
		>
			<Box p="6">
				<Box d="flex" alignItems="baseline">
					{launchPad.status === 'active' ? (
						<Badge px="2" variant="solid" colorScheme="green">
							Active
						</Badge>
					) : (
						<Badge px="2" variant="solid" colorScheme="red">
							Retired
						</Badge>
					)}
					<Box
						color="gray.500"
						fontWeight="semibold"
						letterSpacing="wide"
						fontSize="xs"
						textTransform="uppercase"
						ml="2"
					>
						{launchPad.attempted_launches} attempted &bull; {launchPad.successful_launches}{' '}
						succeeded
					</Box>
				</Box>

				<Box d="flex" alignItems="baseline">
					<Box width="90%" mt="1" fontWeight="semibold" as="h4" lineHeight="tight" isTruncated>
						{launchPad.name}
					</Box>
					<Box width="10%">
						<IconButton
							aria-label="Mark as favourite"
							icon={<StarIcon />}
							variant="ghost"
							colorScheme={isFavourite ? 'yellow' : 'gray'}
							onClick={e => markAsFavouriteLaunchPad(launchPad, e)}
						/>
					</Box>
				</Box>
				<Text color="gray.500" fontSize="sm">
					{launchPad.vehicles_launched.join(', ')}
				</Text>
			</Box>
		</Box>
	);
}
