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
      if (!tab?.url) {
        throw new Error('Not available')
      }
      const url = new URL(tab.url)
      const isBlacklisted = await messager.sendMessage(
        'isBlacklisted',
        url.host,
      )
      return {
        host: url.host,
        isBlacklisted,
      }
    },
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
        await messager.sendMessage('removeFromBlacklist', options.host)
      } else {
        await messager.sendMessage('addToBlacklist', options.host)
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
    <div className="flex items-center gap-2 p-3">
      <Switch
        id="enable"
        onCheckedChange={() => toggleBlacklistMutation.mutate()}
        checked={!hostQuery.data.isBlacklisted}
        disabled={toggleBlacklistMutation.isPending}
      />
      <Label htmlFor="enable" className="whitespace-nowrap">
        Enable on {hostQuery.data.host}
      </Label>
    </div>
  )
}
