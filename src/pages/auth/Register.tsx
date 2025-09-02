// src/pages/auth/Register.tsx
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  type AuthError,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';

import { auth, googleProvider } from '../../lib/firebase';
import { ensureUserProfile } from '../../lib/db/userProfile';
import { useAppDispatch } from '../../store/hooks';
import { setActiveTab } from '../../store/uiSlice';

// Утилита для безопасного получения сообщения об ошибке
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message?: string }).message ?? 'Неизвестная ошибка';
  }
  return String(error);
}

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const goToSubs = () => {
    dispatch(setActiveTab('subs'));
    navigate('/', { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    if (!email.trim()) {
      toast({
        title: 'Введите email',
        status: 'warning',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Слишком короткий пароль',
        description: 'Пароль должен быть не менее 6 символов',
        status: 'warning',
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: 'Пароли не совпадают',
        status: 'error',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Создаём пользователя
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;

      // 2. Создаём профиль в Firestore
      await ensureUserProfile(user);

      toast({
        title: 'Регистрация успешна',
        status: 'success',
      });

      // 3. Переходим на главную, открывая вкладку "Подписки"
      goToSubs();
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast({
        title: 'Ошибка регистрации',
        description: message.includes('auth/email-already-in-use')
          ? 'Пользователь с таким email уже существует'
          : message,
        status: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoadingGoogle(true);
      await signInWithPopup(auth, googleProvider);
      goToSubs();
    } catch (err: unknown) {
      const error = err as AuthError;

      if (error.code === 'auth/popup-blocked') {
        toast({
          title: 'Всплывающее окно заблокировано',
          description: 'Разрешите всплывающие окна и попробуйте снова',
          status: 'warning',
        });
        await signInWithRedirect(auth, googleProvider);
      } else if (error.code === 'auth/popup-closed-by-user') {
        // Пользователь закрыл окно — просто выходим
        return;
      } else {
        toast({
          title: 'Ошибка входа через Google',
          description: error.message,
          status: 'error',
        });
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  return (
    <Box
      minH="100dvh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={{ base: 8, md: 16 }}
      px={{ base: 4, sm: 6 }}
    >
      <Container maxW="container.sm" p={0}>
        <Box
          as="form"
          onSubmit={handleSubmit}
          w="full"
          maxW={{ base: '100%' }}
          mx="auto"
          borderWidth="1px"
          borderRadius="xl"
          p={{ base: 5 }}
          bg="chakra-body-bg"
        >
          <Flex direction="column" gap={4} align="center" justify="center" w="100%">
            <Flex direction="column" gap={1} align="center" justify="center" w="100%">
              <Avatar size="lg" name="Т" bg="black" color="white" />
              <Text as="h3" textStyle="h3">
                Трекер подписок и платежей
              </Text>
            </Flex>

            <Flex direction="column" gap={1} justify="center" w="100%">
              <Text as="h1" textStyle="h1" textAlign="center">
                Регистрация
              </Text>
              <Text color="text.muted" textAlign="center" fontSize={{ base: 'sm', md: 'md' }}>
                Зарегистрируйтесь, чтобы начать работать
                <br /> в приложении
              </Text>
            </Flex>

            <Flex direction="column" gap={4} align="center" justify="center" w="100%">
              <FormControl isRequired>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="example@chakra.ui"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Пароль</FormLabel>
                <InputGroup>
                  <Input
                    type={show ? 'text' : 'password'}
                    placeholder="Минимум 6 символов"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <Button
                      onClick={() => setShow((s) => !s)}
                      variant="ghost"
                      size="sm"
                      aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
                    >
                      {show ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Подтвердите пароль</FormLabel>
                <InputGroup>
                  <Input
                    type={show ? 'text' : 'password'}
                    placeholder="Повторите пароль"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  <InputRightElement>
                    <Button
                      onClick={() => setShow((s) => !s)}
                      variant="ghost"
                      size="sm"
                      aria-label={show ? 'Скрыть пароль' : 'Показать пароль'}
                    >
                      {show ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Flex>

            <Flex direction="column" gap={2} align="center" justify="center" w="100%">
              <Button
                type="submit"
                w="full"
                bg="black"
                _hover={{ bg: 'blackAlpha.800' }}
                color="white"
                isLoading={isSubmitting}
              >
                Зарегистрироваться
              </Button>

              <Button
                w="full"
                variant="outline"
                leftIcon={<FcGoogle />}
                onClick={signInWithGoogle}
                isLoading={loadingGoogle}
              >
                Войти с помощью Google
              </Button>
            </Flex>

            <Text textAlign="center" color="text.muted" fontSize={{ base: 'sm', md: 'md' }}>
              Уже есть аккаунт?{' '}
              <Button as={Link} to="/auth/login" variant="link">
                Войти
              </Button>
            </Text>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
