import { renderBackgroundStyle } from '@/lib/bg'
import { messager } from '@/lib/message'

export default defineContentScript({
  matches: ['<all_urls>'],
  runAt: 'document_start',
  async main() {
    const bg = await messager.sendMessage('getBackground')
    if (bg) {
      renderBackgroundStyle(bg)
    }

    browser.runtime.onMessage.addListener((message) => {
      if (message.type === 'backgroundUpdated' && message.dataUrl) {
        renderBackgroundStyle(message.dataUrl)
      }
    })
  },
})
