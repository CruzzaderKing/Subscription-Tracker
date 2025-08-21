// src/pages/subs/SubscriptionFormPage.tsx
import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import { createSubscription } from '../../lib/db/subscriptions';
import { useAppDispatch } from '../../store/hooks';
import { setActiveTab } from '../../store/uiSlice';
import type { Subscription } from '../../types/subscription';

type NewSub = Omit<Subscription, 'id'>;
type Errors = Partial<Record<keyof NewSub, string>>;

export default function SubscriptionFormPage() {
  const { user } = useAuth();
  const uid = user?.uid ?? '';
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<NewSub>({
    name: '',
    status: 'Активна',
    cycle: 'Ежемесячно',
    startDate: '',
    amount: 0,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [saving, setSaving] = useState(false);

  const validate = (v: NewSub): Errors => {
    const e: Errors = {};
    if (!v.name.trim()) e.name = 'Укажите название';
    if (!v.startDate.trim()) e.startDate = 'Выберите дату начала';
    if (!Number.isFinite(v.amount) || v.amount <= 0) e.amount = 'Сумма должна быть больше 0';
    if (!['Активна', 'Отменена', 'Остановлена'].includes(v.status))
      e.status = 'Некорректный статус';
    if (!['Ежемесячно', 'Ежегодно'].includes(v.cycle)) e.cycle = 'Некорректный цикл оплаты';
    return e;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid) return;

    const v = validate(form);
    setErrors(v);

    if (Object.keys(v).length > 0) {
      const firstError = Object.values(v)[0]!;
      toast({ title: 'Проверьте данные', description: firstError, status: 'warning' });
      return;
    }

    try {
      setSaving(true);
      await createSubscription(uid, form);
      toast({ title: 'Подписка добавлена', status: 'success' });
      dispatch(setActiveTab('subs'));
      navigate('/', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      toast({ title: 'Ошибка сохранения', description: message, status: 'error' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Container maxW="4xl" minH="100vh" py={8}>
      <Flex direction="column" gap={2} mb={6}>
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="ghost"
          alignSelf="flex-start"
          onClick={() => navigate(-1)}
        >
          Назад
        </Button>
        <Heading size="lg" textAlign="left">
          Новая подписка
        </Heading>
      </Flex>

      {/* Карточка формы */}
      <Box
        as="form"
        onSubmit={onSubmit}
        borderWidth="1px"
        rounded="lg"
        p={6}
        bg="white"
        _dark={{ bg: 'gray.800' }}
      >
        <Stack spacing={5}>
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Название</FormLabel>
            <Input
              size="lg"
              placeholder="Напр., Netflix Premium"
              value={form.name}
              onChange={(e) => {
                const name = e.target.value;
                setForm((p) => ({ ...p, name }));
                if (errors.name)
                  setErrors((er) => ({ ...er, name: name.trim() ? '' : 'Укажите название' }));
              }}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>

          <HStack align="start" spacing={4} flexDir={{ base: 'column', md: 'row' }}>
            <FormControl isRequired isInvalid={!!errors.status}>
              <FormLabel>Статус</FormLabel>
              <Select
                size="lg"
                value={form.status}
                onChange={(e) => {
                  const status = e.target.value as Subscription['status'];
                  setForm((p) => ({ ...p, status }));
                  if (errors.status) setErrors((er) => ({ ...er, status: '' }));
                }}
              >
                <option value="Активна">Активна</option>
                <option value="Отменена">Отменена</option>
                <option value="Остановлена">Остановлена</option>
              </Select>
              <FormErrorMessage>{errors.status}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.cycle}>
              <FormLabel>Цикл оплаты</FormLabel>
              <Select
                size="lg"
                value={form.cycle}
                onChange={(e) => {
                  const cycle = e.target.value;
                  setForm((p) => ({ ...p, cycle }));
                  if (errors.cycle) setErrors((er) => ({ ...er, cycle: '' }));
                }}
              >
                <option value="Ежемесячно">Ежемесячно</option>
                <option value="Ежегодно">Ежегодно</option>
              </Select>
              <FormErrorMessage>{errors.cycle}</FormErrorMessage>
            </FormControl>
          </HStack>

          <HStack align="start" spacing={4} flexDir={{ base: 'column', md: 'row' }}>
            <FormControl isRequired isInvalid={!!errors.startDate}>
              <FormLabel>Дата начала</FormLabel>
              <Input
                size="lg"
                type="date"
                value={form.startDate}
                onChange={(e) => {
                  const startDate = e.target.value;
                  setForm((p) => ({ ...p, startDate }));
                  if (errors.startDate)
                    setErrors((er) => ({
                      ...er,
                      startDate: startDate ? '' : 'Выберите дату начала',
                    }));
                }}
              />
              <FormErrorMessage>{errors.startDate}</FormErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={!!errors.amount}>
              <FormLabel>Сумма, ₽</FormLabel>
              <NumberInput
                size="lg"
                min={0}
                value={form.amount}
                onChange={(_, valAsNumber) => {
                  const amount = Number.isNaN(valAsNumber) ? 0 : valAsNumber;
                  setForm((p) => ({ ...p, amount }));
                  if (errors.amount)
                    setErrors((er) => ({
                      ...er,
                      amount: amount > 0 ? '' : 'Сумма должна быть больше 0',
                    }));
                }}
              >
                <NumberInputField />
              </NumberInput>
              <FormErrorMessage>{errors.amount}</FormErrorMessage>
            </FormControl>
          </HStack>

          <HStack justify="flex-end" pt={2}>
            <Button variant="ghost" onClick={() => navigate(-1)}>
              Отмена
            </Button>
            <Button colorScheme="teal" type="submit" isLoading={saving}>
              Сохранить
            </Button>
          </HStack>
        </Stack>
      </Box>
    </Container>
  );
}
