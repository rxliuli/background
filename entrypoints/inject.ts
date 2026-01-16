import { removeBackgroundStyle, renderBackgroundStyle } from '@/lib/bg'
import { messager } from '@/lib/message'

export default defineUnlistedScript(async () => {
  const isBlacklisted = await messager.sendMessage(
    'isBlacklisted',
    location.host,
  )
  if (isBlacklisted) {
    removeBackgroundStyle()
    return
  }
  const bg = await messager.sendMessage('getBackground')
  if (bg) {
    renderBackgroundStyle(bg)
  }
})
