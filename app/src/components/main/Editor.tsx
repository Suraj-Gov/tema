"use client";
import { Container, Grid, Heading } from "@radix-ui/themes";
import { useState } from "react";
import { UserProjectConfig } from "../../../../server/src/db/schema";
import { UserProject } from "../../../../server/src/db/tables";
import ColorSwatches, { ColorItem } from "./ColorSwatches";

interface props {
  config: UserProjectConfig;
  id: UserProject["id"];
}

export default function Editor({ config, id }: props) {
  const [configState, setConfigState] = useState(() => config);

  const handleColorChange = (
    params: ColorItem,
    operation: "ADD" | "UPDATE" | "DELETE"
  ) => {
    setConfigState((prev) => {
      if (operation === "ADD") {
        prev.colors.push(params);
      } else if (operation === "UPDATE") {
        for (let i = 0; i < prev.colors.length; i++) {
          if (prev.colors[i].id === params.id) {
            prev.colors[i].val = params.val;
            prev.colors[i].label = params.label;
          }
        }
      } else if (operation === "DELETE") {
        const idx = prev.colors.findIndex((c) => c.id === params.id);
        prev.colors.splice(idx, 1);
      }

      return structuredClone(prev);
    });
  };

  return (
    <Grid columns={"2"} rows={"1"}>
      <Container p="4">
        <Container>
          <Heading size="4" as="h3">
            Colors
          </Heading>
          <ColorSwatches
            config={configState}
            handleColorChange={handleColorChange}
          />
        </Container>
        <Container mt="4">
          <Heading size="4" as="h3">
            Dimensions
          </Heading>
        </Container>
      </Container>
      <Container>{/** TODO */}</Container>
    </Grid>
  );
}
