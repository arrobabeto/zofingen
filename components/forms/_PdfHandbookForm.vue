<script setup lang="ts">
  import { reactive } from "vue"
  import { useFormSubmit } from "~/composables/useFormSubmit"
  import { FormToast } from "~/services/FormToast"

  const emit = defineEmits<{ success: [] }>()

  const fields = reactive({
    salutation: "Herr",
    lastName: "",
    firstName: "",
    email: "",
    phone: "",
  })

  const { status, errorMessage, submitForm, reset } = useFormSubmit()

  const SUCCESS_MESSAGE = "Vielen Dank, wir haben Ihre Nachricht erhalten!"
  const AUTO_CLOSE_MS = 3000

  function resetFields() {
    fields.salutation = "Herr"
    fields.lastName = ""
    fields.firstName = ""
    fields.email = ""
    fields.phone = ""
    reset()
  }

  async function handleSubmit() {
    await submitForm("pdf_handbook", { ...fields })
    if (status.value !== "success") return

    FormToast.show(SUCCESS_MESSAGE, AUTO_CLOSE_MS)
    emit("success")
    resetFields()
  }

  defineExpose({ resetFields })
</script>

<template>
  <div class="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-12">
    <p
      class="max-w-[340px] shrink-0 font-serif text-[20px] font-bold leading-normal text-brand-blue lg:text-[24px]"
    >
      Kostenloses Firmengründungshandbuch mit Schritt-für-Schritt-Anleitung
    </p>

    <form class="min-w-0 flex-1" @submit.prevent="handleSubmit">
      <div class="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_minmax(200px,1.15fr)] sm:gap-4">
        <select
          v-model="fields.salutation"
          required
          class="h-16 rounded-[10px] border-0 bg-white px-3 font-serif text-[16px] text-brand-blue shadow-sm"
        >
          <option value="Herr">Herr</option>
          <option value="Frau">Frau</option>
        </select>

        <input
          v-model="fields.lastName"
          type="text"
          required
          placeholder="Nachname"
          class="h-16 rounded-[10px] border-0 bg-white px-3 font-serif text-[16px] text-brand-grey placeholder:text-brand-grey/70 shadow-sm"
        />

        <input
          v-model="fields.firstName"
          type="text"
          required
          placeholder="Vorname"
          class="h-16 rounded-[10px] border-0 bg-white px-3 font-serif text-[16px] text-brand-grey placeholder:text-brand-grey/70 shadow-sm"
        />

        <input
          v-model="fields.email"
          type="email"
          required
          placeholder="Email"
          class="h-16 rounded-[10px] border-0 bg-white px-3 font-serif text-[16px] text-brand-grey placeholder:text-brand-grey/70 shadow-sm"
        />

        <input
          v-model="fields.phone"
          type="tel"
          required
          placeholder="Telefon"
          class="h-16 rounded-[10px] border-0 bg-white px-3 font-serif text-[16px] text-brand-grey placeholder:text-brand-grey/70 shadow-sm"
        />

        <button
          type="submit"
          :disabled="status === 'submitting'"
          class="flex h-16 w-full items-center justify-center whitespace-nowrap rounded-[10px] bg-brand-blue px-6 font-serif text-[18px] font-bold text-white transition hover:bg-brand-blue2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ status === "submitting" ? "Wird gesendet…" : "PDF anfordern" }}
        </button>
      </div>

      <p v-if="errorMessage" class="mt-3 font-serif text-[14px] text-red-600">
        {{ errorMessage }}
      </p>
    </form>
  </div>
</template>
