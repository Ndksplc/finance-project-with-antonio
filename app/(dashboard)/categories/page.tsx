"use client"
import { Card,
  CardContent,
  CardTitle,
  CardHeader
 } from "@/components/ui/card";
 import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { columns } from "./columns";
import { DataTable } from "../components/data-table";
import { useGetCategories } from "@/app/features/categories/api/use-get-categories";
import { Skeleton } from "@/components/ui/skeleton";
import { useBulkDeleteCategories } from "@/app/features/categories/api/use-delete-bulk-categories";
import { useNewCategory } from "@/app/features/categories/hooks/use-new-category";
import { Suspense } from "react";
 


const CategoriesPage = () => {
  const newCategory = useNewCategory();
  const categoriesQuery = useGetCategories();
  const categories = categoriesQuery.data || [];
  const deleteBulkAccount = useBulkDeleteCategories();
  const isDisabled = categoriesQuery.isLoading || deleteBulkAccount.isPending;

  if (categoriesQuery.isLoading) return (
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
            Categories Page
          </CardTitle>
          <Button size="sm" onClick={newCategory.onOpen}>
            <Plus className="size-4 mr-2"/>
            Add New Category 
          </Button>
          </CardHeader>     
          <CardContent>
            <DataTable columns={columns}
          data={categories}
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
 
export default CategoriesPage