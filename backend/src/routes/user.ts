import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign } from "hono/jwt";
import authMiddleware from "../middlewares/auth";
import { decode } from "hono/jwt";
export const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  }
}>();

userRouter.post('/create', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
      phone: body.phone,
      profile_image: body.profile_image,
      bio: body.bio,
      appreciate_mode: body.appreciate_mode,
      address: body.address
    },
  });

  const token = await sign({ id: user.user_id }, c.env.JWT_SECRET)
  return c.json({
    jwt: token
  })
})

userRouter.get('/me', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const jwt = c.req.query("jwt");
  const userId = decode(jwt).payload.id;

  if (jwt) {
    const user = await prisma.user.findUnique({
      where: {
        user_id: userId
      },
      select: {
        name: true,
        email: true,
        phone: true,
        address: true,
        comment: true,
        comment_preference: true,
        post: true,
        post_preference: true,
        bio: true,
        friend: true,
        profile_image: true,
        user_id: true,
        appreciate_mode: true,
        password: true
      }
    })
    return c.json({
      you: user
    })
  }
  return c.json({
    error: "Send the JWT in order to indentify"
  })


});


userRouter.post('/login', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const user = await prisma.user.findFirst({
    where: {
      email: body.email,
      password: body.password
    }
  })
  if (user) {
    const token = await sign({ id: user.user_id }, c.env.JWT_SECRET);
    return c.json({
      message: "Logged in Successfully",
      jwt: token
    })
  }
  return c.json({
    error: "Email or password is invalid"
  })

});

userRouter.use(authMiddleware);
userRouter.get('/get', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId") || "";
  if (filterId != "") {
    const user = await prisma.user.findUnique({
      where: {
        user_id: filterId
      }
    });
    return c.json({
      user: user
    });
  }

  const users = await prisma.user.findMany();
  return c.json({
    users: users
  });

});

userRouter.delete('/delete', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId") || "";
  if (filterId != "") {
    const user = await prisma.user.delete({
      where: {
        user_id: filterId
      }
    })
    return c.json({
      message: "Successfully Deleted USER!",
      response: user
    })
  }
  return c.json({
    message: "Kindly, Send a filter ID to indentify the user to delete"
  })

});

userRouter.put('/update', async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const filterId = c.req.query("filterId");
  const updatedUser = await c.req.json();

  await prisma.user.update({
    where: {
      user_id: filterId
    },
    data: {
      name: updatedUser.name,
      email: updatedUser.email,
      password: updatedUser.password,
      address: updatedUser.address,
      bio: updatedUser.bio,
      phone: updatedUser.phone,
      profile_image: updatedUser.profile_image,
      appreciate_mode: updatedUser.appreciate_mode
    }
  });

  return c.json({
    message: "User updated Successfully",
  })

});



