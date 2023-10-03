import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import SelectMember from '@/components/SelectMember'

export default async function Index() {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: members
  } = await supabase.from("Member").select().order('id')

  return (
    <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
            <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="flex flex-col gap-8 text-foreground">
        <div>
          <h3 className="font-bold mb-2  min-h-[40px] lg:min-h-[60px] text-3xl lg:text-4xl !leading-tight mx-auto max-w-xl text-center my-12">
            스케쥴
          </h3>
          <SelectMember members={members} />
        </div>
      </div>
    </div>
  )
}
