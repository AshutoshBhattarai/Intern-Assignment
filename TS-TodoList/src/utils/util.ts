import { ALPHABETS_SET, ID_LENGTH, NUMBER_SET } from "./constants";

export function getRandomString(): string {
  const charSet = ALPHABETS_SET + NUMBER_SET;
  let randomString = "";
  for (let i = 0; i < ID_LENGTH; i++) {
    randomString += charSet.charAt(
      Math.floor(1 + Math.random() * charSet.length)
    );
  }
  return randomString;
}

export function getNewDate(noOfDate: number): Date {
  const currentDate: Date = new Date();
  const nextDate: number = noOfDate * 1000 * 60 * 60 * 24;
  return new Date(currentDate.getTime() + nextDate);
}
