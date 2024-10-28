import { Upload } from "lucide-react";
import {useCSVReader} from "react-papaparse";

import { Button } from "@/components/ui/button";

type Props = {
  onUpload: (results: any) => void;
}

const UploadCSVFileButton = ({onUpload}:Props) => {
  const {CSVReader } = useCSVReader();
 // TODO: Add a PayRoll
  return ( 
    <CSVReader onUploadAccepted={onUpload}>
      
      {({getRootProps}:any)=>(
        <Button
        size="sm"
        className=" w-full lg:w-auto"
        {...getRootProps()}
        >
          
          <Upload className="mr-2 size-4"/>
          Import
        </Button>
      )}
    </CSVReader>
   );
}
 
export default UploadCSVFileButton;