import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export default async function Index() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: raids
  } = await supabase.from("Raid").select().order('id')

  console.log(raids)
  return (
    <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="flex flex-col gap-8 text-foreground">
        <h2 className="text-lg font-bold text-center">
          Raid
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {
            raids?.map((raid) => {
              return (
                <a
                  key={raid.id}
                  className="relative flex flex-col group rounded-lg border p-6 hover:border-foreground"
                  target="_blank"
                  rel="noreferrer"
                >
                  <h3 className="font-bold mb-2  min-h-[40px] lg:min-h-[60px]">
                    {raid.raid_name}
                  </h3>
                </a>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
