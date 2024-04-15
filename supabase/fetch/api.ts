import { getDayOfWeek } from "@/utils/DateUtils";
import { supabase } from "@/utils/supabase";

export const fetchMainComment = async () => {
  try {
    const { data, error } = await supabase
      .from("Member")
      .select("comment")
      .eq("id", 9999);

    if (error) {
      throw error;
    }

    if (data.length > 0) {
      console.log(data);
      return data[0].comment;
    }
  } catch (error: any) {
    console.error("코멘트 불러오기 오류 : ", error);
  }
};

export const fetchPartyData = async () => {
  // PartyData 가져오기
  const today = getDayOfWeek();
  if (today == 4) {
    //   setSubjug(true);
    return [];
  }
  const { data: partyData, error: partyError } = await supabase
    .from("Party")
    .select("*")
    .eq("day", today)
    .order("time");
  if (partyError) {
    console.error("Error fetching party data:", partyError);
    return [];
  }
  // RaidData 가져오기
  const { data: raidData, error: raidError } = await supabase
    .from("Raid")
    .select("*")
    .order("id");
  if (raidError) {
    console.error("Error fetching raid data:", raidError);
    return [];
  }
  // MemberData 가져오기
  const characterIds = partyData.flatMap((party) => party.member);
  const { data: characterData, error: characterError } = await supabase
    .from("Character")
    .select("*")
    .in("id", characterIds);
  if (characterError) {
    console.error("Error fetching character data:", characterError);
    return [];
  }
  // 조합된 데이터 생성
  const combinedData = partyData.map((party) => {
    const raid = raidData[party.raid_id];
    const members = characterData.filter((character) =>
      party.member.includes(character.id)
    );
    return {
      party,
      raid: raid,
      members: members,
    };
  });

  return combinedData;
};
