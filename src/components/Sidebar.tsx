import {
  Box,
  Flex,
  IconButton,
  Drawer,
  DrawerContent,
  DrawerOverlay,
  useDisclosure,
  VStack,
  Text,
  Link,
  CloseButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiMenu } from "react-icons/fi";
import { type ReactNode } from "react";

const NAV = [
  { label: "Dashboard", href: "#" },
  { label: "Projects", href: "#" },
  { label: "Tasks", href: "#" },
  { label: "Settings", href: "#" },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      w={{ base: "full", md: "280px" }}
      pos="fixed"
      left={0}
      top={0}
      h="100vh"
      bg={bg}
      borderRightWidth="1px"
      borderColor={border}
      p={4}
    >
      <Flex align="center" justify="space-between" mb={6}>
        <Text fontWeight="bold">My App</Text>
        <CloseButton display={{ base: "flex", md: "none" }} onClick={onClose} />
      </Flex>

      <VStack align="stretch" spacing={1}>
        {NAV.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            px={3}
            py={2}
            rounded="md"
            _hover={{ bg: useColorModeValue("gray.100", "gray.700") }}
          >
            {item.label}
          </Link>
        ))}
      </VStack>

      <Box mt="auto" position="absolute" bottom={4} left={4} right={4}>
        <Box p={3} rounded="md" bg={useColorModeValue("gray.50", "gray.700")}>
          <Text fontSize="sm">Logged in as</Text>
          <Text fontWeight="semibold">Tatiana</Text>
        </Box>
      </Box>
    </Box>
  );
}

export default function SidebarLayout({ children }: { children: ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box minH="100vh">
      <IconButton
        aria-label="Open menu"
        icon={<FiMenu />}
        onClick={onOpen}
        position="fixed"
        top={4}
        left={4}
        zIndex={20}
        display={{ base: "inline-flex", md: "none" }}
      />

      <Box display={{ base: "none", md: "block" }}>
        <SidebarContent />
      </Box>

      {/* Мобильный Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent>
          <SidebarContent onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Box ml={{ base: 0, md: "280px" }} p={{ base: 4, md: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
