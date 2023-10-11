
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/utils/supabase'
import './planner.css'

interface PartyData {
  id: number
  raid_id: number
  day: number
  time: number
  member: string[]
}

const WeeklyPlan = () => {
  const [partyData, setPartyData] = useState<PartyData[]>([])

  useEffect(() => {
    const fetchPartyData = async () => {
      const { data, error } = await supabase.from('Party').select('*') // Party 테이블에서 데이터 가져오기
      if (error) {
        console.error('Error fetching party data:', error)
      } else {
        setPartyData(data as PartyData[])
      }
    }

    fetchPartyData()
  }, [])

  const generateWeeklyPlan = () => {
    const days = ['월', '화', '수', '목', '금', '토', '일']
    const timeSlots = ['13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '01', '02']
    const weeklyPlan = []

    for (let j = 13; j <= 26; j++) {
      const hourData = partyData.filter(party => party.time === j)
      const daySchedule = []
      for (let i = 0; i < 7; i++) {
        const dayData = hourData.filter(party => party.day === i)
        daySchedule.push({ day: days[i], parties: dayData })
      }
      weeklyPlan.push({ hour: j, schedule: daySchedule })
    }

    console.log(weeklyPlan)

    return (
      <div className="table-container">
        <table style={{ borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid black', textAlign: 'center' }}>요일</th>
              {days.map((day, index) => (
                <th key={index} style={{ border: '1px solid black', minWidth: '120px', textAlign: 'center'}}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody style={{ }}>
            {weeklyPlan.map((daySchedule, index) => (
              <tr key={index}>
                <td key={days[index]} style={{ border: '1px solid black', textAlign: 'center' }}>{timeSlots[index]}</td>
                {daySchedule.schedule.map(hourData => (
                  <td key={hourData.day} style={{ border: '1px solid black', textAlign: 'center' }}>
                    {hourData.parties.map(party => (
                      <div key={party.id} className='outlined'>
                        <div>
                          raid_id: {party.raid_id}, id: {party.id}
                        </div>
                        {party.member.map((member, index) => (
                          <div key={index}>{member}</div>
                        ))}
                      </div>
                    ))}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div style={{ padding: '12px' }}>
      <h1>Weekly Plan</h1>
      {generateWeeklyPlan()}
    </div>
  )
}

export default WeeklyPlan