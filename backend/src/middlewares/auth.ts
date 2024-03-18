import { verify } from "hono/jwt";

// @ts-ignore
const authMiddleware = async (c, next) => {
  const authToken = c.req.header("Authorization");
  try{
    await verify(authToken, c.env.JWT_SECRET);
    await next();
  } catch(err){
    return c.json({
      message: "Provide the correct authorization token"
    })
  }

  
}

export default authMiddleware;
