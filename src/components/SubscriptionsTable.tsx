// src/components/SubscriptionsTable.tsx
import {
  Table, TableContainer, Thead, Tbody, Tr, Th, Td, Badge,
  useColorModeValue, Box, Text, IconButton, Menu, MenuButton, MenuList, MenuItem,
} from "@chakra-ui/react";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";

type Status = "Активна" | "Остановлена" | "Отменена";
export type SubRow = {
  id: number; name: string; status: Status; cycle: "Ежемесячно" | "Ежегодно"; start: string; amount: number;
};

const rows: SubRow[] = [
  { id: 1, name: "Netflix (Premium)", status: "Активна", cycle: "Ежемесячно", start: "15 сен 2025 г.", amount: 1199 },
  { id: 2, name: "Яндекс Плюс", status: "Активна", cycle: "Ежемесячно", start: "1 окт 2025 г.", amount: 299 },
  { id: 3, name: "Adobe CC", status: "Отменена", cycle: "Ежемесячно", start: "--------------", amount: 5290 },
  { id: 4, name: "PlayStation Plus Extra", status: "Активна", cycle: "Ежегодно", start: "10 янв 2026 г.", amount: 7199 },
  { id: 5, name: "GitHub Pro", status: "Остановлена", cycle: "Ежемесячно", start: "4 окт 2025 г.", amount: 380 },
  { id: 6, name: "Продление domen.ru", status: "Активна", cycle: "Ежегодно", start: "18 дек 2025 г.", amount: 990 },
  { id: 7, name: "Мобильная связь (МТС)", status: "Активна", cycle: "Ежемесячно", start: "22 сен 2025 г.", amount: 650 },
];

const statusColor = { Активна: "green", Остановлена: "gray", Отменена: "red" } as const;

type Props = { onEdit?: (row: SubRow) => void; onDelete?: (row: SubRow) => void; };

export default function SubscriptionsTable({ onEdit, onDelete }: Props) {
  const border = useColorModeValue("gray.200", "gray.700");
  const headBg = useColorModeValue("gray.50", "gray.700");
  const rowHover = useColorModeValue("gray.50", "gray.800");
  const total = rows.reduce((s, r) => s + r.amount, 0);

  return (
    <Box borderWidth="1px" borderColor={border} borderRadius="md" bg="white" overflow="hidden" mb={5}>
      <TableContainer w="full">
        <Table variant="unifiedFlat" size="md" w="full">
          <Thead bg={headBg}>
            <Tr>
              <Th borderColor={border} w="64px">№</Th>
              <Th borderColor={border}>Название</Th>
              <Th borderColor={border}>Статус</Th>
              <Th borderColor={border}>Цикл оплаты</Th>
              <Th borderColor={border}>Дата начала</Th>
              <Th borderColor={border} isNumeric>Сумма</Th>
              <Th borderColor={border} w="48px" />
            </Tr>
          </Thead>
          <Tbody>
            {rows.map((r, i) => (
              <Tr key={r.id} _hover={{ bg: rowHover }}>
                <Td borderColor={border} w="64px">{String(i + 1).padStart(2, "0")}</Td>
                <Td borderColor={border}>{r.name}</Td>
                <Td borderColor={border}>
                  <Badge colorScheme={statusColor[r.status]} px={2} py={0.5} rounded="md">
                    {r.status}
                  </Badge>
                </Td>
                <Td borderColor={border}>{r.cycle}</Td>
                <Td borderColor={border}>{r.start}</Td>
                <Td borderColor={border} isNumeric>{r.amount.toLocaleString("ru-RU")} ₽</Td>
                <Td borderColor={border} w="48px" textAlign="right">
                  <Menu placement="bottom-end">
                    <MenuButton as={IconButton} aria-label="Действия" icon={<FiMoreVertical />} variant="ghost" size="sm" />
                    <MenuList>
                      <MenuItem icon={<FiEdit2 />} onClick={() => onEdit?.(r)}>Изменить</MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => onDelete?.(r)}>Удалить</MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}
            <Tr>
              <Td borderColor={border} colSpan={5}><Text fontWeight="semibold">Итого</Text></Td>
              <Td borderColor={border} isNumeric fontWeight="semibold">{total.toLocaleString("ru-RU")} ₽</Td>
              <Td borderColor={border} w="48px" />
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}