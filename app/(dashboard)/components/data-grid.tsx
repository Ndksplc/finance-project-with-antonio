"use client";
import { useSearchParams } from "next/navigation";
import { formatDateRange } from "@/lib/utils";
import { useGetSummary } from "@/app/features/summary/api/use-get-summary";
import {FaPiggyBank} from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";
import { DataCardLoading } from "./data-card";


import DataCard from "./data-card";
const DataGrid = ()=>{
  const summaryQuery = useGetSummary();
  const { data } = summaryQuery;
  const params = useSearchParams();
  const to = params.get("to") || undefined;
  const from = params.get("from") || undefined;
  const dateRangeLabel = formatDateRange({from,to}) || "Date non spécifié";

  
  if(summaryQuery.isLoading)
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3
      gap-8 pb-2 mb-8">
        <DataCardLoading />
        <DataCardLoading />
        <DataCardLoading />
     </div>
      
    )
  
  return (
    
    <div className="grid grid-cols-1 lg:grid-cols-3
    gap-8 pb-2 mb-8">
      <DataCard 
      title="Remaining" 
      value = {data?.remainingAmount}
      percentageChange={data?.remainingChange}
      icon={FaPiggyBank}
      variants = "default"
      dateRange={dateRangeLabel}/>
      <DataCard 
      title="Income" 
      value = {data?.incomeAount}
      percentageChange={data?.incomesChange}
      icon={FaArrowTrendUp}
      variants = "default"
      dateRange={dateRangeLabel}/>
      <DataCard 
      title="Expenses" 
      value = {data?.expensesAmount}
      percentageChange={data?.expensesChange}
      icon={FaArrowTrendDown}
      variants = "default"
      dateRange={dateRangeLabel}/>
    </div>
    )
}
 
export default DataGrid;