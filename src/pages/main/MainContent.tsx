// src/pages/main/MainContent.tsx
import {
  Box,
  Text,
  Flex,
  Button,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import SidebarContent from "../../components/SidebarContent";
import TopBar from "../../components/TopBar";
import SubscriptionsTable from "../../components/SubscriptionsTable";
import PaymentsTable from "../../components/PaymentTable";
import SubscriptionsDonutCard from "../../components/SubscriptionsDonutCard";
import { FiPlus } from "react-icons/fi";

export default function MainContent() {
  const asideBg = useColorModeValue("white", "gray.900");
  const asideBorder = useColorModeValue("gray.200", "gray.700");

  return (
    <Flex minH="100vh" direction={{ base: "column", xl: "row" }}>
      {/* Sidebar 1/3 на ≥ xl */}
      <Box
        as="aside"
        display={{ base: "none", xl: "block" }}
        w={{ xl: "33.333%" }} // 1/3 ширины
        flexShrink={0}
        position="sticky"
        top="0"
        h="100vh"
        overflow="hidden"
        bg={asideBg}
        borderRightWidth="1px"
        borderColor={asideBorder}
      >
        <Box h="full">
          <SidebarContent />
        </Box>
      </Box>

      {/* TopBar < xl */}
      <Box display={{ base: "block", xl: "none" }}>
        <TopBar />
      </Box>

      {/* Content 2/3 */}
      <Box as="main" w={{ base: "100%", xl: "66.666%" }} p={5} pt={9}>
        {/* Subs */}
        <Box as="section" id="subs" mb={5} scrollMarginTop="72px">
          {/* Шапка контента */}
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            gap={{ base: 3, md: 0 }}
            mb={5}
          >
            <Text as="h1" textStyle="h1">
              Подписки
            </Text>
            <HStack mt={{ base: 2, md: 0 }} w={{ base: "full", md: "auto" }}>
              <Button
                leftIcon={<FiPlus />}
                bg="black"
                color="white"
                _hover={{ bg: "blackAlpha.800" }}
                _active={{ bg: "blackAlpha.900" }}
                w={{ base: "full", md: "auto" }}
              >
                Добавить подписку
              </Button>
            </HStack>
          </Flex>

          <SubscriptionsTable />
        </Box>

        {/* Stats */}
        <Box as="section" id="stats" mb={9} scrollMarginTop="72px">
          <Flex
            direction={{ base: "column", md: "row" }}
            align={{ base: "flex-start", md: "center" }}
            justify="space-between"
            gap={{ base: 3, md: 0 }}
            mb={5}
          >
            <Text as="h1" textStyle="h1">
              Статистика
            </Text>
            <HStack mt={{ base: 2, md: 0 }} w={{ base: "full", md: "auto" }}>
              <Button
                leftIcon={<FiPlus />}
                bg="black"
                color="white"
                _hover={{ bg: "blackAlpha.800" }}
                _active={{ bg: "blackAlpha.900" }}
                w={{ base: "full", md: "auto" }}
              >
                Добавить подписку
              </Button>
            </HStack>
          </Flex>

          <Flex justify="space-between" align="center" mb={3}>
            <Text as="h2" textStyle="h2">
              Распределение расходов
            </Text>
            <Text textStyle="p" color="gray.500">
              1 авг 2025 — 1 сен 2025
            </Text>
          </Flex>

          <Box mb={5}>
            <SubscriptionsDonutCard />
          </Box>

          <Flex justify="space-between" align="center" mb={3}>
            <Text as="h2" textStyle="h2">
              Ближайшие списания
            </Text>
            <Text fontSize="lg" color="gray.500"></Text>
          </Flex>

          <PaymentsTable />
        </Box>
      </Box>
    </Flex>
  );
}
