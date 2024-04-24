import { z } from "zod";

export const userProjectConfigSchema = z.object({
  colors: z.array(
    z.object({
      val: z.string(),
      type: z.enum(["RGBA", "HSLA"]),
      label: z.string(),
    })
  ),
  dimensions: z.array(
    z.object({
      val: z.number(),
      unit: z.enum(["px", "em", "rem"]),
      label: z.string(),
      type: z.enum(["RADIUS", "SPACING", "RADIUS", "PADDING"]),
    })
  ),
});
export type UserProjectConfig = z.infer<typeof userProjectConfigSchema>;
