import { DateTime } from "luxon"

// date and time helper functions
export const dt = new (class {
  toLocal(iso: string) {
    return DateTime.fromISO(iso).setLocale("de-ch").toFormat("d. LLLL y HH:mm")
  }
})()
