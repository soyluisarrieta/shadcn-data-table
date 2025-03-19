import PaymentsDemo from '@/app/payment/payments-demo'
import { GridBackground, Spotlight } from '@/components/spotlight'
import { useTheme } from '@/components/theme-provider'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MoonIcon, SunIcon } from 'lucide-react'

export default function App () {
  const { setTheme, theme } = useTheme()

  return (
    <>
      <div className="w-full min-h-dvh bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
        <GridBackground />
        <Spotlight />
        <div className="max-w-6xl mx-auto p-4 relative z-10 w-full">
          <header className='pt-20 pb-7'>
            <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
              Shadcn Data Table
            </h1>
            <p className="mt-4 mb-10 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
              A data table with filters, easy implementation, customization, and responsive design based on Shadcn components.
            </p>
          </header>

          <main>
            <div className='text-center py-7 flex justify-between dark'>
              <a className='flex items-center gap-2 w-fit text-muted-foreground font-light text-sm tracking-wide' href="https://github.com/soyluisarrieta/shadcn-data-table" target='_blank'>
                @soyluisarrieta/shadcn-data-table
                <div className='w-px h-6 mx-2 border-r border-muted' />
                <img
                  className='h-5 object-contain mt-0.5'
                  src='https://img.shields.io/github/stars/soyluisarrieta/shadcn-datatable.svg?style=social&label=Stars&maxAge=2592000'
                  alt='GitHub stars'
                />
              </a>

              <div className="w-fit flex justify-center items-center space-x-2">
                <Label htmlFor="mode-toggle"><SunIcon color='white' size='14' /></Label>
                <Switch
                  id="mode-toggle"
                  checked={theme === 'dark'}
                  onCheckedChange={(checked: boolean) => setTheme(checked ? 'dark' : 'light')}
                />
                <Label htmlFor="mode-toggle"><MoonIcon color='white' size='14' /></Label>
              </div>
            </div>

            <div className='bg-background p-10 rounded-lg border outline outline-white/20 dark:outline-white/10 outline-offset-12'>
              <PaymentsDemo />
            </div>
          </main>
        </div>
      </div>
    </>
  )
}
