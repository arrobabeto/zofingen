import * as lodash from "lodash"
import sanitizeHtml from "sanitize-html"

// generic helper functions
export const fn = new (class {
  // lodash
  random = lodash.random
  debounce = lodash.debounce
  throttle = lodash.throttle
  clone = lodash.cloneDeep

  // sleep for ms milliseconds
  sleep(ms: number) {
    return new Promise((res) => setTimeout(res, ms))
  }

  // change value, sleep, revert
  async jojo(obj: { value: any }, value: any, duration = 1000) {
    const before = obj.value
    obj.value = value
    await fn.sleep(duration)
    obj.value = before
  }

  formatCurrencyFn(num) {
    if (isNaN(num)) return 0
    const number = new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "CHF",
    }).format(num)
    if (number) return number
  }

  removeHtml(htmlString: string): string {
    return sanitizeHtml(htmlString, {
      // Specify that no tags are allowed, removing all HTML.
      allowedTags: [],
      // Additionally, you can specify no attributes are allowed if needed.
      allowedAttributes: {},
    })
  }

  nullObj() {
    return new Proxy({}, { get: (target, property) => null })
  }

  truncateText(
    text: string,
    maxLength: number,
    ending: string = "...",
  ): string {
    // Check if the text length is greater than the maximum allowed length
    if (text.length > maxLength) {
      // Determine the actual length of the truncated part
      const truncatedLength = maxLength - ending.length
      // Return the truncated text with the ending appended
      return (
        text.substring(0, truncatedLength > 0 ? truncatedLength : 0) + ending
      )
    }
    // If the text does not need to be truncated, return it as is
    return text
  }
})()
