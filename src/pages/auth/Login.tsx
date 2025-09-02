import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react';
import {
  type AuthError,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from 'firebase/auth';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom'; // ← Добавлен useNavigate

import { auth, googleProvider } from '../../lib/firebase';

// Универсальная функция для извлечения сообщения об ошибке
function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === 'object' && error !== null && 'message' in error) {
    return (error as { message?: string }).message ?? 'Неизвестная ошибка';
  }
  return String(error);
}

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate(); // ← Навигация без перезагрузки

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      toast({
        title: 'Успешный вход',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/'); // ← Без перезагрузки
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      toast({
        title: 'Не удалось войти',
        description: message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      toast({
        title: 'Вход через Google',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
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
        // Пользователь закрыл окно — просто выходим молча
        return;
      } else {
        toast({
          title: 'Ошибка входа через Google',
          description: error.message,
          status: 'error',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minH="100dvh" display="flex" alignItems="center" justifyContent="center" p={6}>
      <Container maxW="sm">
        <Box
          as="form"
          onSubmit={onSubmit}
          borderWidth="1px"
          rounded="xl"
          p={6}
          bg="chakra-body-bg"
          shadow="sm"
        >
          <Stack spacing={4}>
            <Text as="h1" fontSize="2xl" fontWeight="bold" textAlign="center">
              Войти
            </Text>

            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                autoFocus
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </FormControl>

            <Button type="submit" isLoading={loading} bg="black" color="white" size="lg">
              Войти
            </Button>

            <Button
              onClick={signInGoogle}
              leftIcon={<FcGoogle />}
              variant="outline"
              size="lg"
              isLoading={loading}
            >
              Войти с Google
            </Button>

            <Text textAlign="center" fontSize="sm" color="gray.600">
              Нет аккаунта?{' '}
              <Link to="/auth/register" style={{ color: 'blue' }}>
                Зарегистрироваться
              </Link>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
