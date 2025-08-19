import { useState } from "react";
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
} from "@chakra-ui/react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
} from "firebase/auth";
import { auth, googleProvider } from "../../lib/firebase";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      window.location.assign("/");
    } catch (err: any) {
      toast({
        title: "Не удалось войти",
        description: err?.message,
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const signInGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider).catch(async (err: any) => {
        if (
          err?.code === "auth/popup-blocked" ||
          err?.code === "auth/popup-closed-by-user"
        ) {
          await signInWithRedirect(auth, googleProvider);
        } else {
          throw err;
        }
      });
      window.location.assign("/");
    } catch (err: any) {
      toast({
        title: "Ошибка входа Google",
        description: err?.message,
        status: "error",
      });
    }
  };

  return (
    <Box
      minH="100dvh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      p={6}
    >
      <Container maxW="sm">
        <Box
          as="form"
          onSubmit={onSubmit}
          borderWidth="1px"
          rounded="xl"
          p={6}
          bg="chakra-body-bg"
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
              />
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
              Войти{" "}
            </Button>
            <Button
              onClick={signInGoogle}
              leftIcon={<FcGoogle />}
              variant="outline"
            >
              Войти с Google
            </Button>
            <Text textAlign="center">
              Нет аккаунта?{" "}
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
