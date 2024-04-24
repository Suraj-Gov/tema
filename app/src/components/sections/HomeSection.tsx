"use client";
import { trpc } from "@/utils/trpc";
import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import Button from "../buttons/Button";

export default function HomeSection() {
  const user = trpc.user.getUser.useQuery();
  const isLoggedIn = user.isFetched && Boolean(user.data?.name);

  return (
    <Flex flexGrow={"1"} justify={"center"} align={"center"}>
      {!isLoggedIn ? (
        <Flex align={"stretch"} direction="column" gap={"4"}>
          <Link href={"/signup"}>
            <Button>Create Account</Button>
          </Link>
          <Link href={"/login"}>
            <Button style={{ width: "100%" }} variant="soft">
              Login
            </Button>
          </Link>
        </Flex>
      ) : (
        <div>
          <p>hey {user.data?.name}</p>
        </div>
      )}
    </Flex>
  );
}
