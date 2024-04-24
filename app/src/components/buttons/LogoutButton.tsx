"use client";
import { trpc } from "@/utils/trpc";
import { useRouter } from "next/navigation";
import Button from "./Button";

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
