import { Card, 
  CardContent,
  CardHeader,
  CardTitle
 } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
import { useState } from "react";
import ImportTable from "./import-table";
import { convertAmountToMiliunits } from "@/lib/utils";
import { format, parse } from "date-fns";



const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy-MM-dd";

const requiredOptions = [
  "payee",
  "amount",
  "date",
  
  

]

interface SelectColumnState {
  [key: string]: string | null
}

type Props = {
  data: string[][];
  onCancel: ()=>void;
  onSubmit: (data:any)=>void;
}

const ImportCard = ({data, onCancel, onSubmit}:Props) => {

  const [selectColumns, setSelectColumns] = useState<SelectColumnState>({});
  

  const header = data[0];
  const body = data.slice(1);

  const progress = Object.values(selectColumns).filter(Boolean).length;

  const handleContinue = ()=>{
    
    const getColumIndex = (column:string)=>{
      return column.split("_")[1]
  }
  const mappedData = {
    header: header.map((_header, index)=>{
      const columnIndex = getColumIndex(`column_${index}`);
      return selectColumns[`column_${columnIndex}`] || null;
    }),

    body: body.map((row)=>{
      const transformedRow = row.map((cell, index)=>{
        const columnIndex = getColumIndex(`column_${index}`);
        return selectColumns[`column_${columnIndex}`] ? cell : null;
      });

      return transformedRow.every((item)=> item ===null )? null : transformedRow;}).filter((row)=>row!== null && row?.length >0),
      

  }
  const arrayOfData = mappedData.body.map((row)=>{
    return row?.reduce((acc:any, cell,index)=>{
      const header= mappedData.header[index];
      if(header !== null) acc[header] =cell;
      return acc;
      
    },{})
  });
  const formatedData = arrayOfData.map((item)=>(
    {
      ...item,
      amount: convertAmountToMiliunits(item.amount),
      date: format(parse(item.date,dateFormat,new Date()),outputFormat)
    }
  ));
  onSubmit(formatedData);
}

  const onTableHeadSelectChange = (columnIndex: number, value: string | null) => {
    setSelectColumns((prevState)=>{const newSelectColumns = {...prevState};
      for (const key in newSelectColumns){
        if(newSelectColumns[key] === value){
          newSelectColumns[key] = null;
        }
      }
      if(value==="Skip"){
        value = null;
      }

      newSelectColumns[`column_${columnIndex}`] = value;
      return newSelectColumns;}
      

    )}


  return (<div className="max-w-screen-2xl mx-auto w-full pb-10 -m-24">
    <Card className="border-none drop-shadow-sm">
    <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between" >
      <CardTitle className=" text-xl line-clamp-1">
        Import Transaction
      </CardTitle>
      <div className="flex flex-col lg:flex-row items-center gap-x-2 gap-y-2">

        <Button disabled={progress < requiredOptions.length} size="sm" onClick={handleContinue} className="w-full lg:w-auto">
          Continue ({progress}/{requiredOptions.length})
        </Button>
        <Button size="sm" onClick={onCancel} className="w-full lg:w-auto">
          Cancel
        </Button>
        
      </div>
      
    </CardHeader>     
     <CardContent>
     <ImportTable
     header={header}
     body={body}
     selectColumns={selectColumns}
     onTableHeadSelectChange ={onTableHeadSelectChange}/>

    </CardContent>
  </Card>

  </div> );
}
 
export default ImportCard;