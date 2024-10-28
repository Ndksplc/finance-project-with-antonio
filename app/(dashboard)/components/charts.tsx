import { Card, CardContent, CardHeader, CardTitle
 } from "@/components/ui/card";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AreaChart, BarChart, FileSearch, LineChart } from "lucide-react";
import AreaVariant from "./areaVariant";
import { LineVariant } from "./line-variant";
import { BarVariant } from "./bar-variant";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

type Props = {
  data?:{
    date: string;
    income: number;
    expenses: number;
  }[]
}

const Charts = ({data=[]}:Props) => {
  const [chartType, setChartType] = useState("area");
  const onTypeChange = (type:string)=>{
    // TODO: Add a payroll
    setChartType(type);
  }


  return ( 
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 items-center lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">
          Transactions
        </CardTitle>
       <Select 
       defaultValue={chartType}
       onValueChange={onTypeChange}>
        <SelectTrigger className="
        lg:w-auto h-9 rounded-md px-3">
          <SelectValue placeholder="Chart type"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="area">
            <div className="flex items-center">
              <AreaChart className="size-4 mr-2
              shrink-0"/>
              <p className="line-clamp-1">
                Area Chart 
              </p>

            </div>
          </SelectItem>
          <SelectItem value="line">
            <div className="flex items-center">
              <LineChart className="size-4 mr-2
              shrink-0"/>
              <p className="line-clamp-1">
                Line Chart 
              </p>

            </div>
          </SelectItem>
          <SelectItem value="bar">
            <div className="flex items-center">
              <BarChart className="size-4 mr-2
              shrink-0"/>
              <p className="line-clamp-1">
                Bar Chart 
              </p>

            </div>
          </SelectItem>
        </SelectContent>
       </Select>
      </CardHeader>
      <CardContent>
        { data.length ===0 ? (<div
        className="flex flex-col items-center justify-center gap-y-4 h-[350px] w-full">
          <FileSearch className="size-6 text-muted-foreground" />
          <p className="text-muted-foreground text-sm">
            No data for this period
          </p>

        </div>):(
          <>
          {chartType === "area" && <AreaVariant data={data}/>}
          {chartType === "line" && <LineVariant data={data}/>}
          {chartType === "bar" && <BarVariant data={data}/>}
          </>
          )
        }</CardContent>
    </Card>
   );
}
 
export default Charts;

export const ChartsLoading = ()=>{
  return (<Card className="border-none drop-shadow-sm ">
    <CardHeader className="flex space-y-2
    lg:space-y-0 lg:items-center lg:flex-row items-center justify-between gap-x-4">
      
        
        <Skeleton className="h-8 w-48 " />
        <Skeleton className="h-8 lg:w-[120px] w-full" />
      
    </CardHeader>
    <CardContent>
     <div className="flex items-center justify-center h-[350px] w-full">
      <Loader2 className="size-6 text-slate-300
      animate-spin" />
      
     </div>
      
    </CardContent>

  </Card>)

}