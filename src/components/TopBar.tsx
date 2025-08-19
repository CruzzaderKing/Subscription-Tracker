import {
  Avatar,
  CloseButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  Flex,
  IconButton,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';

import SidebarContent from './SidebarContent';

export default function TopBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex
        h="64px"
        px={6}
        align="center"
        justify="space-between"
        borderBottomWidth="1px"
        bg="white"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <Flex align="center" gap={3}>
          <Avatar
            size={{ base: 'xs', md: 'md' }}
            name="Трекер подписок и платежей"
            bg="black"
            color="white"
          />
          <Text textStyle="h2">Logo</Text>
        </Flex>

        <IconButton aria-label="Open menu" icon={<FiMenu />} onClick={onOpen} variant="ghost" />
      </Flex>

      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent position="relative">
          <CloseButton position="absolute" top={3} right={3} zIndex={20} onClick={onClose} />
          <SidebarContent />
        </DrawerContent>
      </Drawer>
    </>
  );
}
