"use client";
import { Container } from "@radix-ui/themes";
import { UserProfile } from "../../../../server/src/handlers/user";
import ProjectsList from "./ProjectsList";

export default function HomeSection({ user }: { user: UserProfile }) {
  return (
    <Container p="4" size={"2"}>
      <ProjectsList user={user} />
    </Container>
  );
}
