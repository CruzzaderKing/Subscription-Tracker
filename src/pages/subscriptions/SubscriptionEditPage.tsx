import { ArrowBackIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { useAuth } from '../../auth/AuthProvider';
import { deleteSubscription, updateSubscription } from '../../lib/db/subscriptions';
import { db } from '../../lib/firebase';
import { useAppDispatch } from '../../store/hooks';
import { setActiveTab } from '../../store/uiSlice';
import type { Subscription } from '../../types/subscription';

type SubForm = Omit<Subscription, 'id'>;

export default function SubscriptionEditPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const uid = user?.uid ?? '';
  const navigate = useNavigate();
  const toast = useToast();
  const dispatch = useAppDispatch();

  const [form, setForm] = useState<SubForm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const notFound = !loading && form === null && id;

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      if (!uid || !id) return;
      try {
        setLoading(true);
        const ref = doc(db, 'users', uid, 'subscriptions', id);
        const snap = await getDoc(ref);
        if (!snap.exists()) {
          if (mounted) setForm(null);
          return;
        }
        const data = snap.data() as SubForm;
        if (mounted) setForm(data);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        toast({ title: 'Не удалось загрузить подписку', description: msg, status: 'error' });
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, [uid, id, toast]);

  const isValid =
    !!form &&
    form.name.trim().length > 0 &&
    Number.isFinite(form.amount) &&
    form.amount >= 0 &&
    (form.status === 'Активна' || form.status === 'Отменена' || form.status === 'Остановлена') &&
    (form.cycle === 'Ежемесячно' || form.cycle === 'Ежегодно');

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uid || !id || !form || !isValid) return;

    try {
      setSaving(true);
      await updateSubscription(uid, id, form);
      toast({ title: 'Изменения сохранены', status: 'success' });
      dispatch(setActiveTab('subs'));
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: 'Ошибка сохранения', description: msg, status: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!uid || !id) return;
    try {
      await deleteSubscription(uid, id);
      toast({ title: 'Подписка удалена', status: 'info' });
      dispatch(setActiveTab('subs'));
      navigate('/', { replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ title: 'Ошибка удаления', description: msg, status: 'error' });
    }
  };

  return (
    <Box bg="chakra-body-bg" minH="100dvh">
      <Container
        maxW={{
          base: 'full',
          sm: 'container.sm',
          md: 'container.md',
          lg: 'container.lg',
          xl: '6xl',
          '2xl': '7xl',
        }}
        px={{ base: 4, sm: 6 }}
        py={{ base: 6, md: 10 }}
      >
        <Button
          leftIcon={<ArrowBackIcon />}
          variant="link"
          onClick={() => navigate(-1)}
          mb={{ base: 3, md: 4 }}
          alignSelf="flex-start"
        >
          Назад
        </Button>
        <Flex justify={{ base: 'stretch', md: 'center' }}>
          <Heading as="h1" size={{ base: 'lg', md: 'lg' }} mb={{ base: 4, md: 6 }}>
            Редактирование подписки
          </Heading>
        </Flex>

        {loading ? (
          <Box
            borderWidth="1px"
            rounded="xl"
            p={{ base: 4, md: 6 }}
            bg="white"
            _dark={{ bg: 'gray.800' }}
            mx="auto"
            w="full"
            maxW={{ base: 'full', md: '2xl', lg: '3xl', xl: '4xl', '2xl': '5xl' }}
          >
            <Stack spacing={{ base: 4, md: 5 }}>
              <Skeleton height="56px" />
              <Skeleton height="56px" />
              <Skeleton height="56px" />
              <Skeleton height="56px" />
              <Skeleton height="40px" />
            </Stack>
          </Box>
        ) : notFound ? (
          <Box
            borderWidth="1px"
            rounded="xl"
            p={{ base: 6, md: 8 }}
            textAlign="center"
            bg="white"
            _dark={{ bg: 'gray.800' }}
            mx="auto"
            w="full"
            maxW={{ base: 'full', md: '2xl', lg: '3xl' }}
          >
            <Text mb={4}>Подписка не найдена.</Text>
            <Button onClick={() => navigate('/')}>На главную</Button>
          </Box>
        ) : (
          <Box
            as="form"
            onSubmit={onSave}
            borderWidth="1px"
            rounded="xl"
            p={{ base: 4, md: 6 }}
            bg="white"
            _dark={{ bg: 'gray.800' }}
            mx="auto"
            w="full"
            maxW={{ base: 'full', md: '2xl', lg: '3xl', xl: '4xl', '2xl': '5xl' }}
          >
            <Stack spacing={{ base: 4, md: 5 }}>
              <FormControl isRequired>
                <FormLabel>Название</FormLabel>
                <Input
                  placeholder="Название сервиса"
                  value={form?.name ?? ''}
                  onChange={(e) => setForm((p) => (p ? { ...p, name: e.target.value } : p))}
                />
              </FormControl>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 5 }}>
                <FormControl isRequired>
                  <FormLabel>Статус</FormLabel>
                  <Select
                    value={form?.status ?? 'Активна'}
                    onChange={(e) =>
                      setForm((p) =>
                        p ? { ...p, status: e.target.value as Subscription['status'] } : p,
                      )
                    }
                  >
                    <option value="Активна">Активна</option>
                    <option value="Остановлена">Остановлена</option>
                    <option value="Отменена">Отменена</option>
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Цикл оплаты</FormLabel>
                  <Select
                    value={form?.cycle ?? 'Ежемесячно'}
                    onChange={(e) => setForm((p) => (p ? { ...p, cycle: e.target.value } : p))}
                  >
                    <option value="Ежемесячно">Ежемесячно</option>
                    <option value="Ежегодно">Ежегодно</option>
                  </Select>
                </FormControl>
              </SimpleGrid>

              <SimpleGrid columns={{ base: 1, md: 2 }} gap={{ base: 4, md: 5 }}>
                <FormControl>
                  <FormLabel>Дата начала</FormLabel>
                  <Input
                    type="date"
                    value={form?.startDate ?? ''}
                    onChange={(e) => setForm((p) => (p ? { ...p, startDate: e.target.value } : p))}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Сумма, ₽</FormLabel>
                  <NumberInput
                    min={0}
                    step={1}
                    value={form?.amount ?? 0}
                    onChange={(_, val) =>
                      setForm((p) => (p ? { ...p, amount: Number.isNaN(val) ? 0 : val } : p))
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </SimpleGrid>

              {/* Кнопки: «Удалить» слева; «Отмена/Сохранить» справа; на мобилке — в столбик */}
              <Flex
                justify={{ base: 'stretch', md: 'flex-end' }}
                align={{ base: 'stretch', md: 'center' }}
                gap={3}
                pt={{ base: 1, md: 2 }}
                direction={{ base: 'column', md: 'row' }}
              >
                <Flex
                  gap={3}
                  direction={{ base: 'column-reverse', md: 'row' }}
                  w={{ base: 'full', md: 'auto' }}
                >
                  <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    w={{ base: 'full', md: 'auto' }}
                  >
                    Отмена
                  </Button>
                  <Button
                    colorScheme="teal"
                    type="submit"
                    isLoading={saving}
                    isDisabled={!isValid}
                    w={{ base: 'full', md: 'auto' }}
                  >
                    Сохранить
                  </Button>
                </Flex>
              </Flex>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
}
