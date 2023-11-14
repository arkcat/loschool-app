import {
  LostArkCharacterData,
  fetchCharactersFromServer,
} from "@/utils/LostArkApiUtil";
import { CharacterData } from "@/lib/database.types";
import { supabase } from "@/utils/supabase";
import { NextResponse } from "next/server";

const updateCharacterInfo = async (
  id: number,
  className: string,
  classType: string,
  itemLevel: string
) => {
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

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Character")
      .select()
      .gt("id", 200000)
      .order("id");

    if (error) {
      throw error;
    }

    const characters = data as CharacterData[];

    let characterNames: string[] = characters.map((c) => c.char_name);

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

      const characterList = response as LostArkCharacterData[];
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
        const charInfo = ourServers.filter(
          (c) => c.CharacterName === char.char_name
        )[0];
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
  } catch (error) {
    console.error("에러 발생 : ", error);
    return NextResponse.json(
      { error: "Failed to update char info" },
      { status: 500 }
    );
  }
  return NextResponse.json({ message: "Update success" }, { status: 200 });
}
