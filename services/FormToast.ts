import { reactive } from "vue"

class _FormToast {
  visible = false
  message = ""
  private hideTimer: ReturnType<typeof setTimeout> | null = null

  show(message: string, durationMs = 3000) {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
    }
    this.message = message
    this.visible = true
    this.hideTimer = setTimeout(() => this.hide(), durationMs)
  }

  hide() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer)
      this.hideTimer = null
    }
    this.visible = false
    this.message = ""
  }
}

export const FormToast = reactive(new _FormToast()) as Readonly<_FormToast>
