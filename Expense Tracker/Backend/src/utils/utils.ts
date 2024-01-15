// Check if two different dates are same or not by(YYYY-MM-DD) format
export const isSameDate = (date1: Date, date2: Date) => {
  const d1 = new Date(date1);
  const d2 = new Date(date2);

  const year1 = d1.getFullYear();
  const month1 = d1.getMonth();
  let day1 = d1.getDate();

  const year2 = d2.getFullYear();
  const month2 = d2.getMonth();
  const day2 = d2.getDate();
  // Only for this use case
  // the last day of january is set to 30(for some reason)
  // so to validate the date the date is corrected
  if (month1 == 0 && month2 == 0) {
    if (day1 == 30 && day2 == 31) {
      day1 = 31;
    }
  }
  // Return true if both dates are the same
  return year1 === year2 && month1 === month2 && day1 === day2;
};
