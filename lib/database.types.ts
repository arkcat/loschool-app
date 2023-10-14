export interface MemberData {
    id: number
    uid: string
    nick_name: string
    permission: string
    personal_color: string
    text_color: string
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
    raid_level: number
    raid_group: number[]
}

export interface PartyData {
    id: number
    raid_id: number
    day: number
    time: number
    member: string[]
}