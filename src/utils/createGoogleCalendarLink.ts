export function createGoogleCalendarLink(event: { title: string; date: any }) {
  const d = new Date(event.date.toDate());

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  const formatted = `${yyyy}${mm}${dd}`;

  return `https://calendar.google.com/calendar/render?action=TEMPLATE
    &text=${encodeURIComponent(event.title)}
    &dates=${formatted}/${formatted}`;
}
