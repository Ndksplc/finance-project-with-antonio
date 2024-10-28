import { IconType } from "react-icons/lib";
import { VariantProps, cva } from "class-variance-authority";
import { Card, CardContent, CardHeader, CardTitle,
  CardDescription
 } from "@/components/ui/card";

import { cn, formatCurrency } from "@/lib/utils"; 
import { Countup } from "./count-up";
import { formatPercent } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

const boxVariants = cva(
    "rounded-md p-2",
    { variants:{
        variants:{
          default: "bg-blue-500/20",
          success: "bg-emerald-500/20",
          danger: "bg-rose-500/20",
          warning: "bg-yellow-500/20",
        }

      },
      defaultVariants: {
        variants: "default",
    }
  }
  )

  const iconVariants = cva(
    "size-6",
    { variants:{
        variants:{
          default: "fill-blue-500",
          success: "fill-emerald-500",
          danger: "fill-rose-500",
          warning: "fill-yellow-500",
        }

      },
      defaultVariants: {
        variants: "default",
    }
  }
  )
 
  type BoxVariant = VariantProps<typeof boxVariants>;
  type IconVariant = VariantProps<typeof iconVariants>;

  interface DataCardProps extends BoxVariant, IconVariant{
    icon: IconType;
    title: string;
    value?: number;
    dateRange: string;
    percentageChange?: number;

  }
const DataCard = ({icon: Icon, title,value=0,
  variants,dateRange, percentageChange = 0
}:DataCardProps)=>{


  return ( <Card className="border-none drop-shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between gap-x-4">
      <div className="space-y-2">
        <CardTitle className="text-2xl line-clamp-1">{title}
        
        </CardTitle>
        <CardDescription>
        {dateRange}
        </CardDescription>
      </div>
      <div className={cn("shrink-0",boxVariants({variants}))}>
        <Icon className={cn(" ",iconVariants({variants}))}/>
      </div>
      

    </CardHeader>
    <CardContent>
      <h1 className="font-bold text-2xl mb-2 line-clamp-1 break-all">
        <Countup 
          preserveValue
          start={0}
          end={value}
          decimals={2}
          decimalPlaces={2}
          formattingFn={formatCurrency}
        />
        <p className={cn("text-muted-foreground text-sm line-clamp-1", percentageChange>0 &&"text-success", percentageChange<0 &&"text-destructive")}>
          {formatPercent(percentageChange,{addPrefix: true})} from last period
        </p>

      </h1>
    </CardContent>
  </Card> );
}
 
export default DataCard;

export const DataCardLoading = ()=>{
  return <Card className="border-none drop-shadow-sm h-[192px]">
    <CardHeader className="flex flex-row items-center justify-between gap-x-4">
      <div className="space-y-2">
        
        <Skeleton className="h-4 w-32 " />
        <Skeleton className="h-4 w-32 " />
      </div>
      <Skeleton className="size-12" />
      
    </CardHeader>
    <CardContent>
      <Skeleton className="shrink-0 h-10 w-24 mb-2 " />
      <Skeleton className="shrink-0 h-4 w-40" />
    </CardContent>

  </Card>

}