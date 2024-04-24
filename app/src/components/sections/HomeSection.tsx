"use client";
import { Box, Text } from "@radix-ui/themes";
import { UserProfile } from "../../../../server/src/handlers/user";

export default function HomeSection({ user }: { user: UserProfile }) {
  return (
    <Box>
      <Text>Hey {user.name}</Text>
    </Box>
  );
}
