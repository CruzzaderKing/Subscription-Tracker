// src/components/PaymentsTable.tsx
import {
  Box,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useColorModeValue,
} from '@chakra-ui/react';
import { useEffect, useMemo, useState } from 'react';
import { FiEdit2, FiMoreVertical, FiTrash2 } from 'react-icons/fi';

import { useAuth } from '../auth/AuthProvider';
import { listenSubscriptions } from '../lib/db/subscriptions';
import type { Subscription } from '../types/subscription';

export type PaymentRow = {
  id: string;
  name: string;
  date: string;
  amount: number;
};

type Props = {
  onEdit?: (row: PaymentRow) => void;
  onDelete?: (row: PaymentRow) => void;
};

const RU_MONTHS: Record<string, number> = {
  янв: 0,
  фев: 1,
  мар: 2,
  апр: 3,
  мая: 4,
  июн: 5,
  июл: 6,
  авг: 7,
  сен: 8,
  окт: 9,
  ноя: 10,
  дек: 11,
};

function tryParseRuDate(s: string): Date | null {
  if (!s) return null;

  const std = new Date(s);
  if (!Number.isNaN(std.getTime())) return std;

  const parts = s.replace('г.', '').replace('г', '').trim().split(/\s+/);

  if (parts.length >= 3) {
    const d = parseInt(parts[0], 10);
    const m3 = parts[1].slice(0, 3).toLowerCase();
    const y = parseInt(parts[2], 10);
    const m = RU_MONTHS[m3];
    if (!Number.isNaN(d) && !Number.isNaN(y) && m !== undefined) {
      const dt = new Date(y, m, d);
      if (!Number.isNaN(dt.getTime())) return dt;
    }
  }
  return null;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function formatRu(d: Date | null): string {
  if (!d) return '—';
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function nextChargeDate(startDate: string, cycle: string): Date | null {
  const start = tryParseRuDate(startDate);
  if (!start) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const day = start.getDate();

  if (cycle === 'Ежемесячно') {
    let y = today.getFullYear();
    let m = today.getMonth();
    let d = Math.min(day, daysInMonth(y, m));
    let candidate = new Date(y, m, d);

    if (candidate < today) {
      m += 1;
      if (m > 11) {
        m = 0;
        y += 1;
      }
      d = Math.min(day, daysInMonth(y, m));
      candidate = new Date(y, m, d);
    }
    return candidate;
  }

  if (cycle === 'Ежегодно') {
    const month = start.getMonth();
    let y = today.getFullYear();
    let d = Math.min(day, daysInMonth(y, month));
    let candidate = new Date(y, month, d);

    if (candidate < today) {
      y += 1;
      d = Math.min(day, daysInMonth(y, month));
      candidate = new Date(y, month, d);
    }
    return candidate;
  }

  return start;
}

export default function PaymentsTable({ onEdit, onDelete }: Props) {
  const border = useColorModeValue('gray.200', 'gray.700');
  const headBg = useColorModeValue('gray.50', 'gray.700');
  const rowHover = useColorModeValue('gray.50', 'gray.800');

  const { user } = useAuth();
  const uid = user?.uid ?? '';

  const [subs, setSubs] = useState<Subscription[]>([]);

  useEffect(() => {
    if (!uid) return;
    return listenSubscriptions(uid, setSubs);
  }, [uid]);

  const rows: PaymentRow[] = useMemo(() => {
    const withDates = subs

      .filter((s) => s.status !== 'Отменена')
      .map((s) => {
        const d = nextChargeDate(s.startDate, s.cycle);
        return {
          id: s.id,
          name: s.name,
          date: formatRu(d),
          amount: s.amount,
          _ts: d ? d.getTime() : Number.POSITIVE_INFINITY,
        } as PaymentRow & { _ts: number };
      })
      .sort((a, b) => a._ts - b._ts)
      .map(({ _ts, ...r }) => r);

    return withDates;
  }, [subs]);

  const total = useMemo(() => rows.reduce((s, r) => s + r.amount, 0), [rows]);

  return (
    <Box
      borderWidth="1px"
      borderColor={border}
      borderRadius="md"
      bg="white"
      overflow="hidden"
      mb={5}
    >
      <TableContainer w="full">
        <Table variant="unifiedFlat" size="md" w="full">
          <Thead bg={headBg}>
            <Tr>
              <Th borderColor={border} w="64px">
                №
              </Th>
              <Th borderColor={border}>Название</Th>
              <Th borderColor={border}>Ближайший платёж</Th>
              <Th borderColor={border} isNumeric>
                Сумма
              </Th>
              <Th borderColor={border} w="48px"></Th>
            </Tr>
          </Thead>

          <Tbody>
            {rows.map((r, i) => (
              <Tr key={r.id} _hover={{ bg: rowHover }}>
                <Td borderColor={border} w="64px">
                  {String(i + 1).padStart(2, '0')}
                </Td>
                <Td borderColor={border}>{r.name}</Td>
                <Td borderColor={border}>{r.date}</Td>
                <Td borderColor={border} isNumeric>
                  {r.amount.toLocaleString('ru-RU')} ₽
                </Td>
                <Td borderColor={border} w="48px" textAlign="right">
                  <Menu placement="bottom-end">
                    <MenuButton
                      as={IconButton}
                      aria-label="Действия"
                      icon={<FiMoreVertical />}
                      variant="ghost"
                      size="sm"
                      _focus={{ boxShadow: 'none', outline: 'none' }}
                      _focusVisible={{ boxShadow: 'none', outline: 'none' }}
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
                {total.toLocaleString('ru-RU')} ₽
              </Td>
              <Td borderColor={border} w="48px"></Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
}
