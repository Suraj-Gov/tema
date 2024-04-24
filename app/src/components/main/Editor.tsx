"use client";
import { populateDefaultValues } from "@/utils/editor";
import {
  Button,
  Container,
  Flex,
  Grid,
  Heading,
  Popover,
  Text,
} from "@radix-ui/themes";
import React, { CSSProperties, useState } from "react";
import {
  ConfigElementStyles,
  UserProjectConfig,
} from "../../../../server/src/db/schema";
import { UserProject } from "../../../../server/src/db/tables";
import ColorSwatches, {
  ColorItem,
  ColorSwatchTile,
  ColorSwatchesContainer,
} from "./ColorSwatches";

interface props {
  config: UserProjectConfig;
  id: UserProject["id"];
}

export default function Editor({ config, id }: props) {
  const [configState, setConfigState] = useState(() =>
    populateDefaultValues(config)
  );

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
            break;
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
      <Container>
        <Applicator
          config={configState}
          elementStyles={configState.elements.button![0]}
          onChange={(newStyles) => {
            setConfigState((s) => {
              const newConfigState = { ...s };
              newConfigState.elements.button![0] = newStyles;
              return newConfigState;
            });
          }}
        >
          <Button style={{ width: "8rem", height: "3rem" }}>Hey</Button>
        </Applicator>
      </Container>
    </Grid>
  );
}

function Applicator(props: {
  children: JSX.Element;
  config: UserProjectConfig;
  elementStyles: ConfigElementStyles;
  onChange: (styles: ConfigElementStyles) => void;
}) {
  const { children, config, elementStyles, onChange } = props;

  const element = React.cloneElement(children, {
    style: {
      ...children.props.style,
      backgroundColor: elementStyles.backgroundColor,
      borderWidth: elementStyles.borderWidth + "px",
      borderRadius: elementStyles.borderRadius + "px",
      color: elementStyles.color,
      padding: `${elementStyles.paddingX}px ${elementStyles.paddingY}px`,
    } as CSSProperties,
  });

  return (
    <Popover.Root>
      <Popover.Trigger>{element}</Popover.Trigger>
      <Popover.Content>
        <Flex p="2" direction={"column"} gap="2">
          <Text>Background</Text>
          <ColorSwatchesContainer>
            {config.colors.map((c) => (
              <ColorSwatchTile
                key={c.id}
                bgColor={c.val}
                onClick={() => {
                  const newStyles = {
                    ...elementStyles,
                    backgroundColor: c.val,
                  };
                  onChange(newStyles);
                }}
              />
            ))}
          </ColorSwatchesContainer>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
