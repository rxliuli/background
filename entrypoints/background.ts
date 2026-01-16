import { get, set } from 'idb-keyval'
import { messager } from '@/lib/message'
import { getBackgroundImage, setBackgroundImage } from '@/lib/storage'

export default defineBackground(() => {
  messager.onMessage('getBackground', getBackgroundImage)

  browser.contextMenus.create({
    id: browser.runtime.id,
    title: 'Set as background',
    contexts: ['image'],
  })

  browser.contextMenus.onClicked.addListener(async (info, tab) => {
    if (info.menuItemId !== browser.runtime.id || !info.srcUrl) {
      return
    }

    try {
      const response = await fetch(info.srcUrl)
      const blob = await response.blob()
      const reader = new FileReader()
      reader.onload = async () => {
        const dataUrl = reader.result as string
        await setBackgroundImage(dataUrl)
        if (tab?.id) {
          await browser.tabs.sendMessage(tab.id, {
            type: 'backgroundUpdated',
            dataUrl,
          })
        }
      }
      reader.readAsDataURL(blob)
    } catch (error) {
      console.error('Failed to set background image:', error)
    }
  })

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
