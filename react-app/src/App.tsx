import DemoPayments from '@/app/payment/payments-demo'
import { ToggleTheme } from '@/components/commons/toggle-theme'

export default function App () {
  return (
    <main>
      <section className="container-wrapper py-20">
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
          <div className='bg-background p-10 rounded-lg border'>
            <DemoPayments />
          </div>
        </div>
      </section>
    </main>
  )
}
