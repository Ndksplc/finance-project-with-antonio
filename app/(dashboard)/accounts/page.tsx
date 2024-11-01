"use client"
import { Card,
  CardContent,
  CardTitle,
  CardHeader
 } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { useNewAccount } from "@/app/features/accounts/hooks/use-new-account";
import { columns } from "./columns";
import { DataTable } from "../components/data-table";
import { useGetAccounts } from "@/app/features/accounts/api/use-get-accounts";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteAccount } from "@/app/features/accounts/api/use-delete-bulk-account";
import { Suspense } from "react";
 


const AccountsPage = () => {
  const newAccount = useNewAccount();
  const accountQuery = useGetAccounts();
  const accounts = accountQuery.data || [];
  const deleteBulkAccount = useBulkDeleteAccount();
  const isDisabled = accountQuery.isLoading || deleteBulkAccount.isPending;

  if (accountQuery.isLoading) return (
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

  return (
    <Suspense fallback={<div>Loading...</div>}>

    
      <div className="max-w-screen-2xl mx-auto w-full pb-10 -m-24">
        <Card className="border-none drop-shadow-sm">
        <CardHeader className="gap-y-2 lg:flex-row lg:items-center lg:justify-between" >
          <CardTitle className=" text-xl line-clamp-1">
            Account Page
          </CardTitle>
          <Button size="sm" onClick={newAccount.onOpen}>
            <Plus className="size-4 mr-2"/>
            Add New Account 
          </Button>
        </CardHeader>     
        <CardContent>
          <DataTable columns={columns}
          data={accounts}
          filterKey="name" onDelete={(row)=>{
            const ids = row.map((r)=>(r.original.id));
            deleteBulkAccount.mutate({ids});
          }}
          disabled={isDisabled}
          />
        </CardContent>
      </Card>

      </div>
    </Suspense>  
  )
}
 
export default AccountsPage