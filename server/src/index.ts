import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import { initializeLucia } from "./auth/lucia";
import { connectPostgres, db } from "./db";
import { env } from "./env";
import { appRouter, type AppRouter } from "./trpc/app";
import { createTRPCContext } from "./trpc/context";

const server = fastify({
  maxParamLength: 5000,
});

server.register(cookie);
server.register(cors, {
  origin: true,
  allowedHeaders: "Content-Type,Authorization,Cookie",
  credentials: true,
});
server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext: (opts) => {
      return createTRPCContext({ req: opts.req, res: opts.res });
    },
    onError: (opts) => {
      console.error(opts.error, "\ntrpc err on path:", opts.path);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

const main = async () => {
  try {
    connectPostgres();
    initializeLucia(db);
    await server.listen({ port: env.PORT });
    console.log("live on port", env.PORT);
  } catch (err) {
    console.log("could not start server", err);
    server.log.error(err);
    process.exit(1);
  }
};

main();
