import { defineExtensionMessaging } from '@webext-core/messaging'

export const messager = defineExtensionMessaging<{
  // content => background
  getBackground(): Promise<string | undefined>

  // content,popup => background
  isBlacklisted(host: string): Promise<boolean>
  // popup => background
  addToBlacklist(host: string): Promise<void>
  // popup => background
  removeFromBlacklist(host: string): Promise<void>
}>()
