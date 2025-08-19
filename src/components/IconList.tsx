import {
  VStack,
  HStack,
  Button,
  Icon,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiList, FiPieChart } from "react-icons/fi";
import type { TabKey } from "../types/ui"; 
import type { NavMenuProps } from "../types/ui";

export function NavMenu({ activeKey = "subs", onChange }: NavMenuProps) {
  const hoverBg = useColorModeValue("gray.100", "whiteAlpha.100");
  const activeBg = useColorModeValue("gray.200", "whiteAlpha.200");

  const Item = ({
    icon,
    label,
    value,
  }: {
    icon: any;
    label: string;
    value: TabKey;
  }) => (
    <Button
      onClick={() => onChange?.(value)}
      justifyContent="flex-start"
      w="full"
      variant="ghost"
      px={3}
      py={2}
      rounded="md"
      bg={activeKey === value ? activeBg : "transparent"}
      _hover={{ bg: hoverBg }}
    >
      <HStack spacing={3}>
        <Icon as={icon} boxSize={4} />
        <Text fontWeight={activeKey === value ? "semibold" : "medium"}>
          {label}
        </Text>
      </HStack>
    </Button>
  );

  return (
    <VStack align="stretch" spacing={1} px={3} pt={3}>
      <Item icon={FiList} label="Подписки" value="subs" />
      <Item icon={FiPieChart} label="Статистика" value="stats" />
    </VStack>
  );
}
