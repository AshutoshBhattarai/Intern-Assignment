import Category from "./Category";

interface Budget {
  id?: string;
  title: string;
  amount: number;
  startTime: Date;
  endTime: Date;
  category?: Category;
  remainingAmount?: number;
  spentAmount?: number;

}
export default Budget;
