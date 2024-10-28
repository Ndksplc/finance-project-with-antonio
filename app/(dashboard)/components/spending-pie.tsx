import { Card, CardContent, CardHeader, CardTitle
 } from "@/components/ui/card";
 import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileSearch, PieChart, Radar, Target } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";
import { RadialVariant } from "./radialVariant";
import { useState } from "react";
import { PieVariant } from "./pieVariant";
import { RadarVariant } from "./radar";


type Props = {
  data?:{
    name: string;
    value: number
  }[]
}

const SpendingPie = ({data=[]}:Props) => {
  const [chartType, setChartType] = useState("pie");
  const onTypeChange = (type:string)=>{
    // TODO: Add a payroll
    setChartType(type);
  }
  


  return ( 
    <Card className="border-none drop-shadow-sm">
      <CardHeader className="flex space-y-2 items-center lg:space-y-0 lg:flex-row lg:items-center justify-between">
        <CardTitle className="text-xl line-clamp-1">
          Categories
        </CardTitle>
       <Select 
       defaultValue={chartType}
       onValueChange={onTypeChange}>
        <SelectTrigger className="
        lg:w-auto h-9 rounded-md px-3">
          <SelectValue placeholder="Chart type"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="pie">
            <div className="flex items-center">
              <PieChart className="size-4 mr-2
              shrink-0"/>
              <p className="line-clamp-1">
                Pie Chart 
              </p>

            </div>
          </SelectItem>
          <SelectItem value="radar">
            <div className="flex items-center">
              <Radar className="size-4 mr-2
              shrink-0"/>
              <p className="line-clamp-1">
                Radar chart 
              </p>

            </div>
          </SelectItem>
          <SelectItem value="radial">
            <div className="flex items-center">
              <Target className="size-4 mr-2
              shrink-0"/>
              <p className="line-clamp-1">
                Radial Chart 
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
          {chartType === "pie" && <PieVariant data={data}/>}
          {chartType === "radar" && <RadarVariant data={data}/>}
          {chartType === "radial" && <RadialVariant data={data}/>}
          </>
          )
        }</CardContent>
    </Card>
   );
}

export default SpendingPie;

export const SpendingPieLoading = ()=>{
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