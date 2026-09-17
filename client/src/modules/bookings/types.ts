import type { BookingsScope } from "../../shared/api/bookings.api";

export type { BookingsScope };

export type BookingsTabScope = Exclude<BookingsScope, "all">;

export const ALL_OFFICES_VALUE = "all";
