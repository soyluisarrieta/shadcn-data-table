import DemoPayments from '@/app/payment/payments-demo'
import { ToggleTheme } from '@/components/toggle-theme'
import { ExternalLinkIcon } from 'lucide-react'

export default function App () {
  return (
    <main>
      <section className="container-wrapper py-20 flex flex-col items-center">
        <div className="relative">
          <a target="__blank" className="group relative mb-8 inline-block cursor-pointer rounded-full bg-border p-px text-xs leading-6 font-semibold text-foreground shadow-sm dark:shadow-none shadow-amber-900/20" href="https://github.com/soyluisarrieta/shadcn-data-table">
            <span className="absolute inset-0 overflow-hidden rounded-full">
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-400/0 via-amber-400/90 to-amber-400/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
            </span>
            <div className="relative z-10 flex items-center space-x-2 rounded-full bg-background px-4 py-0.5 ring-1 ring-white/10">
              <span>🚧 Work in Process</span>
              <ExternalLinkIcon size={12} />
            </div>
            <span className="absolute -bottom-0 left-1/2 -translate-x-1/2 h-px w-1/2 bg-gradient-to-r from-amber-400/0 via-amber-400/90 to-amber-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
          </a>
        </div>
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-950 to-neutral-700 dark:from-neutral-50 dark:to-neutral-400 bg-opacity-50">
          Shadcn Data Table
        </h1>
        <p className="mt-4 mb-10 font-normal text-base text-muted-foreground max-w-lg text-center mx-auto">
          A data table with filters, easy implementation, customization, and responsive design based on Shadcn components.
        </p>
      </section>
      <section>
        <div className="border-y border-dashed">
          <div className='container-wrapper p-6 text-center flex justify-between'>
            <a className='flex items-center gap-2 w-fit text-muted-foreground font-light text-sm tracking-wide' href="https://github.com/soyluisarrieta/shadcn-data-table" target='_blank'>
              @soyluisarrieta/shadcn-data-table
              <div className='w-px h-6 mx-2 border-r border-muted' />
              <img
                className='h-5 object-contain mt-0.5'
                src='https://img.shields.io/github/stars/soyluisarrieta/shadcn-datatable.svg?style=social&label=Stars&maxAge=2592000'
                alt='GitHub stars'
              />
            </a>

            <ToggleTheme />
          </div>
        </div>

        <div className="container-wrapper p-6">
          <div className='bg-background p-4 md:p-10 rounded-lg border'>
            <DemoPayments />
          </div>
        </div>
      </section>
    </main>
  )
}
