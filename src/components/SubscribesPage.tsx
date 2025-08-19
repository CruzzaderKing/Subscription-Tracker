// src/components/SubscriptionsTable.tsx
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { type ReactNode, useEffect, useMemo, useState } from 'react';

import { useAuth } from '../auth/AuthProvider';
import {
  createSubscription,
  deleteSubscription,
  listenSubscriptions,
  updateSubscription,
} from '../lib/db/subscriptions';
import type { Subscription } from '../types/subscription';

const STATUS_COLOR: Record<Subscription['status'], string> = {
  Активна: 'green',
  Отменена: 'red',
  Остановлена: 'gray',
};

function formatMoney(v: number) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0,
  }).format(v);
}

type EditingState = Omit<Subscription, 'id'> & { id?: string };

export default function SubscriptionsTable() {
  const { user } = useAuth();
  const uid = user?.uid ?? '';

  const [items, setItems] = useState<Subscription[]>([]);
  const [editing, setEditing] = useState<EditingState | null>(null);

  const modal = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    if (!uid) {
      setItems([]);
      return;
    }
    return listenSubscriptions(uid, setItems);
  }, [uid]);

  const total = useMemo(() => items.reduce((s, x) => s + (Number(x.amount) || 0), 0), [items]);

  const openCreate = () => {
    setEditing({
      name: '',
      status: 'Активна',
      cycle: 'Ежемесячно',
      startDate: '',
      amount: 0,
    });
    modal.onOpen();
  };

  const openEdit = (row: Subscription) => {
    setEditing({ ...row });
    modal.onOpen();
  };

  const remove = async (id: string) => {
    try {
      await deleteSubscription(uid, id);
      toast({ title: 'Подписка удалена', status: 'info' });
    } catch (e: any) {
      toast({
        title: 'Ошибка удаления',
        description: e?.message,
        status: 'error',
      });
    }
  };

  const save = async () => {
    if (!editing || !uid) return;
    const { id, ...payload } = editing;

    try {
      if (id) {
        await updateSubscription(uid, id, payload);
      } else {
        await createSubscription(uid, payload);
      }
      modal.onClose();
      setEditing(null);
      toast({ title: id ? 'Сохранено' : 'Добавлено', status: 'success' });
    } catch (e: any) {
      toast({
        title: 'Ошибка сохранения',
        description: e?.message,
        status: 'error',
      });
    }
  };

  return (
    <Box>
      <Flex align="center" mb={4} gap={3}>
        <Text fontSize="xl" fontWeight="semibold">
          Подписки
        </Text>
        <Button ml="auto" colorScheme="teal" onClick={openCreate}>
          Добавить подписку
        </Button>
      </Flex>

      <Box borderWidth="1px" borderRadius="lg" overflow="hidden">
        <Box px={4} py={3} borderBottomWidth="1px" bg="gray.50" _dark={{ bg: 'whiteAlpha.100' }}>
          <Text fontWeight="semibold">Подписки</Text>
        </Box>

        <Box px={2} py={2} overflowX="auto">
          <Table size="sm" variant="simple">
            <Thead>
              <Tr>
                <Th width="60px">№</Th>
                <Th>Название</Th>
                <Th>Статус</Th>
                <Th>Цикл оплаты</Th>
                <Th>Дата начала</Th>
                <Th isNumeric>Сумма</Th>
                <Th width="48px"></Th>
              </Tr>
            </Thead>
            <Tbody>
              {items.map((s, idx) => (
                <Tr
                  key={s.id}
                  _hover={{
                    bg: 'blackAlpha.50',
                    _dark: { bg: 'whiteAlpha.100' },
                  }}
                >
                  <Td>{String(idx + 1).padStart(2, '0')}</Td>
                  <Td>
                    <Text fontWeight="medium">{s.name}</Text>
                  </Td>
                  <Td>
                    <Badge colorScheme={STATUS_COLOR[s.status]} variant="subtle">
                      {s.status}
                    </Badge>
                  </Td>
                  <Td>{s.cycle}</Td>
                  <Td>{s.startDate}</Td>
                  <Td isNumeric>{formatMoney(Number(s.amount) || 0)}</Td>
                  <Td textAlign="right">
                    <Menu placement="bottom-end">
                      <MenuButton as={IconButton} aria-label="Действия" size="sm" variant="ghost">
                        ⋮
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => openEdit(s)}>Изменить</MenuItem>
                        <MenuItem color="red.500" onClick={() => remove(s.id!)}>
                          Удалить
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                </Tr>
              ))}
              <Tr>
                <Td colSpan={5} textAlign="right" fontWeight="semibold">
                  Итого
                </Td>
                <Td isNumeric fontWeight="semibold">
                  {formatMoney(total)}
                </Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Box>

      {/* Модалка */}
      <Modal isOpen={modal.isOpen} onClose={modal.onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{editing?.id ? 'Изменить подписку' : 'Новая подписка'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormField label="Название">
                <Input
                  value={editing?.name ?? ''}
                  onChange={(e) => setEditing((p) => (p ? { ...p, name: e.target.value } : p))}
                />
              </FormField>

              <FormField label="Статус">
                <Select
                  value={editing?.status ?? 'Активна'}
                  onChange={(e) =>
                    setEditing((p) =>
                      p
                        ? {
                            ...p,
                            status: e.target.value as Subscription['status'],
                          }
                        : p,
                    )
                  }
                >
                  <option value="Активна">Активна</option>
                  <option value="Отменена">Отменена</option>
                  <option value="Остановлена">Остановлена</option>
                </Select>
              </FormField>

              <FormField label="Цикл оплаты">
                <Select
                  value={editing?.cycle ?? 'Ежемесячно'}
                  onChange={(e) => setEditing((p) => (p ? { ...p, cycle: e.target.value } : p))}
                >
                  <option value="Ежемесячно">Ежемесячно</option>
                  <option value="Ежегодно">Ежегодно</option>
                </Select>
              </FormField>

              <HStack>
                <FormField label="Дата начала">
                  <Input
                    placeholder="15 сен 2025 г."
                    value={editing?.startDate ?? ''}
                    onChange={(e) =>
                      setEditing((p) => (p ? { ...p, startDate: e.target.value } : p))
                    }
                  />
                </FormField>

                <FormField label="Сумма">
                  <Input
                    type="number"
                    min={0}
                    step={1}
                    value={editing?.amount ?? 0}
                    onChange={(e) =>
                      setEditing((p) => (p ? { ...p, amount: Number(e.target.value) } : p))
                    }
                  />
                </FormField>
              </HStack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={modal.onClose}>
              Отмена
            </Button>
            <Button colorScheme="teal" onClick={save} isDisabled={!editing || !editing.name.trim()}>
              Сохранить
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

function FormField({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Box>
      <Text fontSize="sm" mb={1}>
        {label}
      </Text>
      {children}
    </Box>
  );
}
