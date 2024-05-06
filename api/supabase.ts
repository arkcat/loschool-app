import { supabase } from "@/utils/supabase";

export interface Member {
  comment: string;
  id: number;
  nick_name: string;
  permission: string;
  personal_color: string;
  schedule: Object;
  schedule_check: boolean;
  text_color: string;
  uid: string;
}

export const fetchMember = async (uid: string) => {
  try {
    const { data, error } = await supabase
      .from("Member")
      .select()
      .eq("uid", uid);

    return data as Member[];
  } catch {
    throw new Error("Error updating member:");
  }
};

export const logout = async () => {
  try {
    await supabase.auth.signOut();
  } catch {
    throw new Error("Error logging out:");
  }
};

export const fetchSessionId = async () => {
  try {
    const authSession = supabase.auth.getSession();
    const currentSession = (await authSession).data.session;
    return currentSession?.user.id;
  } catch {
    throw new Error("Error getting session:");
  }
};
