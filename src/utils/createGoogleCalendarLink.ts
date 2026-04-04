export function createGoogleCalendarLink(event: { title: string; date: any }) {
  const startDate = new Date(
    typeof event.date?.toDate === "function" ? event.date.toDate() : event.date,
  );
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 1);

  const formatCalendarDate = (value: Date) => {
    const yyyy = value.getFullYear();
    const mm = String(value.getMonth() + 1).padStart(2, "0");
    const dd = String(value.getDate()).padStart(2, "0");

    return `${yyyy}${mm}${dd}`;
  };

  const start = formatCalendarDate(startDate);
  const end = formatCalendarDate(endDate);

  return `https://calendar.google.com/calendar/u/0/r/eventedit?text=${encodeURIComponent(
    event.title,
  )}&dates=${start}%2F${end}`;
}
