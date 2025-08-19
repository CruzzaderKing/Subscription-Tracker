// src/pages/auth/Register.tsx
import { useState } from "react";
import {
  Avatar,
  Box,
  Flex,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FcGoogle } from "react-icons/fc";
import {
  signInWithPopup,
  signInWithRedirect,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

import { auth, googleProvider } from "../../lib/firebase";
import { useAppDispatch } from "../../store/hooks";
import { setActiveTab } from "../../store/uiSlice";

export default function RegisterPage() {
  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const goToSubs = () => {
    dispatch(setActiveTab("subs"));
    navigate("/", { replace: true });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || password.length < 6) {
      toast({
        title: "Проверьте данные",
        description: "Введите email и пароль не короче 6 символов.",
        status: "warning",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await createUserWithEmailAndPassword(auth, email.trim(), password);
      toast({ title: "Регистрация успешна", status: "success" });
      goToSubs();
    } catch (err: any) {
      toast({
        title: "Ошибка регистрации",
        description: err?.message ?? "Попробуйте ещё раз",
        status: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setLoadingGoogle(true);
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
      goToSubs();
    } catch (err: any) {
      toast({
        title: "Ошибка входа Google",
        description: err?.message ?? "Попробуйте ещё раз",
        status: "error",
      });
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
          maxW={{ base: "100%" }}
          mx="auto"
          borderWidth="1px"
          borderRadius="xl"
          p={{ base: 5 }}
          bg="chakra-body-bg"
        >
          <Flex
            direction="column"
            gap={4}
            align="center"
            justify="center"
            w="100%"
          >
            <Flex
              direction="column"
              gap={1}
              align="center"
              justify="center"
              w="100%"
            >
              <Avatar size="lg" name="Т" bg="black" color="white" />
              <Text as="h3" textStyle="h3">
                Трекер подписок и платежей
              </Text>
            </Flex>

            <Flex direction="column" gap={1} justify="center" w="100%">
              <Text as="h1" textStyle="h1" textAlign="center">
                Регистрация
              </Text>
              <Text
                color="text.muted"
                textAlign="center"
                fontSize={{ base: "sm", md: "md" }}
              >
                Зарегистрируйтесь, чтобы начать работать
                <br /> в приложении
              </Text>
            </Flex>

            <Flex
              direction="column"
              gap={4}
              align="center"
              justify="center"
              w="100%"
            >
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
                    type={show ? "text" : "password"}
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
                      aria-label={show ? "Скрыть пароль" : "Показать пароль"}
                    >
                      {show ? <ViewOffIcon /> : <ViewIcon />}
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </FormControl>
            </Flex>

            <Flex
              direction="column"
              gap={2}
              align="center"
              justify="center"
              w="100%"
            >
              <Button
                type="submit"
                w="full"
                bg="black"
                _hover={{ bg: "blackAlpha.800" }}
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

            <Text
              textAlign="center"
              color="text.muted"
              fontSize={{ base: "sm", md: "md" }}
            >
              Уже есть аккаунт?{" "}
              <Button as="a" href="/#/auth/login" variant="link">
                Войти
              </Button>
            </Text>
          </Flex>
        </Box>
      </Container>
    </Box>
  );
}
