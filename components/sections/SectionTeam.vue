<script setup lang="ts">
  import SectionHeading from "./_SectionHeading.vue"
  import CheckCircle from "./_CheckCircle.vue"

  defineProps<{
    title: string
    subtitle: string
    intro: string
    bullets?: { bold: string; text: string }[]
    members: { name: string; role: string; description: string; image: string }[]
  }>()
</script>

<template>
  <section class="w-full px-6 py-16 lg:px-[100px]">
    <div class="mx-auto flex max-w-[1200px] flex-col items-center gap-14">
      <div class="flex max-w-[788px] flex-col items-center gap-8">
        <SectionHeading :title="title" :subtitle="subtitle" align="center" />
        <p class="text-center font-serif text-[18px] leading-[25px] text-brand-blue">
          {{ intro }}
        </p>
        <div v-if="bullets" class="flex flex-col gap-9 lg:flex-row">
          <div
            v-for="(b, i) of bullets"
            :key="i"
            class="flex items-center gap-6"
          >
            <CheckCircle />
            <p class="font-serif text-[18px] leading-[25px] text-brand-blue lg:w-[485px]">
              <span class="font-bold">{{ b.bold }} </span>{{ b.text }}
            </p>
          </div>
        </div>
      </div>

      <div
        class="grid max-w-[1105px] grid-cols-1 justify-items-center gap-x-[60px] gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      >
        <div
          v-for="(m, i) of members"
          :key="i"
          class="relative flex h-full w-[273px] flex-col items-center"
        >
          <div
            class="absolute left-0 right-0 top-[132px] bottom-0 rounded-[10px] bg-brand-light/60"
          />
          <div
            class="relative z-[1] h-[273px] w-[273px] shrink-0 overflow-hidden rounded-full bg-white"
          >
            <img
              :src="m.image"
              alt=""
              class="h-full w-full object-cover object-top"
            />
          </div>
          <div
            class="relative z-[1] mt-4 w-full px-2 pb-5 text-center text-brand-blue"
          >
            <div class="flex flex-col items-center gap-[15px]">
              <p class="font-serif text-[24px] font-bold">{{ m.name }}</p>
              <p class="whitespace-pre-line font-serif text-[16px] font-bold leading-[25px]">
                {{ m.role }}
              </p>
              <span class="block h-px w-[123px] bg-brand-blue" />
              <p class="font-serif text-[16px] leading-[25px]">
                {{ m.description }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
