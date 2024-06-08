export default function localDateFormatter(date: Date): string {
  return date.toLocaleString("id", {
    timeZone: "Asia/Jakarta",
    dateStyle: "full",
    timeStyle: "short",
    hourCycle: "h24",
  });
}
