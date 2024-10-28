
import { clerkMiddleware, getAuth } from '@hono/clerk-auth';
import { zValidator } from '@hono/zod-validator';
import {z} from "zod"
import { Hono } from 'hono';
import { subDays, parse, differenceInDays } from 'date-fns';
import { db } from '@/db/drizzle';
import { sql, sum, and, eq, gte, lte, lt, desc} from 'drizzle-orm';
import { categories, transactions } from '@/db/schema';
import { account } from '@/db/schema';
import { calculatePercentage, fillMissingDays } from '@/lib/utils';


const app = new Hono().get('/',clerkMiddleware(),
zValidator(
  "query",
  z.object({
    from: z.string().optional(),
    to: z.string().optional(),
    accountId: z.string().optional(),

  }) 
), async (c) => {

  const auth = getAuth(c);
  const { from, to, accountId } = c.req.valid('query');

  if (!auth?.userId) {
    return c.json({ error: 'unauthorized' }, 401);
  }

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo,30);

  const startDate = from ? parse(from,"yyyy-MM-dd",new Date()) : defaultFrom;
  const endDate = to ? parse(to,"yyyy-MM-dd",new Date()) : defaultTo;

 

  const periodLenght = differenceInDays(endDate,startDate)+1;
  const lastPeriodStart = subDays(startDate,periodLenght);
  const lastPeriodEnd = subDays(endDate,periodLenght);
  

  
  async function fetchFinancialData(userId: string, startDate: Date, endDate: Date) {

    return await db.select({
      income: sql`SUM(CASE WHEN ${transactions.amount}>=0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
      exepense:sql`SUM(CASE WHEN ${transactions.amount}<0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
      remaining: sum(transactions.amount).mapWith(Number),
    }).from(transactions).innerJoin(account,eq(transactions.accountId,account.id)).where(
      and(
        accountId? eq(transactions.accountId,accountId): undefined,
        eq(account.userId,userId),
        gte(transactions.date,startDate),
        lte(transactions.date,endDate)
      ))

    
  }

  
  const [currentPeriod] = await fetchFinancialData(auth.userId,
    startDate,
    endDate);
  const [lastPeriod]= await fetchFinancialData(
    auth.userId,
    lastPeriodStart,
    lastPeriodEnd);
   
  
    const incomesChange = calculatePercentage(currentPeriod.income,lastPeriod.income);

    const expensesChange = calculatePercentage(currentPeriod.exepense,lastPeriod.exepense);

    const remainingChange = calculatePercentage(currentPeriod.remaining,
      lastPeriod.remaining);
    
    



      const category = await db.select({
        name: categories.name,
        value: sql`SUM(ABS(${transactions.amount}))`.mapWith(Number),

      }).from(transactions).innerJoin(account,eq(transactions.accountId,account.id)).innerJoin(categories,eq(transactions.categoryId,categories.id)).where(
        and(
          accountId? eq(transactions.accountId,accountId): undefined,
          eq(account.userId,auth.userId),
          gte(transactions.date,startDate),
          lte(transactions.date,endDate),
          lt(transactions.amount,0)
        )).groupBy(categories.name).orderBy(desc(sql`SUM(ABS(${transactions.amount}))`))


    
    const topCategories = category.slice(0,3);
    const otherCategories = category.slice(3);

    const otherSum = otherCategories.reduce((acc,curr)=>acc + curr.value,0);

    const finalCategory = topCategories;

    if(otherCategories.length>0){
      finalCategory.push({
        name:"Others",
        value:otherSum
      })
    }

    const activeDays = await db.select({
      date: transactions.date,
      income: sql`SUM(CASE WHEN ${transactions.amount}>=0 THEN ${transactions.amount} ELSE 0 END)`.mapWith(Number),
      expenses: sql`SUM(CASE WHEN ${transactions.amount}<0 THEN ABS(${transactions.amount}) ELSE 0 END)`.mapWith(Number),
    }).from(transactions).innerJoin(account,eq(transactions.accountId,account.id)).where(
      and(
        accountId? eq(transactions.accountId,accountId): undefined,
        eq(account.userId,auth.userId),
        gte(transactions.date,startDate),
        lte(transactions.date,endDate),
        
      )).groupBy(transactions.date).orderBy(transactions.date);

      const days  = fillMissingDays(
        activeDays,
        startDate,
        endDate
      )


    
    return c.json({
      data: {
      remainingAmount: currentPeriod.remaining,
      remainingChange,  
      incomeAount: currentPeriod.income,
      incomesChange,
      expensesAmount: currentPeriod.exepense,
      expensesChange,
      categories: finalCategory,
      days
      
      
      
    
      }
     
    })
});



export default app;