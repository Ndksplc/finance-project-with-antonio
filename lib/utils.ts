import { type ClassValue, clsx } from "clsx"
import { eachDayOfInterval, isSameDay, subDays, format } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertAmountToMiliunits(amount: number){
  return Math.round(amount*1000);
}

export function convertAmountFromMiliunits(amount: number){
  return amount/1000;
}

export function formatCurrency(amount: number){
  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
}

export function calculatePercentage(current: number, previous: number){
  

  if (previous === 0 || previous===null) {
    // Si current et previous sont tous deux 0, le changement est 0%
    if (current === 0) {
      return 0;
    }
    // Si previous est 0 mais current est différent de 0, le changement est de 100%
    return 100;
  }

  // Si previous n'est pas 0, on peut effectuer le calcul normalement
  return ((current - previous) / previous) * 100;
}

export function fillMissingDays(
  activeDays: {
    date: Date,
  income: number,
   expenses: number,
   }[],
  startDate: Date,
  endDate: Date
  ){
    if(activeDays.length===0){
      return [];
    }

    const allDays = eachDayOfInterval({
      start: startDate,
      end: endDate
    });

    const transactionsByDay = allDays.map((day)=>{
      const found = activeDays.find((d)=>
      isSameDay(d.date, day));
      if(found){
        return found;
      }else{
        return {
          date: day,
          income: 0,
          expenses: 0
        }
      }
    })
  return transactionsByDay;

}

type Period = {
  from: string| Date | undefined;
  to: string| Date | undefined;
}
export function formatDateRange(period?: Period){

  const defaultTo = new Date();
  const defaultFrom = subDays(defaultTo,30);

  if(!period?.from){
    return `${format(defaultFrom,"LLL dd")} - ${format(defaultTo,"LLL dd, y")}`;
  }

  if(period.to instanceof Date && period.from instanceof Date) return `${format(period.from,"LLL dd")} - ${format(period.to,"LLL dd, y")}`;

  if(period.from instanceof Date)
  return format(period.from,"LLL dd");

  return undefined
}

export function formatPercent(value: number,
  options:{
    addPrefix?: boolean
  }={addPrefix: false}){

    const result = Intl.NumberFormat('en-US', {
      style: 'percent',
    }).format(value/100);

    if(options.addPrefix && value>0){
      return `+${result}`;
    }
    return result;

}
