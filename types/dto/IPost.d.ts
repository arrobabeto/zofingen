import type { I18nString } from "~/types/util/I18nString"

export interface IPost {
  id: string
  title: I18nString
  lead: string
  img: string
  published: boolean
  created_at: string
  updated_at: string
}
