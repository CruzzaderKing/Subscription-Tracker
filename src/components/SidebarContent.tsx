// src/components/SidebarContent.tsx
import {
  Box, Flex, Text, useColorModeValue, Avatar, Spacer,
  IconButton, Menu, MenuButton, MenuList, MenuItem
} from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { FiMoreVertical, FiLogOut } from "react-icons/fi";
import { NavMenu } from "./IconList";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectActiveTab, setActiveTab } from "../store/uiSlice";
import { useAuth } from "../auth/AuthProvider";          // 👈 добавили
import { useNavigate } from "react-router-dom";          // 👈 добавили

export default function SidebarContent(props: BoxProps) {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const activeKey = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();

  const { logout } = useAuth();                          // 👈 берём logout из контекста
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();                                    // Firebase signOut()
      navigate("/auth/register", { replace: true });     // мгновенно уводим на регистрацию
      // Дополнительно: можно ещё очистить редуксовые стейты, если нужно
      // dispatch(resetSomething());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Flex direction="column" bg={bg} borderRightWidth="1px" borderColor={border} h="100vh" {...props}>
      <Flex align="center" gap={3} p={5} w="full" borderBottomWidth="1px" borderColor={border}>
        <Avatar size="lg" name="Трекер подписок и платежей" bg="black" color="white" />
        <Box>
          <Text as="h2" textStyle="h2">Трекер подписок и платежей</Text>
          <Text textStyle="caption-2" color="gray.500">посчитать всё, что скрыто</Text>
        </Box>
      </Flex>

      <NavMenu
        activeKey={activeKey}
        onChange={(k) => dispatch(setActiveTab(k))}
      />

      <Spacer />

      <Flex align="center" justify="space-between" p={5} w="full" borderTopWidth="1px" borderColor={border}>
        <Flex align="center" gap={3}>
          <Avatar size="lg" name="Никита Шидловский" bg="black" color="white" />
          <Box>
            <Text as="h2" textStyle="h2">Никита Шидловский</Text>
            <Text textStyle="caption-2" color="gray.500">nikita.shidlovskii@yandex.ru</Text>
          </Box>
        </Flex>

        <Menu placement="top-end">
          <MenuButton as={IconButton} aria-label="Опции" icon={<FiMoreVertical />} variant="ghost" size="sm" />
          <MenuList>
            <MenuItem icon={<FiLogOut />} onClick={handleLogout}>
              Выйти
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
}
