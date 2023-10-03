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
                    nick_name: string
                    primary_color: string
                    text_color: string
                    schedule: Json | null
                }
            }
        }
    }
}