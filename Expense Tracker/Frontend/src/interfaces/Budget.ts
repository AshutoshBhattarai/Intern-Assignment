interface Budget {
  id: string;
  title: string;
  amount: number;
  startTime: Date;
  endTime: Date;
  remainingAmount: number;
  spentAmount: number;
}
export default Budget;
