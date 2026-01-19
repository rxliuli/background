import { get, set, update } from 'idb-keyval'
import { messager } from '@/lib/message'
import { getBackgroundImage } from '@/lib/storage'
import { PublicPath } from 'wxt/browser'
import DefaultBlacklist from '@/lib/blacklist.json'

const BLACKLIST_KEY = 'blacklist'

async function getBlacklist(): Promise<string[]> {
  return (await get<string[]>(BLACKLIST_KEY)) ?? []
}

async function setBlacklist(list: string[], tabId: number): Promise<void> {
  console.log('Setting blacklist to', list)
  await set(BLACKLIST_KEY, list)
  await updateContentScript()
  await browser.scripting.executeScript({
    target: { tabId },
    files: ['/inject.js'] as PublicPath[],
  })
}

export default defineBackground(() => {
  messager.onMessage('getBackground', getBackgroundImage)
  messager.onMessage('isBlacklisted', async ({ data: host }) => {
    const list = await getBlacklist()
    return list.includes(host)
  })
  messager.onMessage('addToBlacklist', async (ev) => {
    const list = await getBlacklist()
    if (!list.includes(ev.data.hostname)) {
      await setBlacklist([...list, ev.data.hostname], ev.data.tabId)
    }
  })
  messager.onMessage('removeFromBlacklist', async (ev) => {
    const list = await getBlacklist()
    await setBlacklist(
      list.filter((h) => h !== ev.data.hostname),
      ev.data.tabId,
    )
  })

  browser.runtime.onInstalled.addListener(async () => {
    await updateContentScript()
    if (import.meta.env.PROD && (await get('hasVisitedOptionsPage'))) {
      return
    }
    await browser.runtime.openOptionsPage()
    await set('hasVisitedOptionsPage', true)
  })
  browser.runtime.onStartup.addListener(updateContentScript)
})

async function updateContentScript() {
  const hosts = [...new Set([...DefaultBlacklist, ...(await getBlacklist())])]
  console.log('Updating content script', hosts)
  const scripts = await browser.scripting.getRegisteredContentScripts()
  if (scripts.length > 0) {
    await browser.scripting.unregisterContentScripts({
      ids: scripts.map((s) => s.id),
    })
  }
  await browser.scripting.registerContentScripts([
    {
      id: 'content-script',
      js: ['/inject.js'] as PublicPath[],
      matches: ['<all_urls>'],
      excludeMatches: hosts.map((host) => `*://${host}/*`),
      runAt: 'document_start',
    },
  ])
}
