// Shared manifest for WordPress-hosted videos → public/videos/wp/
import { fileURLToPath } from "node:url"
import { dirname, join } from "node:path"

export const PUBLIC_PREFIX = "/videos/wp"

/** @typedef {"background" | "controls"} VideoProfile */

/** @type {Array<{ filename: string, url: string, profile: VideoProfile }>} */
export const WP_VIDEOS = [
  {
    filename: "pexels-life-of-pix-852286-1920x1080-60fps.mp4",
    url: "https://www.zofingen-treuhand.ch/wp-content/uploads/2023/04/pexels-life-of-pix-852286-1920x1080-60fps.mp4",
    profile: "background",
  },
  {
    filename: "5abf-42fd-9384-0edfee8ca4bb.mp4",
    url: "https://www.zofingen-treuhand.ch/wp-content/uploads/2024/11/5abf-42fd-9384-0edfee8ca4bb.mp4",
    profile: "controls",
  },
  {
    filename: "pexels-kelly-2430381-3840x2160-24fps.mp4",
    url: "https://www.zofingen-treuhand.ch/wp-content/uploads/2023/04/pexels-kelly-2430381-3840x2160-24fps.mp4",
    profile: "background",
  },
  {
    filename: "Firmengruendung-Video-1.mp4",
    url: "https://www.zofingen-treuhand.ch/wp-content/uploads/2023/09/Firmengruendung-Video-1.mp4",
    profile: "controls",
  },
]

export function vid(name) {
  return `${PUBLIC_PREFIX}/${name}`
}

export const HERO_VIDEO = vid("pexels-life-of-pix-852286-1920x1080-60fps.mp4")
export const CORPORATE_VIDEO = vid("5abf-42fd-9384-0edfee8ca4bb.mp4")
export const RELIABILITY_VIDEO = vid("pexels-kelly-2430381-3840x2160-24fps.mp4")
export const FIRMENGRUENDUNG_VIDEO = vid("Firmengruendung-Video-1.mp4")

export function scriptRoot() {
  return join(dirname(fileURLToPath(import.meta.url)), "..")
}

export function videosTempDir(root) {
  return join(root, "_scripts/_tmp/wp-videos")
}

export function videosPublicDir(root) {
  return join(root, "public/videos/wp")
}
