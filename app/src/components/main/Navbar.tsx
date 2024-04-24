import { getLoggedInUser } from "@/utils/data";
import { Avatar, Flex, Separator, Text } from "@radix-ui/themes";
import Link from "next/link";
import LogoutButton from "../buttons/LogoutButton";
import CreateProject from "../dialogs/CreateProject";

export default async function Navbar() {
  const user = await getLoggedInUser();
  const isLoggedIn = Boolean(user?.id);

  return (
    <Flex p="4" justify={isLoggedIn ? "between" : "center"}>
      <Flex gap="4" align={"center"}>
        <Link href="/">
          <Text size={"6"}>
            <strong>Tema</strong>
          </Text>
        </Link>
        {isLoggedIn && <CreateProject />}
      </Flex>

      {isLoggedIn && (
        <>
          <Flex gap="4" align={"center"}>
            <Flex gap="2" align={"center"}>
              <Avatar size="1" fallback={user?.name[0] ?? "Z"} />
              <Text>{user?.name}</Text>
            </Flex>
            <Separator orientation="vertical" />
            <LogoutButton />
          </Flex>
        </>
      )}
    </Flex>
  );
}
