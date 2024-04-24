import { PlusCircledIcon } from "@radix-ui/react-icons";
import { Button, Flex, Popover } from "@radix-ui/themes";
import { HexColorPicker } from "react-colorful";
import { useDebouncyFn } from "use-debouncy";
import { UserProjectConfig } from "../../../../server/src/db/schema";

export type ColorItem = UserProjectConfig["colors"][number];

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
        <Button
          className="border-2 border-white"
          variant="solid"
          style={{ backgroundColor: color, width: "3rem", height: "3rem" }}
        >
          {props.children}
        </Button>
      </Popover.Trigger>
      <Popover.Content width={"15rem"}>
        <HexColorPicker color={color} onChange={onColorChange} />
      </Popover.Content>
    </Popover.Root>
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
    <Flex wrap={"wrap"} py="2" gap="1" maxWidth={"15rem"}>
      {exisitingColorSwatches}
      <Button
        onClick={() =>
          handleColorChange(
            { id: Date.now(), label: "New", val: "#efefef" },
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
    </Flex>
  );
}
