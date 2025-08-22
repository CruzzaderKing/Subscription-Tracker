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

import { auth, googleProvider } from '../../lib/firebase';
import { shouldUseRedirect } from '../../utils/authEnv';

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

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      window.location.assign('/');
    } catch (err: unknown) {
      // Теперь err — unknown, безопасно обрабатываем
      toast({
        title: 'Не удалось войти',
        description: getErrorMessage(err),
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    try {
      if (shouldUseRedirect()) {
        await signInWithRedirect(auth, googleProvider);
      } else {
        await signInWithPopup(auth, googleProvider);
      }
      window.location.assign('/');
    } catch (err) {
      const error = err as AuthError;
      toast({
        title: 'Ошибка входа через Google',
        description: error.message,
        status: 'error',
      });
    }
  };

  return (
    <Box minH="100dvh" display="flex" alignItems="center" justifyContent="center" p={6}>
      <Container maxW="sm">
        <Box as="form" onSubmit={onSubmit} borderWidth="1px" rounded="xl" p={6} bg="chakra-body-bg">
          <Stack spacing={4}>
            <Text as="h1" fontSize="2xl" fontWeight="bold" textAlign="center">
              Войти
            </Text>
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Пароль</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            <Button type="submit" isLoading={loading} bg="black" color="white">
              Войти
            </Button>
            <Button onClick={signInGoogle} leftIcon={<FcGoogle />} variant="outline">
              Войти с Google
            </Button>
            <Text textAlign="center">
              Нет аккаунта?{' '}
              <Button as="a" href="/#/auth/register" variant="link">
                Зарегистрироваться
              </Button>
            </Text>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}
