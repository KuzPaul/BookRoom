import { deleteRequest, getJson, postJson } from "./http";
import type { Booking } from "./types";

export type BookingsScope = "upcoming" | "past" | "all";

export function getBookings(params: {
  scope?: BookingsScope;
  officeId?: string;
} = {}): Promise<{ items: Booking[] }> {
  const q = new URLSearchParams();

  if (params.scope) q.set("scope", params.scope);
  if (params.officeId) q.set("officeId", params.officeId);

  const query = q.toString();
  const path = query ? `/api/v1/bookings?${query}` : "/api/v1/bookings";

  return getJson(path);
}

export function createBooking(body: {
  roomId: string;
  title: string;
  startsAt: string;
  endsAt: string;
  comment?: string;
}): Promise<Booking> {
  return postJson("/api/v1/bookings", body);
}

export function cancelBooking(bookingId: string): Promise<void> {
  return deleteRequest(`/api/v1/bookings/${bookingId}`);
}
