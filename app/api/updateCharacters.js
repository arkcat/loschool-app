import { fetchCharactersFromServer } from "@/utils/LostArkApiUtil";
import { supabase } from "@/utils/supabase";

const updateCharacterInfo = async (id, className, classType, itemLevel) => {
  try {
    const { data, error } = await supabase
      .from("Character")
      .update({
        char_class: className,
        char_type: classType,
        char_level: parseInt(itemLevel),
      })
      .eq("id", id);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error("캐릭터 정보 업데이트 에러 발생 : ", error);
  }
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { data, error } = await supabase
      .from("Character")
      .select()
      .gt("id", 200000)
      .order("id");

    if (error) {
      throw error;
    }

    const characters = data;

    let characterNames = characters.map((c) => c.char_name);

    let serverCallCount = 0;
    while (characterNames.length > 0) {
      const response = await fetchCharactersFromServer(characterNames[0]);
      console.log(`fetch call ${serverCallCount++} with ${characterNames[0]}`);
      if (!response) {
        console.error(`Can't find ${characterNames[0]}`);
        characterNames = characterNames.filter(
          (item) => item !== characterNames[0]
        );
        continue;
      }

      const characterList = response;
      const ourServers = characterList.filter(
        (character) => character.ServerName === "실리안"
      );

      if (ourServers.length === 0) {
        console.error(`Can't find in '실리안' ${characterNames[0]}`);
        characterNames = characterNames.filter(
          (item) => item !== characterNames[0]
        );
        continue;
      }

      characters.map((char) => {
        const charInfo = ourServers.find(
          (c) => c.CharacterName === char.char_name
        );
        if (charInfo) {
          characterNames = characterNames.filter(
            (item) => item !== char.char_name
          );
          const className = charInfo.CharacterClassName;
          let classType = "D";
          if (
            className === "바드" ||
            className === "홀리나이트" ||
            className === "도화가"
          ) {
            classType = "S";
          }
          const itemLevel = charInfo.ItemMaxLevel.replace(/[,]/g, "");
          updateCharacterInfo(char.id, className, classType, itemLevel);
        }
      });
    }

    console.log("캐릭터 정보 업데이트 완료");
    res.status(200).json({ message: "Update success" });
  } catch (error) {
    console.error("에러 발생 : ", error);
    res.status(500).json({ error: "Failed to update char info" });
  }
}
