import { ref } from "vue"

export type TFormSubmitStatus = "idle" | "submitting" | "success" | "error"

export type TFormType = "pdf_handbook" | "contact" | "jahresabschluss" | "callback"

export function useFormSubmit() {
  const status = ref<TFormSubmitStatus>("idle")
  const errorMessage = ref("")

  async function submitForm(formType: TFormType, fields: Record<string, string>) {
    status.value = "submitting"
    errorMessage.value = ""

    try {
      await $fetch("/api/forms/submit", {
        method: "POST",
        body: { formType, fields },
      })
      status.value = "success"
    } catch (err: unknown) {
      status.value = "error"
      const fetchErr = err as { statusMessage?: string; message?: string }
      errorMessage.value =
        fetchErr.statusMessage ??
        fetchErr.message ??
        "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut."
    }
  }

  function reset() {
    status.value = "idle"
    errorMessage.value = ""
  }

  return { status, errorMessage, submitForm, reset }
}
