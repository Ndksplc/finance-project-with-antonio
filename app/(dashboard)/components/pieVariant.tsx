import {Cell,
  PieChart,
  Pie,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { formatPercent } from "@/lib/utils";
import exp from "constants";
import { CategorieTooltip } from "./categorieTooltip";
import { useEffect, useState } from "react";
import { is } from "drizzle-orm";

const COLORS = ["#000000","#12C6FF", "#FF7A00", "#FF647F","#FF9354F"];

type Props = {
  data?:{
    name: string;
    value: number
  }[]
}
export const PieVariant = ({data}:Props) => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  return (
    <>
   {isMounted && 
    <ResponsiveContainer width="100%"  height={350}>
      <PieChart >
        <Legend
        layout="horizontal"
        verticalAlign="bottom"
        align="right"
        iconType="circle"
        content={({payload}:any)=>
        {
          
          return (
            <ul className="flex flex-col space-y-2">
              {payload.map((entry:any, index:number)=>{
                
                return(
                <li key={`item-${index}`} className="flex items-center space-x-2">
                  <span className=" rounded-full size-2" style={{backgroundColor: entry.color }}/>

                  <div className="space-x-1">
                    <span className="text-sm text-muted-foreground">
                      {entry.value}
                    </span>
                    <span className="text-sm ">
                      {formatPercent(entry.payload.percent*100)}
                    </span>

                  </div>

                </li>
              )}
              
              )}

            </ul>
          )
        }}/>
        <Tooltip content={<CategorieTooltip />}/>
        <Pie data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          innerRadius={60}
          paddingAngle={2}
          fill="#8884d8"
          dataKey="value"
          labelLine={false}>
            {data?.map((_entry, index)=>(
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
            ))}

        </Pie>
        
      </PieChart>
      
    </ResponsiveContainer>}
    </>
  )
}

