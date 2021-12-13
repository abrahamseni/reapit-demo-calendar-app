import { format } from "date-fns";

export function formatDate(
  date: string | number | Date,
  formatType = "MMMM dd yyyy, HH:mm a"
) {
  return format(new Date(date), formatType);
}
