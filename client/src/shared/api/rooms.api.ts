import { getJson } from "./http";
import type { Booking, RoomSummary } from "./types";

export function getRooms(params: {
  officeId: string;
  minCapacity?: number;
  from?: string;
  to?: string;
}): Promise<{ items: RoomSummary[] }> {
  const q = new URLSearchParams({ officeId: params.officeId });

  if (params.minCapacity != null) {
    q.set("minCapacity", String(params.minCapacity));
  }
  if (params.from && params.to) {
    q.set("from", params.from);
    q.set("to", params.to);
  }

  return getJson(`/api/v1/rooms?${q.toString()}`);
}

export function getRoom(roomId: string): Promise<RoomSummary> {
  return getJson(`/api/v1/rooms/${roomId}`);
}

export function getRoomBookings(
  roomId: string,
  from: string,
  to: string,
): Promise<{ items: Booking[] }> {
  const q = new URLSearchParams({ from, to });
  return getJson(`/api/v1/rooms/${roomId}/bookings?${q.toString()}`);
}
