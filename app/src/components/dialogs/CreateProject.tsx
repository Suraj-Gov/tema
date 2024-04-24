"use client";
import { showToast } from "@/utils/toast";
import { trpc } from "@/utils/trpc";
import { Pencil2Icon, PlusIcon } from "@radix-ui/react-icons";
import { Dialog, Flex, TextField } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import { FormEventHandler } from "react";
import Button from "../buttons/Button";

export default function CreateProject() {
  const router = useRouter();

  const create = trpc.project.create.useMutation({
    onSuccess: ({ id }) => {
      router.push(`/project/${id}`);
      // TODO navigate to /project/{id}
    },
    onError: (err) => {
      showToast(err.message, "ERR");
    },
  });

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as any);
    const name = formData.get("name") as string;

    create.mutate({ name });
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button>
          <PlusIcon />
          Create
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth={"25rem"}>
        <Dialog.Title>Name your new project!</Dialog.Title>

        <form onSubmit={handleSubmit}>
          <Flex direction={"column"} gap={"4"} mt="4">
            <TextField.Root name="name" placeholder="Title" minLength={3}>
              <TextField.Slot>
                <Pencil2Icon />
              </TextField.Slot>
            </TextField.Root>
            <Button loading={create.isLoading} type="submit">
              Create
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
