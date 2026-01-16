import { get, set } from 'idb-keyval'
import { messager } from '@/lib/message'
import { getBackgroundImage } from '@/lib/storage'

export default defineBackground(() => {
  messager.onMessage('getBackground', getBackgroundImage)

  async function openOptionsPage() {
    await browser.tabs.create({
      url: browser.runtime.getURL('/options.html'),
    })
  }

  browser.runtime.onInstalled.addListener(async () => {
    if (import.meta.env.PROD && (await get('hasVisitedOptionsPage'))) {
      return
    }
    await openOptionsPage()
    await set('hasVisitedOptionsPage', true)
  })

  browser.action.onClicked.addListener(openOptionsPage)
})
