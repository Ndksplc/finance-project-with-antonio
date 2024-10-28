import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useOpenTransaction } from "../hooks/use-open-transactions";
import { TransactionForm } from "./transaction-form";
import {insertTransactionSchema} from "@/db/schema-validator";
import {z} from "zod";
import { useGetTransaction } from "../api/use-get-transaction";
import { Loader2 } from "lucide-react";
import { useEditTransaction } from "../api/use-edit-transaction";
import { useDeleteTransaction } from "../api/use-delete-transaction";
import { useConfirm } from "@/hooks/use-confirm";
import { useGetAccounts } from "../../accounts/api/use-get-accounts";
import { useGetCategories } from "../../categories/api/use-get-categories";
import { useCreateAccount } from "../../accounts/api/use-create-account";
import { useCreateCategory } from "../../categories/api/use-create-category";
import { account } from "@/db/schema";


const formSchema = insertTransactionSchema.omit({id:true});

type FormValues = z.infer<typeof formSchema>


const EditTransactionSheet = () => {
  
  const {isOpen, onClose, id} = useOpenTransaction();
  const transactionQuery = useGetTransaction(id)
  const editMutation = useEditTransaction(id);
  const deleteMutation = useDeleteTransaction(id);
  const [ConfirmDialog, confirm] = useConfirm("Are you sur ?", "These transactions will be definitively deleted");

  const categoriesQuery = useGetCategories();
  const accountsQuery = useGetAccounts();
  const AccountMutation = useCreateAccount();
  const categorieMutation = useCreateCategory();

  const onCreateCategory = (name:string)=>categorieMutation.mutate({name},{onSuccess: ()=>{}});
  const onCreateAccount = (name:string)=>categorieMutation.mutate({name},{onSuccess: ()=>{}});

  const categoryOptions = (categoriesQuery.data ?? []).map((category)=>({
    label: category.name,
    value: category.id
  }));

  const AccountOptions = (accountsQuery.data ?? []).map((account)=>({
    label: account.name,
    value: account.id
  }));



  
  const isPending = editMutation.isPending || deleteMutation.isPending || transactionQuery.isLoading || categorieMutation.isPending || AccountMutation.isPending;

  const isLoading = transactionQuery.isLoading || categoriesQuery.isLoading || accountsQuery.isLoading;
  const onSubmit = (values:FormValues)=>{
    editMutation.mutate(values,{onSuccess:()=>{
      onClose();
    }});
  }

  const onDelete = async ()=>{
    const ok = await confirm();
    if(ok) deleteMutation.mutate(undefined,{onSuccess: ()=>{onClose()}});
  }
  
  const defaultValues = transactionQuery.data ? {
    accountId: transactionQuery.data.accountId,
    categoryId: transactionQuery.data.categoryId,
    amount: transactionQuery.data.amount.toString(),
    date: transactionQuery.data.date ? new Date(transactionQuery.data.date) : new Date(),
    payee: transactionQuery.data.payee,
    notes: transactionQuery.data.notes
  }:{
    accountId:"",
    account:"",
    category:"",
    amount:"",
    date: new Date(),
    payee:"",
    notes:""
  }
  return ( 
    <>
     <ConfirmDialog/>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit transactions
            </SheetTitle>
            <SheetDescription>
              Edit an existing transaction
            </SheetDescription>
          </SheetHeader>
          {isLoading ?(<div className="absolute inset-0
          flex items-center justify-center">
            <Loader2 className="animate-spin size-4 text-muted-foreground"/>
          </div>):(<TransactionForm 
          id={id}
          defaultValues={defaultValues}
          onSubmit={onSubmit} disabled={isPending}
          onDelete={onDelete} onCreateAccount={onCreateAccount} onCreateCategory={onCreateCategory} categoryOptions={categoryOptions}
        accountOptions={AccountOptions}/>)}
          
        </SheetContent>
      </Sheet>
    </>
    
   );
}
 
export default EditTransactionSheet;