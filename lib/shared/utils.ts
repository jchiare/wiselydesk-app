export function formatConversationTime(time: string) {
  // remove leading 0 from sentTime
  if (time.charAt(0) === "0") {
    time = time.slice(1);
  }
  return time;
}

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

export function generateRandomLorem(minLength = 15, maxLength = 70) {
  const lorem =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";

  const randomLength =
    Math.floor(Math.random() * (maxLength - minLength + 1)) + minLength;

  const start = Math.floor(Math.random() * (lorem.length - randomLength));

  return lorem.slice(start, start + randomLength);
}
