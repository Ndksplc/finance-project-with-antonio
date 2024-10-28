"use client";

import { DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
 } from "@radix-ui/react-dropdown-menu";
import {  Edit, MoreHorizontal, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useOpenCatgory } from "@/app/features/categories/hooks/use-open-category";
import { useDeleteCategory } from "@/app/features/categories/api/use-delete-category";
import { useConfirm } from "@/hooks/use-confirm";

type Props = {
  id: string
}
export const Actions = ({id}:Props) => {
  const [ConfirmDialog, confirm] = useConfirm("Are you sur ?", "This category will be definitively deleted");
  const deleteMutation = useDeleteCategory(id);
  const {onOpen} = useOpenCatgory();

  const handleDelete = async () =>{
    const ok = await confirm();
    if(ok)deleteMutation.mutate()

  }
  return (  
    <>
    <ConfirmDialog/>
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="size-8 p-0">
          <MoreHorizontal/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-16 flex flex-col items-start gap-1 bg-slate-50/60"  >
        <DropdownMenuItem
          disabled={deleteMutation.isPending} onClick={()=>onOpen(id)} className="flex justify-center items-center h-7 cursor-pointer">
          <Edit className="size-4 mr-1"/>
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={deleteMutation.isPending} onClick={handleDelete} className="flex justify-center items-center h-7 cursor-pointer">
          <Trash className="size-4 mr-1" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
    </>
    );
}
 
export default Actions