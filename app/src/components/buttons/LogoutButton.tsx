"use client";
import { trpc } from "@/utils/trpc";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/router";

export default function LogoutButton() {
  const router = useRouter();
  const logout = trpc.user.logout.useMutation({
    onSettled: () => {
      router.push("/");
    },
  });

  return (
    <Button onClick={() => logout.mutate()} variant="ghost">
      Logout
    </Button>
  );
}
