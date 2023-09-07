export function concatClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatUnixTimestamp(unixTimestamp: number | Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ];

  const date = new Date(unixTimestamp);
  const month = months[date.getMonth()];
  const day = date.getDate();
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const amPm = hours24 >= 12 ? "PM" : "AM";

  return `${month} ${day}, ${hours12}:${minutes} ${amPm}`;
}
