<script setup lang="ts">
  import { useTranslate } from "~/composables/useTranslate"
  import type { I18nString } from "~/types/util/I18nString"

  const p = defineProps<{
    step: string
    tone: string
    icon: "figma" | "bridge" | "cursor" | "database" | "intelligence"
    label: I18nString
    detail: I18nString
  }>()

  const t = useTranslate()
</script>

<template>
  <div class="workflow-card" :class="p.tone">
    <div class="workflow-card__inner">
      <div class="workflow-card__icon" aria-hidden="true">
        <svg
          v-if="p.icon === 'figma'"
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
        >
          <path
            d="M8 3H12C14.2 3 16 4.8 16 7C16 9.2 14.2 11 12 11H8V3Z"
            fill="#F24E1E"
          />
          <path
            d="M8 11H12C14.2 11 16 12.8 16 15C16 17.2 14.2 19 12 19H8V11Z"
            fill="#FF7262"
          />
          <path
            d="M8 19H12C13.1 19 14 18.1 14 17C14 15.9 13.1 15 12 15H8V19Z"
            fill="#A259FF"
          />
          <path d="M4 7C4 4.8 5.8 3 8 3H8V11H4V7Z" fill="#1ABCFE" />
          <path d="M4 15C4 12.8 5.8 11 8 11H8V19H4V15Z" fill="#0ACF83" />
        </svg>
        <svg
          v-else-if="p.icon === 'bridge'"
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
        >
          <path stroke-linecap="round" d="M4 12h6m4 0h6M10 8v8m4-8v8" />
          <circle cx="7" cy="12" r="2" fill="currentColor" />
          <circle cx="17" cy="12" r="2" fill="currentColor" />
        </svg>
        <svg
          v-else-if="p.icon === 'cursor'"
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 6l8 6-8 6V6z"
          />
          <path stroke-linecap="round" d="M5 5v14" opacity="0.45" />
        </svg>
        <svg
          v-else-if="p.icon === 'intelligence'"
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z"
          />
          <path
            stroke-linecap="round"
            d="M5 19c2-2 4.5-3 7-3s5 1 7 3"
          />
        </svg>
        <svg
          v-else
          viewBox="0 0 24 24"
          class="size-5"
          fill="none"
          stroke="currentColor"
          stroke-width="1.75"
        >
          <ellipse cx="12" cy="6" rx="7" ry="3" />
          <path d="M5 6v6c0 1.7 3.1 3 7 3s7-1.3 7-3V6" />
          <path d="M5 12v6c0 1.7 3.1 3 7 3s7-1.3 7-3v-6" />
        </svg>
      </div>
      <div class="workflow-card__body">
        <span class="workflow-card__step">{{ p.step }}</span>
        <h3 class="workflow-card__title">{{ t(p.label) }}</h3>
        <p class="workflow-card__detail">{{ t(p.detail) }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .workflow-card {
    height: 100%;
    min-width: 0;
  }

  .workflow-card__inner {
    position: relative;
    display: flex;
    height: 100%;
    flex-direction: column;
    gap: 0.875rem;
    padding: 1rem 1.125rem 1.125rem;
    border-radius: 1rem;
    border: 1px solid rgba(1, 1, 1, 0.06);
    background: linear-gradient(
      165deg,
      rgba(254, 254, 254, 1) 0%,
      rgba(246, 246, 246, 0.85) 100%
    );
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.6) inset,
      0 1px 2px rgba(1, 1, 1, 0.04),
      0 6px 20px rgba(1, 1, 1, 0.05);
    transition:
      transform 0.2s ease,
      box-shadow 0.2s ease,
      border-color 0.2s ease;
  }

  .workflow-card__inner:hover {
    transform: translateY(-3px);
    border-color: rgba(19, 132, 255, 0.18);
    box-shadow:
      0 0 0 1px rgba(255, 255, 255, 0.7) inset,
      0 4px 12px rgba(19, 132, 255, 0.08),
      0 12px 28px rgba(1, 1, 1, 0.08);
  }

  @media (prefers-color-scheme: dark) {
    .workflow-card__inner {
      border-color: rgba(255, 255, 255, 0.08);
      background: linear-gradient(
        165deg,
        rgba(34, 35, 43, 0.95) 0%,
        rgba(25, 26, 34, 1) 100%
      );
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.04) inset,
        0 8px 24px rgba(0, 0, 0, 0.35);
    }

    .workflow-card__inner:hover {
      border-color: rgba(19, 132, 255, 0.35);
      box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.06) inset,
        0 12px 32px rgba(0, 0, 0, 0.45);
    }
  }

  .workflow-card__icon {
    display: grid;
    place-items: center;
    width: 2.5rem;
    height: 2.5rem;
    flex-shrink: 0;
    border-radius: 0.625rem;
    border: 1px solid rgba(1, 1, 1, 0.06);
    background: rgba(246, 246, 246, 0.9);
    color: #1384ff;
    box-shadow: 0 1px 2px rgba(1, 1, 1, 0.04);
  }

  @media (prefers-color-scheme: dark) {
    .workflow-card__icon {
      border-color: rgba(255, 255, 255, 0.08);
      background: rgba(34, 35, 43, 0.9);
      color: #7eb8ff;
    }
  }

  .workflow-card--figma .workflow-card__icon {
    border-color: rgba(162, 89, 255, 0.2);
    background: linear-gradient(
      135deg,
      rgba(242, 78, 30, 0.08),
      rgba(162, 89, 255, 0.12)
    );
  }

  .workflow-card--mcp .workflow-card__icon {
    border-color: rgba(19, 132, 255, 0.22);
    background: rgba(19, 132, 255, 0.08);
    color: #1384ff;
  }

  .workflow-card--cursor .workflow-card__icon {
    border-color: rgba(1, 1, 1, 0.12);
    background: linear-gradient(
      135deg,
      rgba(1, 1, 1, 0.04),
      rgba(78, 78, 78, 0.08)
    );
    color: #010101;
  }

  @media (prefers-color-scheme: dark) {
    .workflow-card--cursor .workflow-card__icon {
      color: #fefefe;
      background: linear-gradient(
        135deg,
        rgba(254, 254, 254, 0.06),
        rgba(203, 203, 203, 0.04)
      );
    }
  }

  .workflow-card--orbitype .workflow-card__icon {
    border-color: rgba(11, 123, 105, 0.25);
    background: rgba(11, 123, 105, 0.1);
    color: #0b7b69;
  }

  @media (prefers-color-scheme: dark) {
    .workflow-card--orbitype .workflow-card__icon {
      color: #a4f4e7;
    }
  }

  .workflow-card--intelligence .workflow-card__icon {
    border-color: rgba(162, 89, 255, 0.28);
    background: linear-gradient(
      135deg,
      rgba(19, 132, 255, 0.1),
      rgba(162, 89, 255, 0.14)
    );
    color: #7c3aed;
  }

  @media (prefers-color-scheme: dark) {
    .workflow-card--intelligence .workflow-card__icon {
      color: #c4b5fd;
    }
  }

  .workflow-card__step {
    display: block;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #9ca3af;
  }

  @media (prefers-color-scheme: dark) {
    .workflow-card__step {
      color: #6b7280;
    }
  }

  .workflow-card__title {
    margin-top: 0.25rem;
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: -0.02em;
    line-height: 1.3;
    color: #010101;
  }

  @media (prefers-color-scheme: dark) {
    .workflow-card__title {
      color: #fefefe;
    }
  }

  .workflow-card__detail {
    margin-top: 0.375rem;
    font-size: 0.75rem;
    line-height: 1.55;
    color: #4e4e4e;
    white-space: pre-line;
    overflow-wrap: anywhere;
  }

  @media (prefers-color-scheme: dark) {
    .workflow-card__detail {
      color: #9ca3af;
    }
  }
</style>
