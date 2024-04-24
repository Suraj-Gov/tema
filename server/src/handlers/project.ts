import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../db";
import { userProjectConfigSchema, type UserProjectConfig } from "../db/schema";
import { userProjectsTable, type UserProject } from "../db/tables";
import { Result } from "../helpers/result";
import { authedProcedure, router } from "../trpc";

const createProjectFields = z.object({
  name: z.string().min(4),
});
const handleCreateProject = async (
  uid: number,
  input: z.infer<typeof createProjectFields>
): Promise<Result<UserProject>> => {
  try {
    const initConfig: UserProjectConfig = {
      colors: [],
      dimensions: [],
    };
    const newRow = await db
      .insert(userProjectsTable)
      .values({
        config: initConfig,
        userId: uid,
        name: input.name,
      })
      .returning();
    if (!newRow[0]) {
      return Result.error("Couldn't create project", "BAD_REQUEST");
    }
    return new Result(newRow[0]);
  } catch (err) {
    console.error(err);
    return Result.error("Failed to create project");
  }
};

const updateProjectFields = z.object({
  name: z.string().min(4),
  config: userProjectConfigSchema,
});
const handleUpdateProject = async (
  uid: number,
  input: z.infer<typeof updateProjectFields>
): Promise<Result<boolean>> => {
  try {
    await db.update(userProjectsTable).set({
      config: input.config,
      name: input.name,
      updatedAt: new Date(),
    });
    return new Result(true);
  } catch (err) {
    console.error(err);
    return Result.error("Failed to update project");
  }
};

// TODO prevent overfetching
const handleGetAllProjects = async (
  uid: number
): Promise<Result<Omit<UserProject, "config">[]>> => {
  try {
    const rows = await db
      .select({
        id: userProjectsTable.id,
        name: userProjectsTable.name,
        userId: userProjectsTable.userId,
        createdAt: userProjectsTable.createdAt,
        updatedAt: userProjectsTable.updatedAt,
      })
      .from(userProjectsTable)
      .where(eq(userProjectsTable.userId, uid))
      .orderBy(desc(userProjectsTable.updatedAt));
    return new Result(rows);
  } catch (err) {
    console.error(err);
    return Result.error(
      "Could not fetch your projects",
      "INTERNAL_SERVER_ERROR"
    );
  }
};

const getProjectByIDFields = z.object({
  id: z.number(),
});
const projectFields: z.ZodType<UserProject & { config: UserProjectConfig }> =
  z.object({
    id: z.number(),
    name: z.string(),
    userId: z.number(),
    config: userProjectConfigSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
  });
const handleGetProjectByID = async (
  uid: number,
  input: z.infer<typeof getProjectByIDFields>
): Promise<Result<UserProject>> => {
  try {
    const rows = await db
      .select()
      .from(userProjectsTable)
      .where(eq(userProjectsTable.id, input.id));
    if (!rows[0]) {
      return Result.error("Project does not exist", "NOT_FOUND");
    }
    return new Result(rows[0]);
  } catch (err) {
    console.error(err);
    return Result.error("Could not fetch project", "INTERNAL_SERVER_ERROR");
  }
};

export const userProjectsRouter = router({
  create: authedProcedure.input(createProjectFields).mutation(async (opts) => {
    const res = await handleCreateProject(opts.ctx.uid!, opts.input);
    if (res.error) return res.httpErrResponse();
    return res.val;
  }),
  update: authedProcedure.input(updateProjectFields).mutation(async (opts) => {
    const res = await handleUpdateProject(opts.ctx.uid!, opts.input);
    if (res.error) return res.httpErrResponse();
    return res.val;
  }),
  get: authedProcedure.query(async (opts) => {
    // TODO pagination
    const res = await handleGetAllProjects(opts.ctx.uid!);
    if (res.error) return res.httpErrResponse();
    return res.val;
  }),
  getByID: authedProcedure
    .input(getProjectByIDFields)
    .output(projectFields)
    .query(async (opts) => {
      const res = await handleGetProjectByID(opts.ctx.uid!, opts.input);
      if (res.error) return res.httpErrResponse();
      return res.val;
    }),
});
