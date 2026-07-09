<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from "vue"
  import SectionHeading from "./_SectionHeading.vue"

  const props = defineProps<{
    title: string
    items?: { quote: string; author: string; role: string }[]
    quote?: string
    author?: string
    role?: string
    image: string
  }>()

  const slides = computed(() => {
    if (props.items?.length) return props.items
    if (props.quote) {
      return [
        {
          quote: props.quote,
          author: props.author ?? "",
          role: props.role ?? "",
        },
      ]
    }
    return []
  })

  const index = ref(0)
  const paused = ref(false)
  let timer: ReturnType<typeof setInterval> | undefined

  const active = computed(() => slides.value[index.value])

  function goTo(next: number) {
    const total = slides.value.length
    if (!total) return
    index.value = ((next % total) + total) % total
  }

  function next() {
    goTo(index.value + 1)
  }

  function prev() {
    goTo(index.value - 1)
  }

  function startAutoplay() {
    stopAutoplay()
    if (slides.value.length < 2 || paused.value) return
    timer = setInterval(next, 5000)
  }

  function stopAutoplay() {
    if (timer) clearInterval(timer)
    timer = undefined
  }

  function pauseAutoplay() {
    paused.value = true
    stopAutoplay()
  }

  function resumeAutoplay() {
    paused.value = false
    startAutoplay()
  }

  onMounted(startAutoplay)
  onUnmounted(stopAutoplay)
</script>

<template>
  <section class="w-full py-16">
    <div
      class="flex w-full flex-col items-center gap-9 bg-brand-card px-6 py-16 lg:px-[100px]"
      @mouseenter="pauseAutoplay"
      @mouseleave="resumeAutoplay"
    >
      <SectionHeading :title="title" align="center" />
      <div
        class="flex w-full max-w-[1200px] flex-col items-center justify-center gap-12 lg:flex-row lg:gap-[88px]"
      >
        <div class="flex w-full max-w-[477px] flex-col items-center gap-6">
          <div
            v-if="active"
            class="flex w-full items-center justify-center rounded-[20px] bg-white px-[18px] py-8 drop-shadow-[2px_2px_4px_rgba(0,0,0,0.1)]"
          >
            <Transition name="testimonial-fade" mode="out-in">
              <div
                :key="index"
                class="w-full font-serif text-brand-blue"
                aria-live="polite"
              >
                <p class="text-[18px] leading-[25px]">{{ active.quote }}</p>
                <p class="mt-6 text-[18px] font-bold italic leading-[25px]">
                  - {{ active.author }}
                </p>
                <p class="text-[18px] italic leading-[25px] text-brand-grey">
                  {{ active.role }}
                </p>
              </div>
            </Transition>
          </div>

          <div class="flex w-full items-center justify-center gap-4">
            <button
              type="button"
              class="select-none font-serif text-4xl text-brand-blue transition hover:text-brand-blue2"
              aria-label="Vorheriges Testimonial"
              @click="prev"
            >
              ‹
            </button>
            <div class="flex flex-wrap items-center justify-center gap-2">
              <button
                v-for="(_, i) of slides"
                :key="i"
                type="button"
                class="testimonial-dot h-2.5 w-2.5 rounded-full transition"
                :class="i === index ? 'bg-brand-blue' : 'bg-brand-blue/30'"
                :aria-label="`Testimonial ${i + 1}`"
                :aria-current="i === index ? 'true' : undefined"
                @click="goTo(i)"
              />
            </div>
            <button
              type="button"
              class="select-none font-serif text-4xl text-brand-blue transition hover:text-brand-blue2"
              aria-label="Nächstes Testimonial"
              @click="next"
            >
              ›
            </button>
          </div>
        </div>
        <img
          :src="image"
          alt=""
          class="h-[278px] w-full rounded-[10px] object-cover lg:w-[582px]"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
  .testimonial-fade-enter-active,
  .testimonial-fade-leave-active {
    transition: opacity 0.35s ease;
  }

  .testimonial-fade-enter-from,
  .testimonial-fade-leave-to {
    opacity: 0;
  }
</style>
