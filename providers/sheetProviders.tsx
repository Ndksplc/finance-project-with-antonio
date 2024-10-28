"use client";

import NewAccountSheet from "@/app/features/accounts/components/new-account-sheet";
import EditAccountSheet from "@/app/features/accounts/components/edit-account";
import { useMountedState } from "react-use";
import NewCategorySheet from "@/app/features/categories/components/new-category-sheet";
import EditCategorySheet from "@/app/features/categories/components/edit-category";
import NewTransactionSheet from "@/app/features/transactions/components/new-transaction-sheet";
import EditTransactionSheet from "@/app/features/transactions/components/edit-transactions";

const  SheetProviders = () => {
  const isMounted = useMountedState();

  if(!isMounted) return null;
  return ( 
    <>
    <NewAccountSheet/>
    <EditAccountSheet/>
    <NewCategorySheet/>
    <EditCategorySheet/>
    <NewTransactionSheet/>
    <EditTransactionSheet/>

    </>
   );
}
 
export default  SheetProviders;