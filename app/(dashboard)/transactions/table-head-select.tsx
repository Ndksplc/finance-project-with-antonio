import { Select,
  SelectContent,
  SelectItem,
  SelectValue,
  SelectTrigger
 } from "@/components/ui/select";
 import { cn } from "@/lib/utils";

type Props = {
  columnIndex: number;
  selectColumns: Record<string, string | null>;
  onChange: (columnIndex: number, value: string | null) => void;
}

const options = [
  "payee",
  "amount",
  "date",
  
]


export const TableHeadSelect = ({columnIndex, selectColumns, onChange}:Props) => {
  const currentSelection = selectColumns[`column_${columnIndex}`];

  return ( 
    <Select value={currentSelection || ""} onValueChange={(value)=>onChange(columnIndex,value)}>
      <SelectTrigger className={cn("focus:ring-offset-0 focus:ring-transparent outline-none border-none bg-transparent capitalize",currentSelection && "text-blue-500")}>
        <SelectValue placeholder="skip"/>

      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Skip" >
          Skip
        </SelectItem>
        {options.map((option, index)=>{
          const disabled = Object.values(selectColumns).includes(option) && selectColumns[`column_${index}`] !== option;
          return (
          <SelectItem key={index} 
          value={option}
          disabled = {disabled}
          className="capitalize"
          >
            {option}

          </SelectItem>
        )})}

        
      </SelectContent>
      
    </Select>
  )
}