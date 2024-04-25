import { Cross1Icon, PlusCircledIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
  ButtonProps,
  Flex,
  IconButton,
  Popover,
  Slider,
} from "@radix-ui/themes";
import { ElementRef, forwardRef } from "react";
import { HexColorPicker } from "react-colorful";
import { useDebouncyFn } from "use-debouncy";
import {
  DimensionTypes,
  UserProjectConfig,
} from "../../../../server/src/db/schema";

export type ColorItem = UserProjectConfig["colors"][number];
export type DimensionItem = UserProjectConfig["dimensions"][number];

type ButtonElement = ElementRef<typeof Button>;
export const ModifierTile = forwardRef<
  ButtonElement,
  ButtonProps & {
    bgColor?: string;
    borderWidth?: number;
    borderRadius?: number;
    padding?: number;
  }
>(function ColorSwatchTile(props, ref) {
  const {
    bgColor = "#ffffff",
    borderWidth = 2,
    borderRadius = 2,
    padding = 0,
    ...domProps
  } = props;

  return (
    <Button
      {...domProps}
      ref={ref}
      variant="solid"
      style={{
        position: "relative",
        padding: padding,
        backgroundColor: bgColor,
        borderTopWidth: borderWidth,
        borderLeftWidth: borderWidth,
        borderTopLeftRadius: borderRadius,
        borderColor: "black",
        borderStyle: "solid",
        width: "3rem",
        height: "3rem",
        margin: "2px",
      }}
    >
      {padding ? (
        <Box
          position="absolute"
          style={{ inset: padding, backgroundColor: "black" }}
        ></Box>
      ) : null}
    </Button>
  );
});

export function TilesContainer({ children }: { children: React.ReactNode }) {
  return (
    <Flex wrap={"wrap"} justify={"start"} py="2" gap="1" maxWidth={"15rem"}>
      {children}
    </Flex>
  );
}

function ColorPicker(props: {
  color: ColorItem;
  onChange: (c: ColorItem) => void;
  children?: React.ReactNode;
}) {
  const onColorChange = useDebouncyFn((newColor: string) => {
    const newVal: ColorItem = { ...props.color, val: newColor };
    props.onChange(newVal);
  }, 200);

  const color = props.color.val;
  return (
    <Popover.Root>
      <Popover.Trigger>
        <ModifierTile bgColor={color}>{props.children}</ModifierTile>
      </Popover.Trigger>
      <Popover.Content width={"15rem"}>
        <HexColorPicker color={color} onChange={onColorChange} />
      </Popover.Content>
    </Popover.Root>
  );
}

export function ColorSwatches({
  config,
  handleColorChange,
}: {
  config: UserProjectConfig;
  handleColorChange: (
    value: ColorItem,
    operation: "ADD" | "UPDATE" | "DELETE"
  ) => void;
}) {
  const exisitingColorSwatches = config.colors.map((c) => {
    return (
      <Box position={"relative"} key={c.id}>
        <ColorPicker
          color={c}
          onChange={(c) => handleColorChange(c, "UPDATE")}
        />
        <IconButton
          onClick={() => handleColorChange(c, "DELETE")}
          size="1"
          style={{
            background: "white",
            color: "black",
            position: "absolute",
            top: "-10%",
            right: "-10%",
          }}
        >
          <Cross1Icon />
        </IconButton>
      </Box>
    );
  });

  return (
    <TilesContainer>
      {exisitingColorSwatches}
      <Button
        onClick={() =>
          handleColorChange({ id: Date.now(), val: "#efefef" }, "ADD")
        }
        style={{
          width: "3rem",
          height: "3rem",
          background: "white",
          border: "2px solid black",
        }}
      >
        <PlusCircledIcon color="black" width="2rem" height="2rem" />
      </Button>
    </TilesContainer>
  );
}

function DimensionPicker(props: {
  dimension: DimensionItem;
  onChange: (c: DimensionItem) => void;
  children?: React.ReactNode;
  type: DimensionTypes;
}) {
  const debouncedOnChange = useDebouncyFn((px: number) => {
    const newVal: DimensionItem = { ...props.dimension, px };
    props.onChange(newVal);
  }, 200);

  const px = props.dimension.px;
  return (
    <Popover.Root>
      <Popover.Trigger>
        {props.type === "border" ? (
          <ModifierTile borderWidth={px}>{props.children}</ModifierTile>
        ) : props.type === "radius" ? (
          <ModifierTile borderRadius={px}>{props.children}</ModifierTile>
        ) : props.type === "padding" ? (
          <ModifierTile padding={px} borderWidth={1} bgColor="red">
            {props.children}
          </ModifierTile>
        ) : null}
      </Popover.Trigger>
      <Popover.Content width={"10rem"}>
        <Slider
          min={0}
          defaultValue={[px]}
          max={props.type === "radius" ? 40 : 15}
          onValueChange={(px) => debouncedOnChange(px[0])}
        />
      </Popover.Content>
    </Popover.Root>
  );
}

export function DimensionSwatches({
  config,
  handleDimensionChange,
  dimensionType,
}: {
  config: UserProjectConfig;
  handleDimensionChange: (
    value: DimensionItem,
    operation: "ADD" | "UPDATE" | "DELETE"
  ) => void;
  dimensionType: DimensionTypes;
}) {
  const existingBorderWidths = config.dimensions
    .filter((d) => d.type === dimensionType)
    .map((d) => {
      return (
        <Box position={"relative"} key={d.id}>
          <DimensionPicker
            key={d.id}
            dimension={d}
            onChange={(d) => handleDimensionChange(d, "UPDATE")}
            type={dimensionType}
          />
          <IconButton
            onClick={() => handleDimensionChange(d, "DELETE")}
            size="1"
            style={{
              background: "white",
              color: "black",
              position: "absolute",
              top: "-10%",
              right: "-10%",
            }}
          >
            <Cross1Icon />
          </IconButton>
        </Box>
      );
    });

  return (
    <TilesContainer>
      {existingBorderWidths}
      <Button
        onClick={() =>
          handleDimensionChange(
            { id: Date.now(), px: 2, type: dimensionType },
            "ADD"
          )
        }
        style={{
          width: "3rem",
          height: "3rem",
          background: "white",
          border: "2px solid black",
        }}
      >
        <PlusCircledIcon color="black" width="2rem" height="2rem" />
      </Button>
    </TilesContainer>
  );
}
