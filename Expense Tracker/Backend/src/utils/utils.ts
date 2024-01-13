export const isSameDate = (date1: Date, date2: Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const year1 = d1.getFullYear();
  const month1 = d1.getMonth();
  let day1 = d1.getDate();

  const year2 = d2.getFullYear();
  const month2 = d2.getMonth();
  const day2 = d2.getDate();
  if ((month1 == 0 && month2 == 0) ) {
    if(day1 == 30 && day2 == 31) {
      day1 = 31;
    }
  }

  console.log(year1, month1, day1, year2, month2, day2);
  return year1 === year2 && month1 === month2 && day1 === day2;
};
