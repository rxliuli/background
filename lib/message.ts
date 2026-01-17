import { defineExtensionMessaging } from '@webext-core/messaging'

export const messager = defineExtensionMessaging<{
  // content => background
  getBackground(): Promise<string | undefined>

  // content,popup => background
  isBlacklisted(options: string): Promise<boolean>
  // popup => background
  addToBlacklist(options: { hostname: string; tabId: number }): Promise<void>
  // popup => background
  removeFromBlacklist(options: {
    hostname: string
    tabId: number
  }): Promise<void>
}>()
