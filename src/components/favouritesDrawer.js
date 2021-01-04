import React from 'react';
import { StarIcon } from '@chakra-ui/icons';
import {
	Button,
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Stat,
	StatLabel,
	StatHelpText,
	useDisclosure
} from '@chakra-ui/react';
import { LaunchPadItem } from './launch-pads';
import { LaunchItem } from './launches';

export default function FavouritesDrawer({ favouriteItems, markAsFavourite }) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = React.useRef();

	return (
		<>
			<Button ref={btnRef} leftIcon={<StarIcon mb="1" />} colorScheme="yellow" onClick={onOpen}>
				See favourites
			</Button>
			<Drawer
				isOpen={isOpen}
				placement="right"
				onClose={onClose}
				finalFocusRef={btnRef}
				scrollBehavior={'inside'}
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Favourites</DrawerHeader>
					{Array.isArray(favouriteItems) && favouriteItems.length > 0 ? (
						<DrawerBody>
							<Stat>
								<StatLabel>{favouriteItems[0].id ? 'Launch Pads' : 'Launches'}</StatLabel>
								<StatHelpText>({favouriteItems.length})</StatHelpText>
							</Stat>
							{favouriteItems.map(item =>
								item.id ? (
									<LaunchPadItem
										key={item.id}
										launchPad={item}
										favouriteLaunchPads={favouriteItems}
										markAsFavouriteLaunchPad={markAsFavourite}
									/>
								) : (
									<LaunchItem
										key={item.flight_number}
										launch={item}
										favouriteLaunches={favouriteItems}
										markAsFavouriteLaunch={markAsFavourite}
									/>
								)
							)}
						</DrawerBody>
					) : (
						<DrawerBody>No favourites added</DrawerBody>
					)}
				</DrawerContent>
			</Drawer>
		</>
	);
}
