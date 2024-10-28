import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle
} from "@/components/ui/sheet";
import { useOpenCatgory } from "../hooks/use-open-category";
import { CategoryForm } from "./category-form";
import { inserCategorySchema} from "@/db/schema-validator";
import {z} from "zod";
import { useGetCategory } from "../api/use-get-category";
import { Loader2 } from "lucide-react";
import { useEditCategory } from "../api/use-edit-category";
import { useDeleteCategory } from "../api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";
import { on } from "events";
const formSchema = inserCategorySchema.pick({name:true});

type FormValues = z.infer<typeof formSchema>


const EditCategorySheet = () => {
  
  const {isOpen, onClose, id} = useOpenCatgory();
  const categoryQuery = useGetCategory(id);
  const editMutation = useEditCategory(id);
  const deleteMutation = useDeleteCategory(id);
  const [ConfirmDialog, confirm] = useConfirm("Are you sur ?", "These categories will be definitively deleted");
  
  const isPending = editMutation.isPending || deleteMutation.isPending;
  const isLoading = categoryQuery.isLoading;
  const onSubmit = (values:FormValues)=>{
    editMutation.mutate(values,{onSuccess:()=>{
      onClose();
    }});
  }

  const onDelete = async ()=>{
    const ok = await confirm();
    if(ok) deleteMutation.mutate(undefined,{onSuccess: ()=>{onClose()}});
  }
  
  const defaultValues = categoryQuery.data?{name:categoryQuery.data.name}:{name:""}
  return ( 
    <>
     <ConfirmDialog/>
      <Sheet open={isOpen} onOpenChange={onClose}>
        <SheetContent className="space-y-4">
          <SheetHeader>
            <SheetTitle>
              Edit Category
            </SheetTitle>
            <SheetDescription>
              Edit an existing category
            </SheetDescription>
          </SheetHeader>
          {isLoading ?(<div className="absolute inset-0
          flex items-center justify-center">
            <Loader2 className="animate-spin size-4 text-muted-foreground"/>
          </div>):(<CategoryForm id={id} onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues} onDelete={onDelete}/>)}
          
        </SheetContent>
      </Sheet>
    </>
    
   );
}
 
export default EditCategorySheet;