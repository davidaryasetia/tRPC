import express from "express";
import * as trpc from "@trpc/server";
import * as trpcExpress from "@trpc/server/adapters/express";
import cors from "cors";
import { z } from "zod";
import { resolveHTTPResponse } from "@trpc/server";

interface chatMessage {
  user: string;
  message: string;
}

const messages: chatMessage[] = [
  { user: "user1", message: "Hello" },
  { user: "user2", message: "hi" },
];

const appRouter = trpc
  .router()
  .query("hello", {
    resolve() {
      return "Hello WorldII";
    },
  })
  .query("getMessages", {
    input: z.number().default(10),
    resolve({ input }) {
      return messages.slice(-input);
    },
  })

  .mutation("addMessage", {
    input: z.object({
      user: z.string(),
      message: z.string(),
    }),
    resolve({ input }) {
      messages.push(input);
      return input;
    },
  });

export type AppRouter = typeof appRouter;

const app = express();
app.use(cors());
const port = 8080;

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: () => null,
  })
);

app.get("/", (req, res) => {
  res.send("hello from api-server");
});

app.listen(port, () => {
  console.log(`api-server listening at http://localhost:${port}`);
});
