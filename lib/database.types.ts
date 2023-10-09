export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json }
    | Json[]

export interface Database {
    public: {
        Tables: {
            Member: {
                Row: {
                    id: number
                    uid: string
                    permission: string
                    nick_name: string
                    personal_color: string
                    text_color: string
                    schedule: Json | null
                }
            },
            Party: {
                Row: {
                    id: number
                    raid_id: number
                    day: number
                    time: number
                    member: string[]
                }
            }
        }
    }
}