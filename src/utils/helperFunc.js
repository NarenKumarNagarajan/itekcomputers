import {
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    startOfWeek,
    endOfWeek,
    subMonths,
    subYears,
    subDays,
    format,
  } from "date-fns";

/* ================= Date Range =============== */

export const getDateRange = (range) => {
    const currentYear = new Date().getFullYear();
  
    let inDateFrom, inDateTo;
  
    switch (range) {
      case "This Financial Year":
        inDateFrom = format(new Date(currentYear, 3, 1), "dd/MM/yyyy"); // April 1st of current year
        inDateTo = format(new Date(currentYear + 1, 2, 31), "dd/MM/yyyy"); // March 31st of next year
        break;
  
      case "Last Financial Year":
        inDateFrom = format(new Date(currentYear - 1, 3, 1), "dd/MM/yyyy"); // April 1st of last year
        inDateTo = format(new Date(currentYear, 2, 31), "dd/MM/yyyy"); // March 31st of current year
        break;
  
      case "This Year":
        inDateFrom = format(startOfYear(new Date()), "dd/MM/yyyy");
        inDateTo = format(endOfYear(new Date()), "dd/MM/yyyy");
        break;
  
      case "Last Year":
        inDateFrom = format(startOfYear(subYears(new Date(), 1)), "dd/MM/yyyy");
        inDateTo = format(endOfYear(subYears(new Date(), 1)), "dd/MM/yyyy");
        break;
  
      case "This Month":
        inDateFrom = format(startOfMonth(new Date()), "dd/MM/yyyy");
        inDateTo = format(endOfMonth(new Date()), "dd/MM/yyyy");
        break;
  
      case "Last Month":
        inDateFrom = format(startOfMonth(subMonths(new Date(), 1)), "dd/MM/yyyy");
        inDateTo = format(endOfMonth(subMonths(new Date(), 1)), "dd/MM/yyyy");
        break;
  
      case "Today":
        inDateFrom = format(new Date(), "dd/MM/yyyy");
        inDateTo = format(new Date(), "dd/MM/yyyy");
        break;
  
      case "Yesterday":
        inDateFrom = format(subDays(new Date(), 1), "dd/MM/yyyy");
        inDateTo = format(subDays(new Date(), 1), "dd/MM/yyyy");
        break;
  
      case "This Week":
        inDateFrom = format(
          startOfWeek(new Date(), { weekStartsOn: 1 }),
          "dd/MM/yyyy",
        );
        inDateTo = format(
          endOfWeek(new Date(), { weekStartsOn: 1 }),
          "dd/MM/yyyy",
        );
        break;
  
      case "Last Week":
        inDateFrom = format(
          startOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }),
          "dd/MM/yyyy",
        );
        inDateTo = format(
          endOfWeek(subDays(new Date(), 7), { weekStartsOn: 1 }),
          "dd/MM/yyyy",
        );
        break;
  
      default:
        break;
    }
  
    return { inDateFrom, inDateTo };
  };
  
  /* ================= Amount to Words =============== */
  
  export const numberToWords = (num) => {
    if (num === 0) return "Zero";
  
    const belowTwenty = [
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
  
    const tens = [
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
  
    const aboveThousand = ["", "Thousand", "Million", "Billion"];
  
    const getBelowThousand = (n) => {
      let str = "";
  
      if (n >= 100) {
        str += belowTwenty[Math.floor(n / 100) - 1] + " Hundred ";
        n %= 100;
      }
  
      if (n >= 20) {
        str += tens[Math.floor(n / 10) - 2] + " ";
        n %= 10;
      }
  
      if (n > 0 && n < 20) {
        str += belowTwenty[n - 1] + " ";
      }
  
      return str.trim();
    };
  
    let result = "";
    let unitIndex = 0;
  
    while (num > 0) {
      let currentChunk = num % 1000;
  
      if (currentChunk > 0) {
        result =
          `${getBelowThousand(currentChunk)} ${aboveThousand[unitIndex]} ${result}`.trim();
      }
  
      num = Math.floor(num / 1000);
      unitIndex++;
    }
  
    return result.trim();
  };