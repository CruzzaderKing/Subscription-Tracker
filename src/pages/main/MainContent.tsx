// src/pages/main/MainContent.tsx
import {
  Box,
  Text,
  Flex,
  Button,
  HStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import SidebarContent from "../../components/SidebarContent";
import TopBar from "../../components/TopBar";
import SubscriptionsTable from "../../components/SubscriptionsTable";
import PaymentsTable from "../../components/PaymentTable";
import SubscriptionsDonutCard from "../../components/SubscriptionsDonutCard";
import { FiPlus } from "react-icons/fi";
import { useAppSelector } from "../../store/hooks";
import { selectActiveTab } from "../../store/uiSlice";

function SubsSection() {
  return (
    <Box as="section">
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
  );
}

function StatsSection() {
  return (
    <Box as="section">
      {/* Шапка */}
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
  );
}

export default function MainContent() {
  const isXL = useBreakpointValue({ base: false, xl: true });
  const tab = useAppSelector(selectActiveTab);

  return (
    <Flex minH="100vh" direction={{ base: "column", xl: "row" }}>
      <Box
        as="aside"
        display={{ base: "none", xl: "block" }}
        w={{ xl: "33.333%" }}
        flexShrink={0}
        position="sticky"
        top="0"
        h="100vh"
        overflow="hidden"
        bg="white"
        borderRightWidth="1px"
      >
        <SidebarContent />
      </Box>

      <Box display={{ base: "block", xl: "none" }}>
        <TopBar />
      </Box>

      <Box w={{ base: "100%", xl: "66.666%" }} p={5} pt={9}>
        {tab === "subs" ? <SubsSection /> : <StatsSection />}
      </Box>
    </Flex>
  );
}
