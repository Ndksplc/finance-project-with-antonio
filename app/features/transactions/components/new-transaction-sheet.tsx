import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useNewTransaction } from "../hooks/use-new-transaction";
import {insertTransactionSchema} from "@/db/schema-validator";
import {z} from "zod";
import { useCreateTransaction } from "../api/use-create-transaction";
import { useGetCategories } from "../../categories/api/use-get-categories";
import { useCreateCategory } from "../../categories/api/use-create-category";
import { useGetAccounts } from "../../accounts/api/use-get-accounts";
import { useCreateAccount } from "../../accounts/api/use-create-account";
import { TransactionForm } from "./transaction-form";
import { Loader2 } from "lucide-react";

const formSchema = insertTransactionSchema.omit({id:true});

type FormValues = z.infer<typeof formSchema>


const NewTransactionSheet = () => {
  const {isOpen, onClose} = useNewTransaction();
  const createMutation = useCreateTransaction();
  const AccountMutation = useCreateAccount();
  const categorieMutation = useCreateCategory();
  
  const onCreateCategory = (name:string)=>categorieMutation.mutate({name},{onSuccess: ()=>{}});
  const onCreateAccount = (name:string)=>categorieMutation.mutate({name},{onSuccess: ()=>{}});


  const categoriesQuery = useGetCategories();
  const accountsQuery = useGetAccounts();

  const categoryOptions = (categoriesQuery.data ?? []).map((category)=>({
    label: category.name,
    value: category.id
  }));

  const AccountOptions = (accountsQuery.data ?? []).map((account)=>({
    label: account.name,
    value: account.id
  }));

  const isPending = createMutation.isPending || categorieMutation.isPending || AccountMutation.isPending;

  const isLoading = categoriesQuery.isLoading || accountsQuery.isLoading;
  
  const onSubmit = (values:FormValues)=>{
    createMutation.mutate(values,{onSuccess:()=>{
      onClose();
    }});
  }
  return ( 
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="space-y-4">
        <SheetHeader>
          <SheetTitle>
            New Transaction
          </SheetTitle>
          <SheetDescription>
            Create a new Transaction
          </SheetDescription>
        </SheetHeader>
        {
          isLoading ?<div className="absolute inset-0
          flex items-center justify-center">
            <Loader2 className="animate-spin size-4 text-muted-foreground"/>
            </div>
            :<TransactionForm onSubmit={onSubmit} disabled={isPending} onCreateAccount={onCreateAccount} onCreateCategory={onCreateCategory} categoryOptions={categoryOptions}
        accountOptions={AccountOptions}/>
        }
        
      </SheetContent>
    </Sheet>
   );
}
 
export default NewTransactionSheet;