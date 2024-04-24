"use client";
import { trpc } from "@/utils/trpc";
import { Flex, Text } from "@radix-ui/themes";
import LogoutButton from "../buttons/LogoutButton";

export default function Navbar() {
  const user = trpc.user.getUser.useQuery(undefined, {
    retry: false,
  });
  const isLoggedIn = Boolean(user?.data?.name);

  return (
    <Flex p="4" justify="between">
      <Text size={"6"}>
        <strong>Tema</strong>
      </Text>
      {isLoggedIn && <LogoutButton />}
    </Flex>
  );
}
