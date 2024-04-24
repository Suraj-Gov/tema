"use client";
import Editor from "@/components/main/Editor";
import { showToast } from "@/utils/toast";
import { trpc } from "@/utils/trpc";
import { Flex, Spinner } from "@radix-ui/themes";
import { useParams, useRouter } from "next/navigation";

// TODO use RSC
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
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );

  const navigateToHome = (msg: string) => {
    showToast(msg, "ERR");
    router.push("/");
  };

  if (user.isLoading || project.isLoading) {
    return (
      <Flex justify={"center"}>
        <Spinner size={"3"} />
      </Flex>
    );
  }

  if (!isLoggedIn) {
    navigateToHome("You're not logged in");
    return null;
  }

  if (!project.data) {
    navigateToHome("Project does not exist");
    return null;
  }

  const { config, id } = project.data;

  return <Editor id={id} config={config} />;
}
