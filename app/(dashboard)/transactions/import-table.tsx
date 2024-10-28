import { Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
 } from "@/components/ui/table";
 import { TableHeadSelect } from "./table-head-select";

 type Props = {
  header: string[];
  body: string[][];
  selectColumns: Record<string, string | null>;
  onTableHeadSelectChange: (columnIndex: number, value: string | null) => void;
 }

const ImportTable = ({header, body, selectColumns, onTableHeadSelectChange}:Props) => {
  return ( <div className="rounded-md border overflow-hidden">
    <Table>
      <TableHeader>
        <TableRow>
          {header.map((_item, index)=>(
            <TableHead key={index}>
              <TableHeadSelect
              columnIndex = {index}
              selectColumns={selectColumns}
              onChange = {onTableHeadSelectChange}/>
            </TableHead>

          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {body.map((row:string[], index)=>(
          <TableRow key={index}>
            {row.map((cell,index)=>(
              <TableCell key={index}>
                {cell}
              </TableCell>

            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>

  </div> );
}
 
export default ImportTable;