import { router } from ".";
import { userProjectsRouter } from "../handlers/project";
import { userAuthRouter } from "../handlers/user";

export const appRouter = router({
  user: userAuthRouter,
  project: userProjectsRouter,
});

export type AppRouter = typeof appRouter;
