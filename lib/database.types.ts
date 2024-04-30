
export const daysOfWeek = ['wed', 'thu', 'fri', 'sat', 'sun', 'mon', 'tue']
export const days = ['수', '목', '금', '토', '일', '월', '화']
export const timeSlots = ['14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '01', '02']

export interface MemberData {
    id: number
    uid: string
    nick_name: string
    permission: string
    personal_color: string
    text_color: string
    comment: string
    schedule_check: boolean
    schedule: {
        [day: string]: {
            [hour: string]: number
        }
    }
}

export interface CharacterData {
    id: number
    member_id: number
    char_name: string
    char_class: string
    char_type: string
    char_level: number
}

export interface RaidData {
    id: number
    raid_name: string
    raid_type: number
    short_name: string
    raid_color: string
    raid_level: number
    raid_group: number[]
}

export interface PartyData {
    id: number
    raid_id: number
    day: number
    time: number
    member: number[]
    real_raid_id: number
}

export interface PenaltyData {
    id: number
    name: string
    date: Date
}