<script setup lang="ts">
  import { reactive } from "vue"
  import { useFormSubmit } from "~/composables/useFormSubmit"
  import { FormToast } from "~/services/FormToast"

  const p = defineProps<{
    map: string
    office: string
    phone: string
    email: string
    linkedin: string
    services: string[]
  }>()

  const fields = reactive({
    salutation: "Herr",
    lastName: "",
    firstName: "",
    company: "",
    email: "",
    phone: "",
    service: p.services[0] || "",
    message: "",
  })

  const { status, errorMessage, submitForm, reset } = useFormSubmit()

  const SUCCESS_MESSAGE = "Vielen Dank, wir haben Ihre Nachricht erhalten!"
  const AUTO_CLOSE_MS = 4000

  async function handleSubmit() {
    fields.service = fields.service || p.services[0] || ""
    await submitForm("contact", { ...fields })
    if (status.value !== "success") return

    FormToast.show(SUCCESS_MESSAGE, AUTO_CLOSE_MS)
    fields.salutation = "Herr"
    fields.lastName = ""
    fields.firstName = ""
    fields.company = ""
    fields.email = ""
    fields.phone = ""
    fields.service = p.services[0] || ""
    fields.message = ""
    reset()
  }
</script>

<template>
  <section class="w-full px-6 pb-24 pt-[60px] lg:px-[100px]">
    <div
      class="mx-auto flex max-w-[1200px] flex-col overflow-hidden rounded-[10px] bg-white shadow-[0px_0px_60px_30px_rgba(0,0,0,0.03)] lg:flex-row"
    >
      <!-- Left: light-blue info panel + map -->
      <div
        class="flex flex-col justify-between bg-brand-light text-brand-blue lg:w-[479px]"
      >
        <div class="flex flex-col gap-8 p-16">
          <div class="flex items-start gap-4">
            <svg
              class="mt-1 h-6 w-6 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M12 21s-7-6.3-7-11a7 7 0 1 1 14 0c0 4.7-7 11-7 11z"
                stroke-linejoin="round"
              />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
            <p class="font-serif text-[18px] leading-[25px]">
              <span class="font-bold">Büro:</span><br />{{ office }}
            </p>
          </div>

          <div class="flex items-start gap-4">
            <svg class="mt-1 h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.25 11.4 11.4 0 0 0 3.6.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.3a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .57 3.6 1 1 0 0 1-.25 1z"
              />
            </svg>
            <p class="font-serif text-[18px] leading-[25px]">
              <span class="font-bold">Telefon:</span><br />{{ phone }}
            </p>
          </div>

          <div class="flex items-start gap-4">
            <svg class="mt-1 h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 4v10h16V8l-8 5z"
              />
            </svg>
            <p class="break-all font-serif text-[18px] leading-[25px]">
              <span class="font-bold">Email:</span><br />{{ email }}
            </p>
          </div>

          <div class="flex items-start gap-4">
            <svg class="mt-1 h-5 w-5 shrink-0" viewBox="0 0 24 24" fill="currentColor">
              <path
                d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.07 1.4-2.07 2.85V21H9z"
              />
            </svg>
            <p class="font-serif text-[18px] leading-[25px]">
              <span class="font-bold">LinkedIn:</span><br />{{ linkedin }}
            </p>
          </div>
        </div>

        <div class="h-[311px] w-full shrink-0">
          <iframe
            :src="map"
            title="Zofingen Treuhand AG Standort"
            class="h-full w-full border-0"
            loading="lazy"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
        </div>
      </div>

      <!-- Right: form -->
      <form
        class="flex flex-1 flex-col gap-4 p-6 text-center lg:p-16"
        @submit.prevent="handleSubmit"
      >
        <label class="flex flex-col gap-2">
          <span class="font-serif text-[18px] leading-[25px] text-brand-blue2">
            Anrede
          </span>
          <select
            v-model="fields.salutation"
            required
            class="rounded-[10px] border border-brand-blue2 bg-white p-3 font-serif text-[16px] text-brand-blue2"
          >
            <option value="Herr">Herr</option>
            <option value="Frau">Frau</option>
          </select>
        </label>

        <div class="flex flex-col gap-4 sm:flex-row">
          <label class="flex flex-1 flex-col gap-2">
            <span class="font-serif text-[18px] leading-[25px] text-brand-grey">
              Name
            </span>
            <input
              v-model="fields.lastName"
              type="text"
              required
              placeholder="Name"
              class="rounded-[10px] border border-black p-3 font-serif text-[16px] text-brand-grey"
            />
          </label>
          <label class="flex flex-1 flex-col gap-2">
            <span class="font-serif text-[18px] leading-[25px] text-brand-grey">
              Vorname
            </span>
            <input
              v-model="fields.firstName"
              type="text"
              required
              placeholder="Vorname"
              class="rounded-[10px] border border-black p-3 font-serif text-[16px] text-brand-grey"
            />
          </label>
        </div>

        <label class="flex flex-col gap-2">
          <span class="font-serif text-[18px] leading-[25px] text-brand-grey">
            Firma
          </span>
          <input
            v-model="fields.company"
            type="text"
            placeholder="Firma"
            class="rounded-[10px] border border-black p-3 font-serif text-[16px] text-brand-grey"
          />
        </label>

        <div class="flex flex-col gap-4 sm:flex-row">
          <label class="flex flex-1 flex-col gap-2">
            <span class="font-serif text-[18px] leading-[25px] text-brand-grey">
              Email
            </span>
            <input
              v-model="fields.email"
              type="email"
              required
              placeholder="Email"
              class="rounded-[10px] border border-black p-3 font-serif text-[16px] text-brand-grey"
            />
          </label>
          <label class="flex flex-1 flex-col gap-2">
            <span class="font-serif text-[18px] leading-[25px] text-brand-grey">
              Telefon
            </span>
            <input
              v-model="fields.phone"
              type="tel"
              placeholder="Telefon"
              class="rounded-[10px] border border-black p-3 font-serif text-[16px] text-brand-grey"
            />
          </label>
        </div>

        <label class="flex flex-col gap-2">
          <span class="font-serif text-[18px] leading-[25px] text-brand-blue2">
            Dienstleistung
          </span>
          <select
            v-model="fields.service"
            class="rounded-[10px] border border-brand-blue2 bg-white p-3 font-serif text-[16px] text-brand-blue2"
          >
            <option v-for="(s, i) of services" :key="i" :value="s">{{ s }}</option>
          </select>
        </label>

        <label class="flex flex-col gap-2">
          <span class="font-serif text-[18px] leading-[25px] text-brand-blue2">
            Mitteilung
          </span>
          <textarea
            v-model="fields.message"
            rows="4"
            required
            placeholder="Mitteilung"
            class="rounded-[10px] border border-brand-blue2 p-3 font-serif text-[16px] text-brand-blue2"
          />
        </label>

        <button
          type="submit"
          :disabled="status === 'submitting'"
          class="mx-auto mt-2 flex w-full max-w-[273px] items-center justify-center rounded-[10px] bg-brand-blue px-4 py-3 text-center font-serif text-[18px] text-white transition hover:bg-brand-blue2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {{ status === "submitting" ? "Wird gesendet…" : "Anfrage versenden" }}
        </button>

        <p v-if="errorMessage" class="font-serif text-[14px] text-red-600">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </section>
</template>
