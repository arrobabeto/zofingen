<script setup lang="ts">
  defineProps<{
    background: string
    photo: string
    name: string
    quote: string
    badge: string
    intro: string
    credentials: string[]
  }>()
</script>

<template>
  <section class="relative w-full">
    <img
      :src="background"
      alt=""
      class="pointer-events-none absolute inset-0 h-full w-full object-cover"
    />
    <div class="relative mx-auto max-w-[1200px] bg-white">
      <div
        class="flex flex-col items-start gap-12 px-6 py-16 lg:flex-row lg:gap-[138px] lg:px-[100px]"
      >
        <div class="flex w-full flex-col items-center gap-4 lg:w-[273px]">
          <img :src="photo" alt="" class="h-[273px] w-[273px] object-contain" />
          <p class="text-center font-serif text-[24px] font-bold text-brand-blue">
            {{ name }}
          </p>
          <p
            class="text-center font-serif text-[16px] font-bold italic leading-[25px] text-brand-blue"
          >
            «{{ quote }}»
          </p>
          <img :src="badge" alt="" class="h-[146px] w-[103px] object-contain" />
        </div>

        <div class="flex w-full flex-col gap-3.5 lg:w-[583px]">
          <p
            class="whitespace-pre-line font-serif text-[18px] leading-[25px] text-brand-blue"
          >
            {{ intro }}
          </p>
          <p
            v-for="(c, i) of credentials"
            :key="i"
            class="border-brand-blue/40 pt-3.5 font-serif text-[18px] leading-[25px] text-brand-blue"
            :class="i === 0 ? '' : 'border-t'"
          >
            {{ c }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
