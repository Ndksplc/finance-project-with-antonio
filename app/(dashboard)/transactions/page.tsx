"use client"

 
import { Loader2, Plus } from "lucide-react";
import { Card,
  CardContent,
  CardTitle,
  CardHeader
 } from "@/components/ui/card";
import { columns } from "./columns";
import { DataTable } from "../components/data-table";
import { Button } from "@/components/ui/button";
import { useNewTransaction } from "@/app/features/transactions/hooks/use-new-transaction";
import { useGetTransactions } from "@/app/features/transactions/api/use-get-transactions";
import { Skeleton } from "@/components/ui/skeleton";

import { useBulkDeleteTransactions } from "@/app/features/transactions/api/use-delete-bulk-transactions";
import { useBulkCreateTransactions } from "@/app/features/transactions/api/use-create-bulk-transactions";
import { Suspense, useState } from "react";
import UploadCSVFileButton from "./upload-button";
import ImportCard from "./import-card";
import { transactions as transactionsSchema } from "@/db/schema";
import { useSelectAccount } from "@/app/features/accounts/hooks/use-select-account";
import { toast } from "sonner";

enum VARIANT {
  LIST = "LIST",
  IMPORT = "IMPORT",
}

const INITIAL_IMPORT_RESULT = {
  data : [],
  error: [],
  meta: {}
}
 


const TransactionsPage = () => {
  const [variant, setVariant] = useState<VARIANT>(VARIANT.LIST);
  const [importResult, setImportResult] = useState(INITIAL_IMPORT_RESULT);
  const newTransaction = useNewTransaction();
  const bulkCreateTransaction = useBulkCreateTransactions();
  const transactionQuery = useGetTransactions();
  const transactions = transactionQuery.data || [];
  const deleteBulkTransaction = useBulkDeleteTransactions();
  const isDisabled = transactionQuery.isLoading || deleteBulkTransaction.isPending;
  const [AccountSelectionDialog, confirm] = useSelectAccount();


  const onUpload= (results:typeof INITIAL_IMPORT_RESULT)=>{
    setImportResult(results);
    setVariant(VARIANT.IMPORT)
  }

  const onCancelImport= ()=>{
    setImportResult(INITIAL_IMPORT_RESULT);
    setVariant(VARIANT.LIST)
  }

  const onSubmitImport = async (values: typeof transactionsSchema.$inferInsert[]) =>{
    const accountId = await confirm();
    if(!accountId) {
      return toast.error("Please select an account to continue");
    }

    const data = values.map((value)=>({
      ...value,
      accountId: accountId as string
  })
  );

  bulkCreateTransaction.mutate(data,{onSuccess:()=>{onCancelImport()}});
}


  if (transactionQuery.isLoading) return (
    <div className="max-w-screen-2xl mx-auto w-full pb-10 -m-24">
      <Card className="border-none drop-shadow-sm">
        <CardHeader >
          <Skeleton className="h-8 w-8"/>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] w-full  flex items-center justify-center">
            <Loader2 className="size-6 text-slate-300 animate-spin"/>
          </div>
          

          
        </CardContent>
      </Card>
    </div>
  )
  if(variant === VARIANT.IMPORT){
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <>
          <AccountSelectionDialog/>
          <ImportCard data={importResult.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}/>
        </>
      </Suspense>
    )
  }
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -m-24">
        <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between" >
          <CardTitle className=" text-xl line-clamp-1">
            Transaction History
          </CardTitle>
          <div className="flex flex-col lg:flex-row items-center gap-x-2 gap-y-2">
            <Button size="sm" className="w-full lg:w-auto" asChild>
              <UploadCSVFileButton onUpload={onUpload}/>
            </Button>
            <Button size="sm" onClick={newTransaction.onOpen} className="w-full lg:w-auto">
              <Plus className="size-4 mr-2"/>
              Add New Transaction 
            </Button>
          </div>
          
        </CardHeader>     
        <CardContent>
          <DataTable columns={columns}
          data={transactions}
          filterKey="date" onDelete={(row)=>{
            const ids = row.map((r)=>(r.original.id));
            deleteBulkTransaction.mutate({ids});
          }}
          disabled={isDisabled}
          />
        </CardContent>
      </Card>

      </div>
    </Suspense>
  )
}
 
export default TransactionsPage