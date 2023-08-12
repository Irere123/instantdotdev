import "dotenv-safe/config";
import express from "express";
import { createServer } from "node:http";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import { createYoga } from "graphql-yoga";
import { schema } from "./graphql";

(async () => {
  const app = express();

  const yoga = createYoga({
    schema,
    graphiql: {
      title: "Instant GraphQL",
      subscriptionsProtocol: "WS",
    },
  });

  const yogaRouter = express.Router();
  yogaRouter.use(yoga);

  app.use(yoga.graphqlEndpoint, yogaRouter);

  const httpServer = createServer(app);

  const wsServer = new WebSocketServer({
    server: httpServer,
    path: yoga.graphqlEndpoint,
  });

  // Integrate Yoga's Envelop instance and NodeJS server with graphql-ws
  useServer(
    {
      execute: (args: any) => args.rootValue.execute(args),
      subscribe: (args: any) => args.rootValue.subscribe(args),
      onSubscribe: async (ctx, msg) => {
        const { schema, execute, subscribe, contextFactory, parse, validate } =
          yoga.getEnveloped({
            ...ctx,
            req: ctx.extra.request,
            socket: ctx.extra.socket,
            params: msg.payload,
          });

        const args = {
          schema,
          operationName: msg.payload.operationName,
          document: parse(msg.payload.query),
          variableValues: msg.payload.variables,
          contextValue: await contextFactory(),
          rootValue: {
            execute,
            subscribe,
          },
        };

        const errors = validate(args.schema, args.document);
        if (errors.length) return errors;
        return args;
      },
    },
    wsServer
  );

  // You can know register your other endpoints that will not be affected by the GraphiQL CSP configuration
  app.get("/v1/api/hello", (_req, res) => {
    res.send("Hello World!");
  });

  httpServer.listen(4000, () => {
    console.log("Server started!");
  });
})();
