import { trpc } from "@/utils/trpc";
import {
  ExclamationTriangleIcon,
  InfoCircledIcon,
} from "@radix-ui/react-icons";
import { Callout, Spinner, Table } from "@radix-ui/themes";
import Link from "next/link";
import { UserProfile } from "../../../../server/src/handlers/user";

export default function ProjectsList({ user }: { user: UserProfile }) {
  const projects = trpc.project.get.useQuery();

  if (projects.isLoading) {
    return <Spinner size="3" />;
  }

  if (projects.error) {
    return (
      <Callout.Root color="amber">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>
          Could not fetch your projects, try again later
        </Callout.Text>
      </Callout.Root>
    );
  }

  if (!projects.data.length) {
    return (
      <Callout.Root>
        <Callout.Icon>
          <InfoCircledIcon />
        </Callout.Icon>
        <Callout.Text>Create your first project</Callout.Text>
      </Callout.Root>
    );
  }

  const rows = projects.data.map((p) => (
    <Table.Row key={p.id}>
      <Table.RowHeaderCell>
        <Link href={`project/${p.id}`}>{p.name}</Link>
      </Table.RowHeaderCell>

      <Table.Cell>
        {p.updatedAt ? new Date(p.updatedAt).toLocaleString("en-IN") : "-"}
      </Table.Cell>
      <Table.Cell>
        {p.createdAt ? new Date(p.createdAt).toLocaleString("en-IN") : "-"}
      </Table.Cell>
    </Table.Row>
  ));

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>Title</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Last updated at</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell>Created at</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>{rows}</Table.Body>
    </Table.Root>
  );
}
