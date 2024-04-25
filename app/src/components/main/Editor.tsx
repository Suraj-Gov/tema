"use client";
import { populateDefaultValues } from "@/utils/editor";
import { trpc } from "@/utils/trpc";
import { Container, Flex, Heading, Popover, Text } from "@radix-ui/themes";
import equal from "fast-deep-equal";
import React, { CSSProperties, useEffect, useRef, useState } from "react";
import {
  ConfigElementStyles,
  UserProjectConfig,
} from "../../../../server/src/db/schema";
import { UserProject } from "../../../../server/src/db/tables";
import {
  ColorItem,
  ColorSwatches,
  DimensionItem,
  DimensionSwatches,
  ModifierTile,
  TilesContainer,
} from "./Modifiers";

interface props {
  config: UserProjectConfig;
  id: UserProject["id"];
}

const TIMEOUT_INTERVAL = 5000;

export default function Editor({ config, id }: props) {
  const [configState, setConfigState] = useState(() =>
    populateDefaultValues(config)
  );

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const update = trpc.project.update.useMutation({
    onSuccess: () => {
      config = structuredClone(configState);
    },
  });

  console.log(configState);

  useEffect(() => {
    const updateIfChanged = async () => {
      const isEqual = equal(configState, config);
      if (!isEqual) {
        await update.mutateAsync({ config: configState });
      }
      timeoutRef.current = setTimeout(updateIfChanged, TIMEOUT_INTERVAL);
    };

    timeoutRef.current = setTimeout(updateIfChanged, TIMEOUT_INTERVAL);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [config, configState, update]);

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

  const handleDimensionChange = (
    params: DimensionItem,
    operation: "ADD" | "UPDATE" | "DELETE"
  ) => {
    setConfigState((prev) => {
      console.log(params, prev.dimensions);
      if (operation === "ADD") {
        prev.dimensions.push(params);
      } else if (operation === "UPDATE") {
        for (let i = 0; i < prev.dimensions.length; i++) {
          if (prev.dimensions[i].id === params.id) {
            prev.dimensions[i].px = params.px;
            break;
          }
        }
      } else if (operation === "DELETE") {
        const idx = prev.dimensions.findIndex((d) => d.id === params.id);
        prev.dimensions.splice(idx, 1);
      }

      return structuredClone(prev);
    });
  };

  return (
    <Flex gap="2" wrap={"wrap"}>
      <Container p="4">
        <Container>
          <Heading size="5" as="h3">
            Colors
          </Heading>
          <ColorSwatches
            config={configState}
            handleColorChange={handleColorChange}
          />
        </Container>
        <Container mt="4">
          <Heading size="5" as="h3">
            Dimensions
          </Heading>
          <Container my="2">
            <Heading size="3" as="h4">
              Border Width
            </Heading>
            <Container mt="2">
              <DimensionSwatches
                config={configState}
                handleDimensionChange={handleDimensionChange}
                dimensionType="border"
              />
            </Container>
          </Container>
          <Container my="2">
            <Heading size="3" as="h4">
              Border Radius
            </Heading>
            <Container mt="2">
              <DimensionSwatches
                config={configState}
                handleDimensionChange={handleDimensionChange}
                dimensionType="radius"
              />
            </Container>
          </Container>
          <Container my="2">
            <Heading size="3" as="h4">
              Padding
            </Heading>
            <Container mt="2">
              <DimensionSwatches
                config={configState}
                handleDimensionChange={handleDimensionChange}
                dimensionType="padding"
              />
            </Container>
          </Container>
        </Container>
      </Container>
      <Container p="4">
        <Heading size="5" as="h3">
          Components
        </Heading>
        <Flex align={"start"} mt="2" wrap={"wrap"} gap="6">
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
            <button style={{ minWidth: "8rem", minHeight: "3rem" }}>Hey</button>
          </Applicator>
          <Applicator
            config={configState}
            elementStyles={configState.elements.select![0]}
            onChange={(newStyles) => {
              setConfigState((s) => {
                const newConfigState = { ...s };
                newConfigState.elements.select![0] = newStyles;
                return newConfigState;
              });
            }}
          >
            <select
              defaultValue={"Default"}
              style={{ minWidth: "8rem", minHeight: "3rem" }}
            >
              <option value="Default">Default</option>
              <option value="Tangerine">Tangerine</option>
              <option value="Moss">Moss</option>
            </select>
          </Applicator>
          <Applicator
            config={configState}
            elementStyles={configState.elements["input.text"]![0]}
            onChange={(newStyles) => {
              setConfigState((s) => {
                const newConfigState = { ...s };
                newConfigState.elements["input.text"]![0] = newStyles;
                return newConfigState;
              });
            }}
          >
            <input
              type="text"
              defaultValue={"Mary lost her lamb"}
              style={{ minWidth: "12rem", minHeight: "2rem" }}
            />
          </Applicator>
        </Flex>
      </Container>
    </Flex>
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
      borderColor: elementStyles.borderColor,
      borderStyle: "solid",
      borderWidth: elementStyles.borderWidth + "px",
      borderRadius: elementStyles.borderRadius + "px",
      color: elementStyles.color,
      padding: `${elementStyles.paddingX}px ${elementStyles.paddingY}px`,
    } as CSSProperties,
  });

  return (
    <Popover.Root>
      <Popover.Trigger>{element}</Popover.Trigger>
      <Popover.Content size={"4"}>
        <Flex>
          <Flex p="2" direction={"column"} gap="2">
            <Text>Text Color</Text>
            <TilesContainer>
              {config.colors.map((c) => (
                <ModifierTile
                  key={c.id}
                  bgColor={c.val}
                  onClick={() => {
                    const newStyles = {
                      ...elementStyles,
                      color: c.val,
                    };
                    onChange(newStyles);
                  }}
                />
              ))}
            </TilesContainer>
          </Flex>
          <Flex p="2" direction={"column"} gap="2">
            <Text>Background</Text>
            <TilesContainer>
              {config.colors.map((c) => (
                <ModifierTile
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
            </TilesContainer>
          </Flex>
          <Flex p="2" direction={"column"} gap="2">
            <Text>Border Background</Text>
            <TilesContainer>
              {config.colors.map((c) => (
                <ModifierTile
                  key={c.id}
                  bgColor={c.val}
                  onClick={() => {
                    const newStyles = {
                      ...elementStyles,
                      borderColor: c.val,
                    };
                    onChange(newStyles);
                  }}
                />
              ))}
            </TilesContainer>
          </Flex>
        </Flex>
        <Flex>
          <Flex p="2" direction={"column"} gap="2">
            <Text>Padding</Text>
            <TilesContainer>
              {config.dimensions
                .filter((d) => d.type === "padding")
                .map((d) => (
                  <ModifierTile
                    key={d.id}
                    padding={d.px}
                    onClick={() => {
                      const newStyles = {
                        ...elementStyles,
                        paddingX: d.px,
                        paddingY: d.px,
                      };
                      onChange(newStyles);
                    }}
                  />
                ))}
            </TilesContainer>
          </Flex>
          <Flex p="2" direction={"column"} gap="2">
            <Text>Border Width</Text>
            <TilesContainer>
              {config.dimensions
                .filter((d) => d.type === "border")
                .map((d) => (
                  <ModifierTile
                    key={d.id}
                    borderWidth={d.px}
                    onClick={() => {
                      const newStyles = {
                        ...elementStyles,
                        borderWidth: d.px,
                      };
                      onChange(newStyles);
                    }}
                  />
                ))}
            </TilesContainer>
          </Flex>
          <Flex p="2" direction={"column"} gap="2">
            <Text>Border Radius</Text>
            <TilesContainer>
              {config.dimensions
                .filter((d) => d.type === "radius")
                .map((d) => (
                  <ModifierTile
                    key={d.id}
                    borderRadius={d.px}
                    onClick={() => {
                      const newStyles = {
                        ...elementStyles,
                        borderRadius: d.px,
                      };
                      onChange(newStyles);
                    }}
                  />
                ))}
            </TilesContainer>
          </Flex>
        </Flex>
      </Popover.Content>
    </Popover.Root>
  );
}
