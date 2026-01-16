import { get, set, update } from 'idb-keyval'
import { messager } from '@/lib/message'
import { getBackgroundImage } from '@/lib/storage'
import { PublicPath } from 'wxt/browser'
import DefaultBlacklist from '@/lib/blacklist.json'

const BLACKLIST_KEY = 'blacklist'

async function getBlacklist(): Promise<string[]> {
  return (await get<string[]>(BLACKLIST_KEY)) ?? []
}

async function setBlacklist(list: string[]): Promise<void> {
  console.log('Setting blacklist to', list)
  await set(BLACKLIST_KEY, list)
  const [tab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })
  if (!tab?.id) {
    return
  }
  await updateContentScript()
  await browser.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['/inject.js'] as PublicPath[],
  })
}

export default defineBackground(() => {
  messager.onMessage('getBackground', getBackgroundImage)
  messager.onMessage('isBlacklisted', async ({ data: host }) => {
    const list = await getBlacklist()
    return list.includes(host)
  })
  messager.onMessage('addToBlacklist', async ({ data: host }) => {
    const list = await getBlacklist()
    if (!list.includes(host)) {
      await setBlacklist([...list, host])
    }
  })
  messager.onMessage('removeFromBlacklist', async ({ data: host }) => {
    const list = await getBlacklist()
    await setBlacklist(list.filter((h) => h !== host))
  })

  browser.runtime.onInstalled.addListener(async () => {
    await updateContentScript()
    if (import.meta.env.PROD && (await get('hasVisitedOptionsPage'))) {
      return
    }
    await browser.tabs.create({
      url: browser.runtime.getURL('/options.html'),
    })
    await set('hasVisitedOptionsPage', true)
  })
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
