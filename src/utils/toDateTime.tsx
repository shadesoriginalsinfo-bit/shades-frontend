import dayjs from "dayjs";

export function toDateTimeLocal(value?: string) {
  if (!value) return "";
  const d = dayjs(value);
  if (!d.isValid()) return "";

  return d.format("YYYY-MM-DDTHH:mm");
}

export function toDateLocal(value?: string) {
  if (!value) return "";
  const d = dayjs(value);
  if (!d.isValid()) return "";

  return d.format("YYYY-MM-DD");
}


export function formatDateTimeAMPM(value?: string) {
  if (!value) return "";
  const d = dayjs(value);
  if (!d.isValid()) return "";

  return d.format("DD/MM/YYYY hh:mm A");
}


export const isSameDay = (a: Date, b: Date) =>
  dayjs(a).isSame(b, "day");

export const isToday = (d: Date) =>
  dayjs(d).isSame(dayjs(), "day");

export const isYesterday = (d: Date) =>
  dayjs(d).isSame(dayjs().subtract(1, "day"), "day");


export const formatFriendlyDateLabel = (d: Date) => {
  const day = dayjs(d);
  const now = dayjs();

  return day.format(
    day.year() === now.year() ? "MMM D" : "MMM D, YYYY"
  );
};


type FormatDurationOptions = {
  maxUnits?: number; // limit number of units shown (default: all)
};

export function formatDuration(
  startDate: string | Date,
  endDate: string | Date,
  options: FormatDurationOptions = {}
): string {
  const totalMinutes = dayjs(endDate).diff(dayjs(startDate), "minute");

  if (totalMinutes <= 0) return "0 minutes";

  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;

  const parts = [
    days > 0 && `${days} day${days > 1 ? "s" : ""}`,
    hours > 0 && `${hours} hour${hours > 1 ? "s" : ""}`,
    minutes > 0 && `${minutes} minute${minutes > 1 ? "s" : ""}`,
  ].filter(Boolean) as string[];

  const maxUnits = options.maxUnits ?? parts.length;

  return parts.slice(0, maxUnits).join(", ");
}




