import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Avatar,
  Spacer,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import type { BoxProps } from "@chakra-ui/react";
import { FiMoreVertical, FiLogOut } from "react-icons/fi";
import { NavMenu } from "./IconList";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectActiveTab, setActiveTab } from "../store/uiSlice";
import { useAuth } from "../auth/AuthProvider";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { listenUserProfile, type UserProfile } from "../lib/db/users";

export default function SidebarContent(props: BoxProps) {
  const bg = useColorModeValue("white", "gray.800");
  const border = useColorModeValue("gray.200", "gray.700");
  const activeKey = useAppSelector(selectActiveTab);
  const dispatch = useAppDispatch();

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (!user?.uid) return;
    return listenUserProfile(user.uid, setProfile);
  }, [user?.uid]);

  const displayName =
    profile?.displayName ||
    user?.displayName ||
    (user?.email ? user.email.split("@")[0] : "Пользователь");

  const email = profile?.email || user?.email || "";

  const avatarSrc = profile?.avatarUrl || user?.photoURL || undefined;

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/auth/register", { replace: true });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Flex
      direction="column"
      bg={bg}
      borderRightWidth="1px"
      borderColor={border}
      h="100vh"
      {...props}
    >
      <Flex
        align="center"
        gap={3}
        p={5}
        w="full"
        borderBottomWidth="1px"
        borderColor={border}
      >
        <Avatar
          size="lg"
          name="Трекер подписок и платежей"
          bg="black"
          color="white"
        />
        <Box>
          <Text as="h2" textStyle="h2">
            Трекер подписок и платежей
          </Text>
          <Text textStyle="caption-2" color="gray.500">
            посчитать всё, что скрыто
          </Text>
        </Box>
      </Flex>

      <NavMenu
        activeKey={activeKey}
        onChange={(k) => dispatch(setActiveTab(k))}
      />

      <Spacer />

      <Flex
        align="center"
        justify="space-between"
        p={5}
        w="full"
        borderTopWidth="1px"
        borderColor={border}
      >
        <Flex align="center" gap={3}>
          <Avatar
            size="lg"
            name={displayName}
            src={avatarSrc}
            bg="black"
            color="white"
          />
          <Box>
            <Text as="h2" textStyle="h2">
              {displayName}
            </Text>
            {email && (
              <Text textStyle="caption-2" color="gray.500">
                {email}
              </Text>
            )}
          </Box>
        </Flex>

        <Menu placement="top-end">
          <MenuButton
            as={IconButton}
            aria-label="Опции"
            icon={<FiMoreVertical />}
            variant="ghost"
            size="sm"
          />
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
