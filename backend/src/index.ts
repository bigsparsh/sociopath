import { Hono } from "hono";
import { cors } from "hono/cors";
import { commentRouter } from "./routes/comment";
import { friendRouter } from "./routes/friend";
import { postRouter } from "./routes/post";
import { userRouter } from "./routes/user";

export const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use(cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/post", postRouter);
app.route("/api/v1/friend", friendRouter);
app.route("/api/v1/comment", commentRouter);

export default app;
