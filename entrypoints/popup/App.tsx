import { messager } from '@/lib/message'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export function App() {
  const hostQuery = useQuery({
    queryKey: ['host'],
    queryFn: async () => {
      const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
      })
      if (!tab.id || !tab?.url) {
        throw new Error('Not available')
      }
      const url = new URL(tab.url)
      const isBlacklisted = await messager.sendMessage(
        'isBlacklisted',
        url.hostname,
      )
      return {
        tabId: tab.id,
        hostname: url.hostname,
        isBlacklisted,
      }
    },
    retry: false,
  })

  const toggleBlacklistMutation = useMutation({
    mutationKey: ['toggleBlacklist'],
    mutationFn: async () => {
      if (!hostQuery.data) {
        throw new Error('No host data')
      }
      const options = hostQuery.data
      console.log('Toggling blacklist for', options)
      if (options.isBlacklisted) {
        await messager.sendMessage('removeFromBlacklist', options)
      } else {
        await messager.sendMessage('addToBlacklist', options)
      }
      await hostQuery.refetch()
      console.log('Toggled blacklist for', options)
    },
  })

  if (hostQuery.isLoading) {
    return <div className="w-48 p-3 text-sm text-gray-500">Loading...</div>
  }

  if (!hostQuery.data) {
    return <div className="w-48 p-3 text-sm text-gray-500">Not available</div>
  }

  return (
    <div>
      <div className="flex items-center gap-2 p-3">
        <Switch
          id="enable"
          onCheckedChange={() => toggleBlacklistMutation.mutate()}
          checked={!hostQuery.data.isBlacklisted}
          disabled={toggleBlacklistMutation.isPending}
        />
        <Label htmlFor="enable" className="whitespace-nowrap">
          Enable on {hostQuery.data.hostname}
        </Label>
      </div>
      <div className="px-3 pb-3">
        <a
          href="#"
          className="text-sm text-blue-600 hover:underline"
          onClick={async (e) => {
            e.preventDefault()
            await browser.runtime.openOptionsPage()
          }}
        >
          Open Settings Page
        </a>
      </div>
    </div>
  )
}
