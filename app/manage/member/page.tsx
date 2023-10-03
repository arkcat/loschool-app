import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export default async function Index() {
  const supabase = createServerComponentClient({ cookies })

  const {
    data: members
  } = await supabase.from("Member").select().order('id')

  return (
    <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="flex flex-col gap-8 text-foreground">
        <h2 className="text-lg font-bold text-center">
          Members
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {
            members?.map((member) => {
              let bgColor: string = member.primary_color
              let textColor: string = member.text_color
              return (
                <a
                  key={member.id}
                  className="relative flex flex-col group rounded-lg border p-6 hover:border-foreground"
                  target="_blank"
                  rel="noreferrer"
                  style={{ backgroundColor: bgColor, color: textColor }}
                >
                  <h3 className="font-bold mb-2  min-h-[40px] lg:min-h-[60px]">
                    {member.nick_name}
                  </h3>
                  <div className="flex flex-col grow gap-4 justify-between">
                    <p className="text-sm">{bgColor}</p>
                    <p className="text-sm">{textColor}</p>
                  </div>
                </a>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
