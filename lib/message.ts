import { defineExtensionMessaging } from '@webext-core/messaging'

export const messager = defineExtensionMessaging<{
  getBackground(): Promise<string | undefined>
}>()
