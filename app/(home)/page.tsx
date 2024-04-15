import { fetchMainComment, fetchPartyData } from "@/supabase/fetch/api";
import Main from "./Main";

export default async function Index() {
  const mainComment = await fetchMainComment();
  const raidList = await fetchPartyData();

  return <Main mainComment={mainComment} raidList={raidList} />;
}
