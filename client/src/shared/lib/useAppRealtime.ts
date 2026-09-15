import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";

type RealtimeEvent = {
  type: string;
  occurredAt: string;
  data: Record<string, unknown>;
};

function getQueryKeysForEvent(type: string): string[][] {
  switch (type) {
    case "booking.created":
    case "booking.cancelled":
      return [["bookings"], ["room-bookings"], ["rooms"]];
    case "room.availability_changed":
      return [["rooms"], ["room-bookings"]];
    case "data.reset":
      return [["rooms"], ["room"], ["room-bookings"], ["bookings"]];
    default:
      return [];
  }
}

export function useAppRealtime() {
  const queryClient = useQueryClient();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingKeysRef = useRef(new Set<string>());

  useEffect(() => {
    const flushInvalidation = () => {
      pendingKeysRef.current.forEach((serialized) => {
        queryClient.invalidateQueries({ queryKey: JSON.parse(serialized) });
      });
      pendingKeysRef.current.clear();
      debounceRef.current = null;
    };

    const scheduleInvalidation = (type: string) => {
      getQueryKeysForEvent(type).forEach((queryKey) => {
        pendingKeysRef.current.add(JSON.stringify(queryKey));
      });

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(flushInvalidation, 200);
    };

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/v1/ws`);

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as RealtimeEvent;
        if (!getQueryKeysForEvent(message.type).length) return;
        scheduleInvalidation(message.type);
      } catch {

      }
    };

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      ws.close();
    };
  }, [queryClient]);
}
