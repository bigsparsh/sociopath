import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import authMiddleware from "../middlewares/auth";

export const commentRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

const commentReturnContent = {
  comment_id: true,
  post_id: true,
  is_answer: true,
  message: true,
  created_at: true,
  user: true,
  preference: {
    select: {
      preference: true,
      user: true,
    },
  },
};
commentRouter.use(authMiddleware);
commentRouter.post("/create", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const comment = await prisma.comment.create({
    data: {
      message: body.message,
      post_id: body.post_id,
      is_answer: body.is_answer || false,
      user_id: body.user_id,
    },
    select: commentReturnContent,
  });

  return c.json({
    message: "The commment was created successfully",
    comment: comment,
  });
});

commentRouter.get("/get", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId") || "";

  const comments = await prisma.comment.findMany({
    where: {
      NOT: {
        user: {
          delete: true,
        },
      },
      post_id: filterId,
    },
    select: commentReturnContent,
  });
  return c.json({
    message: "All comments associated with this post",
    comments: comments,
  });
});

commentRouter.delete("/delete", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  await prisma.comment.delete({
    where: {
      user_id: body.user_id,
      comment_id: body.comment_id,
    },
  });

  return c.json({
    message: "Comment deleted successfully",
  });
});

commentRouter.put("/update", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const newComment = await prisma.comment.update({
    where: {
      NOT: {
        user: {
          delete: true,
        },
      },
      user_id: body.user_id,
      comment_id: body.comment_id,
    },
    data: {
      message: body.message,
    },
  });

  return c.json({
    message: "Comment updated successfully",
    comment: newComment,
  });
});

commentRouter.put("/updatePreference", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const exists = await prisma.commentPreferences.findFirst({
    where: {
      NOT: {
        user: {
          delete: true,
        },
      },
      comment_id: body.comment_id,
      user_id: body.user_id,
    },
  });

  const postPoster = await prisma.post.findFirst({
    where: {
      NOT: {
        user: {
          delete: true,
        },
      },
      comment: {
        some: {
          comment_id: body.comment_id,
        },
      },
    },
    select: {
      user: {
        select: {
          user_id: true,
        },
      },
      is_question: true,
    },
  });
  if (
    postPoster?.user.user_id == body.user_id &&
    postPoster?.is_question == true
  ) {
    await prisma.comment.update({
      where: {
        NOT: {
          user: {
            delete: true,
          },
        },
        comment_id: body.comment_id,
      },
      data: {
        is_answer: body.preference,
      },
    });
  }
  if (!exists) {
    await prisma.commentPreferences.create({
      data: {
        comment_id: body.comment_id,
        preference: body.preference,
        user_id: body.user_id,
      },
    });
    return c.json({
      message: "Comment reference created Successfully",
    });
  }
  await prisma.commentPreferences.updateMany({
    where: {
      NOT: {
        user: {
          delete: true,
        },
      },
      comment_id: body.comment_id,
      user_id: body.user_id,
    },
    data: {
      preference: body.preference,
    },
  });

  return c.json({
    message: "Comment preference updated Successfully",
  });
});

commentRouter.delete("/removePreference", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const postPoster = await prisma.post.findFirst({
    where: {
      NOT: {
        user: {
          delete: true,
        },
      },
      comment: {
        some: {
          comment_id: body.comment_id,
        },
      },
    },
    select: {
      user: {
        select: {
          user_id: true,
        },
      },
      is_question: true,
    },
  });
  if (
    postPoster?.user.user_id == body.user_id &&
    postPoster?.is_question == true
  ) {
    await prisma.comment.update({
      where: {
        NOT: {
          user: {
            delete: true,
          },
        },
        comment_id: body.comment_id,
      },
      data: {
        is_answer: false,
      },
    });
  }
  await prisma.commentPreferences.deleteMany({
    where: {
      NOT: {
        user: {
          delete: true,
        },
      },
      comment_id: body.comment_id,
      user_id: body.user_id,
    },
  });

  return c.json({
    message: "Comment preference deleted Successfully",
  });
});
