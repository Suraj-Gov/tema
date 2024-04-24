import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button, ButtonProps, Flex, Popover } from "@radix-ui/themes";
import { ElementRef, forwardRef } from "react";
import { HexColorPicker } from "react-colorful";
import { useDebouncyFn } from "use-debouncy";
import { UserProjectConfig } from "../../../../server/src/db/schema";

export type ColorItem = UserProjectConfig["colors"][number];

type ButtonElement = ElementRef<typeof Button>;
export const ColorSwatchTile = forwardRef<
  ButtonElement,
  ButtonProps & { bgColor: string }
>(function ColorSwatchTile(props, ref) {
  const { bgColor, ...domProps } = props;
  return (
    <Button
      {...domProps}
      ref={ref}
      className="border-2 border-white"
      variant="solid"
      style={{ backgroundColor: bgColor, width: "3rem", height: "3rem" }}
    />
  );
});

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
        <ColorSwatchTile bgColor={color}>{props.children}</ColorSwatchTile>
      </Popover.Trigger>
      <Popover.Content width={"15rem"}>
        <HexColorPicker color={color} onChange={onColorChange} />
      </Popover.Content>
    </Popover.Root>
  );
}

export function ColorSwatchesContainer({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Flex wrap={"wrap"} py="2" gap="1" maxWidth={"15rem"}>
      {children}
    </Flex>
  );
}

export default function ColorSwatches({
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
      <ColorPicker
        key={c.id}
        color={c}
        onChange={(c) => handleColorChange(c, "UPDATE")}
      />
    );
  });

  return (
    <ColorSwatchesContainer>
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
    </ColorSwatchesContainer>
  );
}
