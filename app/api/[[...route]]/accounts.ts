import { Hono } from "hono";
import { db } from "@/db/drizzle";
import { inserAcccountSchema } from "@/db/schema-validator";
import { account } from "@/db/schema";
import { clerkMiddleware, getAuth } from "@hono/clerk-auth";
import { and, eq, inArray } from "drizzle-orm";
import {zValidator} from "@hono/zod-validator";
import {createId} from "@paralleldrive/cuid2";
import {z} from "zod";
import { error } from "console";


const app = new Hono().get("/",clerkMiddleware(),async (c)=>{
  
  const auth =getAuth(c);
  if(!auth?.userId){
   return c.json({error:"unauthorized"},401);
  }
  const data = await db.select({
    id: account.id,
    name: account.name
  }).from(account).where(eq(account.userId, auth.userId));

  return c.json({data});
}).get("/:id",zValidator("param",z.object({
  id: z.string().optional()
})),clerkMiddleware(), async(c)=>{
  const auth = getAuth(c);
  const {id } = c.req.valid("param");
  if(!id){
    return c.json({error:"Missing id "}, 400)
  }
  if(!auth?.userId){
    return c.json({error:"Unauthorizd "}, 401)
  }
  const [data] = await db.select({
    id: account.id,
    name: account.name

  }).from(account).where(and(eq(account.userId,auth.userId),
  eq(account.id,id)));
  if(!data) return c.json({error:"Not found"},404);
  return c.json({data});
}).post("/",clerkMiddleware(),zValidator("json",inserAcccountSchema.pick({name: true})),async (c)=>{
  const auth = getAuth(c);
  const values = c.req.valid("json");
  if(!auth?.userId){
    return c.json({error:"Unauthorized"},401);
  }

  const [data] = await db.insert(account).values({
    id:createId(),
    userId: auth.userId,
    ...values,

  }).returning();
  return c.json({data})

}).post("/bulk-delete",clerkMiddleware(),zValidator("json",z.object({
  ids: z.array(z.string())})),async (c)=>{
    const auth = getAuth(c);
    const values = c.req.valid("json");
    if(!auth?.userId) return c.json({error:"Unauthorized"},401);

    const data = await db.delete(account).where(and(eq(account.userId,auth.userId),inArray(account.id,values.ids))).returning({id: account.id});
    return c.json({data});

  }).patch("/:id",clerkMiddleware(),zValidator("param",z.object({
    id: z.string().optional()
  })),zValidator("json",inserAcccountSchema.pick({name: true})),async (c)=>{
    const auth = getAuth(c);
    const {id} = c.req.valid("param");
    const values = c.req.valid("json");

    if(!id) return c.json({error:"Missing id"},400);
    if(!auth?.userId) return c.json({error:"Unauthorized"},401);
    
    const [data] = await db.update(account).set(values).where(and(eq(account.userId,auth.userId),eq(account.id,id))).returning();
    if(!data) return c.json({error:" Account Not found"},404);
    return c.json({data});
  }).delete("/:id",clerkMiddleware(),zValidator("param",z.object({
    id: z.string().optional()
  })),async (c)=>{
    const auth = getAuth(c);
    const {id} = c.req.valid("param");

    if(!id) return c.json({error:"Missing id"},400);
    if(!auth?.userId) return c.json({error:"Unauthorized"},401);
    
    const [data] = await db.delete(account).where(and(eq(account.userId,auth.userId),eq(account.id,id))).returning({
      id: account.id
    });
    if(!data) return c.json({error:" Account Not found"},404);
    return c.json({data});
  })

export default app;