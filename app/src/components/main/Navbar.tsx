"use client";
import { trpc } from "@/utils/trpc";
import { Flex, Text } from "@radix-ui/themes";
import Link from "next/link";
import LogoutButton from "../buttons/LogoutButton";

export default function Navbar() {
  const user = trpc.user.getUser.useQuery(undefined, {
    retry: false,
  });
  const isLoggedIn = Boolean(user?.data?.name);

  return (
    <Flex p="4" justify={isLoggedIn ? "between" : "center"}>
      <Link href="/">
        <Text size={"6"}>
          <strong>Tema</strong>
        </Text>
      </Link>
      {isLoggedIn && <LogoutButton />}
    </Flex>
  );
}
