import type { Timestamp } from "firebase/firestore";
import type { VisitedEvent } from "../types/visitedEvent";

const STORAGE_KEY = "visitedEvents";

export const getVisitedEvents = () => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (!data) return [];

  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
};

const saveVisitedEvents = (events: VisitedEvent[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
};

export const addVisitedEvent = (event: {
  eventId: string;
  title: string;
  date: Timestamp;
}) => {
  const events = getVisitedEvents();

  const existingIndex = events.findIndex(
    (e: VisitedEvent) => e.eventId === event.eventId,
  );

  if (existingIndex !== -1) {
    events[existingIndex].visitedAt = Date.now();
  } else {
    events.push({
      ...event,
      date: event.date.toMillis(),
      visitedAt: Date.now(),
    });
  }

  const sorted = events.sort(
    (a: VisitedEvent, b: VisitedEvent) => b.visitedAt - a.visitedAt,
  );

  const limited = sorted.slice(0, 10);

  saveVisitedEvents(limited);
};

export const removeVisitedEvent = (eventId: string) => {
  const events = getVisitedEvents();

  const filtered = events.filter((e: VisitedEvent) => e.eventId !== eventId);

  saveVisitedEvents(filtered);
};

export const clearVisitedEvents = () => {
  localStorage.removeItem(STORAGE_KEY);
};
