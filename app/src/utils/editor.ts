import { UserProjectConfig } from "../../../server/src/db/schema";

export const populateDefaultValues = (config: UserProjectConfig) => {
  const finalValue = structuredClone(config);
  if (!config.colors.length) {
    finalValue.colors.push(
      { id: 0, val: "#000000" },
      { id: 1, val: "#8b8d98" },
      { id: 2, val: "#ad7f59" },
      { id: 3, val: "#ffea2d" },
      { id: 4, val: "#ce4044" },
      { id: 5, val: "#d6409f" },
      { id: 6, val: "#6d56cf" },
      { id: 7, val: "#027cdc" },
      { id: 8, val: "#31a46c" },
      { id: 9, val: "#ffffff" }
    );
  }
  if (!config.dimensions.length) {
    finalValue.dimensions.push(
      { type: "border", px: 1, id: 0 },
      { type: "border", px: 2, id: 1 },
      { type: "border", px: 4, id: 2 },
      { type: "radius", px: 0, id: 10 },
      { type: "radius", px: 2, id: 11 },
      { type: "radius", px: 4, id: 12 },
      { type: "padding", px: 2, id: 20 },
      { type: "padding", px: 4, id: 21 },
      { type: "padding", px: 8, id: 22 }
    );
  }
  if (!config.elements.button?.length) {
    finalValue.elements.button = [
      {
        styleName: "Default",
        backgroundColor: "#8b8d98",
        borderColor: "#8b8d98",
        borderRadius: 0,
        borderWidth: 1,
        color: "#ffffff",
        paddingX: 2,
        paddingY: 2,
      },
    ];
  }
  if (!config.elements["input.checkbox"]?.length) {
    finalValue.elements["input.checkbox"] = [
      {
        styleName: "Default",
        backgroundColor: "#ffffff",
        borderColor: "#8b8d98",
        borderRadius: 0,
        borderWidth: 0,
        color: "#000000",
        paddingX: 2,
        paddingY: 2,
      },
    ];
  }
  if (!config.elements["input.radio"]?.length) {
    finalValue.elements["input.radio"] = [
      {
        styleName: "Default",
        backgroundColor: "#ffffff",
        borderColor: "#8b8d98",
        borderRadius: 0,
        borderWidth: 0,
        color: "#000000",
        paddingX: 2,
        paddingY: 2,
      },
    ];
  }
  if (!config.elements["input.text"]?.length) {
    finalValue.elements["input.text"] = [
      {
        styleName: "Default",
        backgroundColor: "#8b8d98",
        borderColor: "#8b8d98",
        borderRadius: 0,
        borderWidth: 1,
        color: "#ffffff",
        paddingX: 2,
        paddingY: 2,
      },
    ];
  }
  if (!config.elements.select?.length) {
    finalValue.elements["select"] = [
      {
        styleName: "Default",
        backgroundColor: "#8b8d98",
        borderColor: "#8b8d98",
        borderRadius: 0,
        borderWidth: 1,
        color: "#ffffff",
        paddingX: 2,
        paddingY: 2,
      },
    ];
  }
  return finalValue;
};
