"use client";
import { trpc } from "@/utils/trpc";
import {
  EnvelopeClosedIcon,
  LockClosedIcon,
  PersonIcon,
} from "@radix-ui/react-icons";
import { Container, Flex, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";
import Button from "../buttons/Button";

export default function SignupForm() {
  const signup = trpc.user.signup.useMutation();
  const router = useRouter();

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as any);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    signup.mutate(
      { email, password, name },
      {
        onSuccess: () => {
          router.replace("/");
        },
      }
    );
  };

  return (
    <Flex flexGrow={"1"} align={"center"}>
      <Container size={"1"}>
        <form onSubmit={handleSubmit}>
          <Flex direction={"column"} gap="4">
            <TextField.Root
              required
              minLength={2}
              name="name"
              type="text"
              placeholder="Your name"
            >
              <TextField.Slot>
                <PersonIcon height={"8"} width={"8"} />
              </TextField.Slot>
            </TextField.Root>
            <TextField.Root name="email" type="email" placeholder="Email">
              <TextField.Slot>
                <EnvelopeClosedIcon height={"8"} width={"8"} />
              </TextField.Slot>
            </TextField.Root>
            <TextField.Root
              name="password"
              minLength={8}
              type="password"
              placeholder="Password"
            >
              <TextField.Slot>
                <LockClosedIcon height={"8"} width={"8"} />
              </TextField.Slot>
            </TextField.Root>
            <Button loading={signup.isLoading} type="submit">
              Sign up
            </Button>
          </Flex>
        </form>
      </Container>
    </Flex>
  );
}
