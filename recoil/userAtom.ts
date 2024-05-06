import { Member } from "@/api/supabase";
import { atom } from "recoil";

export const userAtom = atom<Member>({
  key: "userAtom",
  default: {} as Member,
});

export default userAtom;
