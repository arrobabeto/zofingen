import { reactive, watch } from "vue"

class _Store {
  counter = 0
}

export const Store = reactive(new _Store())

if (process.client) {
  Object.assign(Store, JSON.parse(localStorage.getItem("Store") ?? "{}"))
  watch(Store, () => localStorage.setItem("Store", JSON.stringify(Store)))
}
