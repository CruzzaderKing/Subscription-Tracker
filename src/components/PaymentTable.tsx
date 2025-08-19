// src/components/PaymentsTable.tsx
import {
  Box,
  Table,
  TableContainer,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Text,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { FiMoreVertical, FiEdit2, FiTrash2 } from "react-icons/fi";

export type PaymentRow = {
  id: number;
  name: string;
  date: string;
  amount: number;
};

const rows: PaymentRow[] = [
  { id: 1, name: "Netflix (Premium)",     date: "15 сен 2025 г.", amount: 1199 },
  { id: 2, name: "Мобильная связь (МТС)", date: "22 сен 2025 г.", amount: 650  },
  { id: 3, name: "Яндекс Плюс",           date: "1 окт 2025 г.",  amount: 299  },
];

type Props = {
  onEdit?: (row: PaymentRow) => void;
  onDelete?: (row: PaymentRow) => void;
};

export default function PaymentsTable({ onEdit, onDelete }: Props) {
  const border   = useColorModeValue("gray.200", "gray.700");
  const headBg   = useColorModeValue("gray.50", "gray.700");
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
              <Th borderColor={border}>Ближайший платёж</Th>
              <Th borderColor={border} isNumeric>Сумма</Th>
              <Th borderColor={border} w="48px"></Th>
            </Tr>
          </Thead>

          <Tbody>
            {rows.map((r, i) => (
              <Tr key={r.id} _hover={{ bg: rowHover }}>
                <Td borderColor={border} w="64px">{String(i + 1).padStart(2, "0")}</Td>
                <Td borderColor={border}>{r.name}</Td>
                <Td borderColor={border}>{r.date}</Td>
                <Td borderColor={border} isNumeric>{r.amount.toLocaleString("ru-RU")} ₽</Td>
                <Td borderColor={border} w="48px" textAlign="right">
                  <Menu placement="bottom-end">
                    <MenuButton
                      as={IconButton}
                      aria-label="Действия"
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                      _focus={{ boxShadow: "none", outline: "none" }}
                      _focusVisible={{ boxShadow: "none", outline: "none" }}
                    />
                    <MenuList>
                      <MenuItem icon={<FiEdit2 />} onClick={() => onEdit?.(r)}>
                        Изменить
                      </MenuItem>
                      <MenuItem icon={<FiTrash2 />} color="red.500" onClick={() => onDelete?.(r)}>
                        Удалить
                      </MenuItem>
                    </MenuList>
                  </Menu>
                </Td>
              </Tr>
            ))}

            <Tr>
              <Td borderColor={border} colSpan={3}>
                <Text fontWeight="semibold">Итого</Text>
              </Td>
              <Td borderColor={border} isNumeric fontWeight="semibold">
                {total.toLocaleString("ru-RU")} ₽
              </Td>
              <Td borderColor={border} w="48px"></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}