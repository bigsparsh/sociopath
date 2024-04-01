import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import authMiddleware from "../middlewares/auth";

export const friendRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

friendRouter.use(authMiddleware);
friendRouter.post("/create", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const friendship = await prisma.friend.findFirst({
    where: {
      user2_id: body.user1_id,
      user1_id: body.user2_id,
    },
  });
  const existing = await prisma.friend.findFirst({
    where: {
      user1_id: body.user1_id,
      user2_id: body.user2_id,
    },
  });
  if (existing) {
    return c.json({
      error: "This friendship already exists",
    });
  }
  if (friendship) {
    const friend = await prisma.friend.create({
      data: {
        user1_id: body.user1_id,
        user2_id: body.user2_id,
        mutual: true,
      },
    });
    await prisma.friend.update({
      where: {
        friend_id: friendship.friend_id,
      },
      data: {
        mutual: true,
      },
    });
    return c.json({
      message: "mutual FRIEND created successfully!",
      friend: friend,
    });
  } else {
    const friend = await prisma.friend.create({
      data: {
        user1_id: body.user1_id,
        user2_id: body.user2_id,
        mutual: false,
      },
    });
    return c.json({
      message: "Non-Mutual FRIEND created successfully!",
      friend: friend,
    });
  }
});

friendRouter.get("/get", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  if (body.user_id && body.friend_id) {
    const friend = await prisma.friend.findFirst({
      where: {
        user1_id: body.user_id,
        user2_id: body.friend_id,
      },
    });
    return c.json({
      friend: friend,
    });
  } else if (body.user_id) {
    const friends = await prisma.friend.findMany({
      where: {
        user1_id: body.user_id,
      },
    });
    return c.json({
      friends: friends,
    });
  }

  return c.json({
    message:
      "Kindly, Send either one or two user IDs in order to perform operations on the friendship",
  });
});

friendRouter.delete("/delete", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const friendship = await prisma.friend.findFirst({
    where: {
      user1_id: body.user2_id,
      user2_id: body.user1_id,
    },
  });
  const exists = await prisma.friend.findFirst({
    where: {
      user1_id: body.user1_id,
      user2_id: body.user2_id,
    },
  });

  if (!exists) {
    return c.json({
      error: "This friendship doesn't exist",
    });
  }

  if (friendship) {
    await prisma.friend.update({
      where: {
        friend_id: friendship.friend_id,
      },
      data: {
        mutual: false,
      },
    });
  }
  await prisma.friend.delete({
    where: {
      friend_id: exists.friend_id,
    },
  });
  return c.json({
    message: "Friendship Deleted successfully! :(",
  });
});
