"use client";
import { showToast } from "@/utils/toast";
import { trpc } from "@/utils/trpc";
import { Flex, Spinner } from "@radix-ui/themes";
import { useParams, useRouter } from "next/navigation";

export default function ProjectPage() {
  const user = trpc.user.getUser.useQuery();
  const params = useParams();
  const router = useRouter();
  const projectId = Number(params?.id as unknown as string);
  const isLoggedIn = Boolean(user.data?.id);
  const isValidProjectId = !isNaN(projectId);
  const project = trpc.project.getByID.useQuery(
    { id: projectId },
    {
      enabled: isValidProjectId && isLoggedIn,
    }
  );

  const navigateToHome = () => {
    showToast("You're not logged in", "ERR");
    router.push("/");
  };

  if (user.isLoading || project.isLoading) {
    return (
      <Flex>
        <Spinner size={"3"} />
      </Flex>
    );
  }

  if (!isLoggedIn) {
    navigateToHome();
  }

  return <pre>{JSON.stringify(project.data)}</pre>;
}
