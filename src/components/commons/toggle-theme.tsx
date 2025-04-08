import React from 'react'
import { Switch } from '@/components/ui/switch'
import { MoonIcon, SunIcon } from 'lucide-react'

export function ToggleTheme () {
  const [darkTheme, setDarkTheme] = React.useState(true)

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', darkTheme)
    document.documentElement.style.colorScheme = darkTheme ? 'dark' : 'light'
    document.documentElement.setAttribute('data-theme', darkTheme ? 'dark' : 'light')
  }, [darkTheme])

  return (
    <div className='w-fit flex justify-center items-center gap-x-2'>
      <MoonIcon size='14' />
      <Switch
        id="mode-toggle"
        checked={!darkTheme}
        onCheckedChange={(dark) => setDarkTheme(!dark)}
      />
      <SunIcon size='14' />
    </div>
  )
}
