import { useOpenCatgory } from "@/app/features/categories/hooks/use-open-category";
import { TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { useOpenTransaction } from "@/app/features/transactions/hooks/use-open-transactions";

type Props = {
  
  id: string;
  category: string | null;
  categoryId: string | null;
}

const CategoryColumn = ({ id, category, categoryId}: Props) => {
  
  const {onOpen: onOpenCategory} = useOpenCatgory();
  const {onOpen: onOpenTransaction} = useOpenTransaction();

  const onClick = () => {
    if(categoryId) onOpenCategory(categoryId);
    else onOpenTransaction(id);
  }
  return (
    <>
      <div onClick={onClick} className={cn("flex items-center cursor-pointer hover:underline",!category && "text-rose-500")}>

    {!category && <TriangleAlert className="size-4 mr-2 shrink-0"/>}
    {category || "no category"} 
  </div>
    </>
    
     );
}
 
export default CategoryColumn;