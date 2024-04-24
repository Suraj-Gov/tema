import { Flex } from "@radix-ui/themes";
import Link from "next/link";
import Button from "../buttons/Button";

export default function HomeAnonUser() {
  return (
    <Flex flexGrow={"1"} justify={"center"} align={"center"}>
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
    </Flex>
  );
}
