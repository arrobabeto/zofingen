<script setup lang="ts">
  import { onMounted, onUnmounted, ref, watch } from "vue"

  const STORAGE_KEY = "zofingen-phishing-warning-dismissed"

  const open = ref(false)

  function dismiss() {
    open.value = false
    try {
      window.localStorage.setItem(STORAGE_KEY, "1")
    } catch {
      // private mode / blocked storage — still close for this session
    }
  }

  function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape" && open.value) dismiss()
  }

  function onOverlayClick(e: MouseEvent) {
    if (e.target === e.currentTarget) dismiss()
  }

  watch(open, (isOpen) => {
    if (typeof document === "undefined") return
    document.body.style.overflow = isOpen ? "hidden" : ""
  })

  onMounted(() => {
    document.addEventListener("keydown", onKeydown)
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return
    } catch {
      // show anyway if storage unreadable
    }
    open.value = true
  })

  onUnmounted(() => {
    document.removeEventListener("keydown", onKeydown)
    if (typeof document !== "undefined") document.body.style.overflow = ""
  })
</script>

<template>
  <Teleport to="body">
    <Transition name="phishing-popup">
        <div
          v-if="open"
          class="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-black/70 p-4"
          @click="onOverlayClick"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="phishing-warning-title"
            class="relative my-auto w-full max-w-[793px] overflow-hidden rounded-[16px] bg-white shadow-[2px_2px_5px_0px_rgba(0,0,0,0.15)]"
            @click.stop
          >
            <button
              type="button"
              aria-label="Schliessen"
              class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded border border-brand-blue font-serif text-[20px] leading-none text-brand-blue transition hover:bg-brand-light/60 lg:right-4 lg:top-4"
              @click="dismiss"
            >
              ×
            </button>

            <div
              class="flex flex-col items-center gap-6 px-5 py-10 sm:px-8 lg:flex-row lg:items-center lg:gap-[15px] lg:px-10 lg:py-8"
            >
              <div
                class="w-full font-serif text-[16px] leading-[24px] text-[#1b426b] lg:w-[502px] lg:shrink-0 lg:text-[18px] lg:leading-[25px]"
              >
                <h2
                  id="phishing-warning-title"
                  class="mb-4 font-serif text-[22px] font-bold leading-[28px] text-brand-blue lg:text-[24px] lg:leading-[25px]"
                >
                  Achtung: Betrügerische E-Mails im Umlauf!
                </h2>

                <p class="mb-4">
                  Aktuell werden gefälschte E-Mails im Namen der
                  <strong class="font-bold">Zofingen Treuhand AG</strong>
                  verschickt.
                </p>

                <p class="mb-4">
                  Die Nachrichten werden unter dem Absender
                  <strong class="font-bold">Capboard (</strong>
                  <a
                    href="mailto:noreply@capboard.io"
                    class="font-bold text-[#1b426b] underline"
                    >noreply@capboard.io</a
                  ><strong class="font-bold">)</strong>
                  versendet und erwecken den Eindruck, dass wir ein Dokument mit
                  dem Namen
                  «zahlungsunterlagen_zu_steuerrueckerstattungen.pdf» mit Ihnen
                  geteilt hätten.
                </p>

                <p class="mb-1 font-bold">Diese E-Mails stammen nicht von uns!</p>
                <p class="mb-4">
                  Bitte
                  <strong class="font-bold">klicken Sie nicht</strong>
                  auf den Button «View» oder den enthaltenen Link und löschen Sie
                  die E-Mail umgehend.
                </p>

                <p class="mb-4">Vielen Dank für Ihre Aufmerksamkeit.</p>
                <p class="font-bold">Zofingen Treuhand AG</p>
              </div>

              <img
                src="/img/home/phishing-warning.svg"
                alt=""
                class="block h-auto w-[180px] max-w-full shrink-0 object-contain sm:w-[220px] lg:w-[277px]"
                width="277"
                height="235"
              />
            </div>
          </div>
        </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
  .phishing-popup-enter-active,
  .phishing-popup-leave-active {
    transition: opacity 0.2s ease;
  }

  .phishing-popup-enter-active > div:last-child,
  .phishing-popup-leave-active > div:last-child {
    transition: transform 0.2s ease;
  }

  .phishing-popup-enter-from,
  .phishing-popup-leave-to {
    opacity: 0;
  }

  .phishing-popup-enter-from > div:last-child,
  .phishing-popup-leave-to > div:last-child {
    transform: scale(0.97);
  }
</style>
