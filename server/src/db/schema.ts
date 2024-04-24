import { z } from "zod";

const configElements = z.enum([
  "button",
  "input.text",
  "input.radio",
  "input.checkbox",
  "select",
]);
const configElementStyles = z.object({
  styleName: z.string(),
  backgroundColor: z.string(),
  color: z.string(),
  borderWidth: z.number(),
  borderRadius: z.number(),
  paddingX: z.number(),
  paddingY: z.number(),
});
export type ConfigElementTypes = z.infer<typeof configElements>;
export type ConfigElementStyles = z.infer<typeof configElementStyles>;

export const userProjectConfigSchema = z.object({
  colors: z.array(
    z.object({
      id: z.number(),
      val: z.string(),
    })
  ),
  dimensions: z.array(
    z.object({
      px: z.number(),
      type: z.enum(["border", "padding", "radius"]),
    })
  ),
  elements: z.record(configElements, configElementStyles.array()),
});
export type UserProjectConfig = z.infer<typeof userProjectConfigSchema>;
