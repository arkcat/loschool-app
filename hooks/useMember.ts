import { Member, fetchMember } from "@/api/supabase";
import userAtom from "@/recoil/userAtom";
import { useRecoilState } from "recoil";

export default function useMember() {
  const [user, setUser] = useRecoilState<Member>(userAtom);
  const handleUpdateMember = async (uid: string) => {
    const member = await fetchMember(uid);
    setUser(member[0]);
  };
  return {
    user,
    setUser,
    handleUpdateMember,
  };
}
