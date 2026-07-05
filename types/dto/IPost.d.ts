import type { I18nString } from "~/types/util/I18nString"
import type { Section } from "~/types/util/Section"

export type PostStatus = {
  options?: string[]
  value: "draft" | "review" | "published"
}

export interface IPost {
  id: string
  title: I18nString
  lead: I18nString
  img: string
  sections: Section[]
  keywords: string[]
  status: PostStatus
  created_at: string
  updated_at: string
}
