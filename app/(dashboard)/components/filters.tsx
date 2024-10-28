import {AccountFilter} from "./accountFilter";
import {DateFilter} from "./dateFilter";

export const Filters = () => {
  return (
    <div className="flex flex-col gap-y-2  lg:gap-x-2 lg:flex-row items-center">

      <AccountFilter/>
      <DateFilter/>
    </div>
  )
}