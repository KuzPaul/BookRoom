import { getJson } from "./http";
import type { Office } from "./types";

export function getOffices(): Promise<{ items: Office[] }> {
  return getJson("/api/v1/offices");
}
