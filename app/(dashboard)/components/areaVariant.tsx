import { format } from "date-fns";

import {Tooltip,
  XAxis,
  AreaChart,
  Area,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

import { CustomTooltip } from "./customTooltip";
import { useEffect, useState } from "react";


type Props = {
  data:{
    date: string;
    income: number;
    expenses: number;
  }[]
}

const AreaVariant = ({data}:Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  return ( 
   
    <ResponsiveContainer width="100%" height={350}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3"/>
        <defs>
          <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#3d82f6" stopOpacity={0.8}/>
            <stop offset="98%" stopColor="#3d82f6" stopOpacity={0}/>
          </linearGradient>
          <linearGradient id="expenses" x1="0" y1="0" x2="0" y2="1">
            <stop offset="2%" stopColor="#f43f5e" stopOpacity={0.8}/>
            <stop offset="98%" stopColor="#f43f5e" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <XAxis 
          axisLine={false}
          tickLine={false}
          dataKey="date"
          tickFormatter={(value)=>format(new Date(value),"dd MMM")}
          style={{fontSize: "12px"}}
          tickMargin={16}
        />
        <Area
        type="monotone"
        dataKey="income"
        stackId="income"
        strokeWidth={2}
        stroke="#3d82f6"
        fill="url(#income)"
        className="drop-shadow-sm"
        style={{ fill: "url(#income) !important" }}/>
        {<Tooltip content={<CustomTooltip />}/>}
         <Area
        type="monotone"
        dataKey="expenses"
        stackId="expenses"
        strokeWidth={2}
        stroke="#f43f5e"
        fill="url(#expenses)"
        className="drop-shadow-sm"
        style={{ fill: "url(#expenses) !important" }}/>
        

     
      
      </AreaChart>
    </ResponsiveContainer> 
  
   )
}
 
export default AreaVariant;