'use client'

import { getBase64Text } from '@/utils/TextUtils';
import { supabase } from '@/utils/supabase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic'

export default function Index() {
  const router = useRouter()
  const [members, setMembers] = useState<any>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      const { data, error } = await supabase
        .from('Member')
        .select()
        .order('id');
      if (error) console.error('Error fetching members:', error);
      else setMembers(data);
    };

    fetchMembers();
  }, []);


  return (
    <div className="animate-in flex flex-col gap-14 opacity-0 max-w-4xl px-3 py-16 lg:py-24 text-foreground">
      <div className="w-full p-[1px] bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
      <div className="flex flex-col gap-8 text-foreground">
        <h2 className="text-lg font-bold text-center">
          Members
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-2">
          {members?.map((member: any) => {
            let bgColor: string = member.personal_color
            let textColor: string = member.text_color
            return (
              <a
                onClick={() => { router.push(`/members/details?id=${getBase64Text(String(member.id))}`) }}
                key={member.id}
                className="relative flex flex-col group rounded-lg border p-6 hover:border-foreground"
                target="_blank"
                rel="noreferrer"
                style={{ backgroundColor: bgColor, color: textColor }}
              >
                <h3 className="font-bold mb-2  min-h-[20px] lg:min-h-[30px]">
                  {member.nick_name}
                </h3>
                <div className="flex flex-col grow gap-1 justify-between">
                  <p className="text-sm">{bgColor}</p>
                  <p className="text-sm">{textColor}</p>
                  <p className="text-sm">{member.permission}</p>
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
