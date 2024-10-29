import { useGetSummary } from "@/app/features/summary/api/use-get-summary";
import Charts, { ChartsLoading } from "./charts";
import SpendingPie, { SpendingPieLoading } from "./spending-pie";
import useMounted from "@/components/useIsMounted";



const DataCharts = ()=>{
  const isMounted = useMounted()
  const {data, isLoading} = useGetSummary();
  console.log(isMounted);
  
  
  if(isLoading) return(
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3
      xl:col-span-4" >
        <ChartsLoading/>
        
      </div>
      <div className="col-span-1 lg:col-span-3
      xl:col-span-2">
        <SpendingPieLoading/>
      </div>
    </div> )
  
  return ( <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
    <div className="col-span-1 lg:col-span-3
    xl:col-span-4">
      {isMounted && <Charts data={data?.days}/>}
      
    </div>
    <div className="col-span-1 lg:col-span-3
    xl:col-span-2">
      {isMounted && <SpendingPie data={data?.categories}/>}
    </div>
  </div> );
}
 
export default DataCharts;