import {
  LostArkCharacterData,
  fetchCharactersFromServer,
} from "@/utils/LostArkApiUtil";
import { useState } from "react";
import { CharacterData } from "@/lib/database.types";
import { supabase } from "@/utils/supabase";

const [characters, setCharacters] = useState<CharacterData[]>([]);

const fetchCharactersData = async () => {
  try {
    const { data } = await supabase.from("Character").select().order("id");

    if (data) {
      setCharacters(data);
    }
  } catch (error) {
    console.error("에러 발생 : ", error);
  }
};

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

    setCharacters((prevCharacters) =>
      prevCharacters.map((character) =>
        character.id === id
          ? {
              ...character,
              char_class: className,
              char_type: classType,
              char_level: parseInt(itemLevel),
            }
          : character
      )
    );
  } catch (error) {
    console.error("캐릭터 정보 업데이트 에러 발생 : ", error);
  }
};

export const AllCharactersUpdate = async () => {
  try {
    fetchCharactersData();

    let otherAccountCharacters: string[] = characters.map((c) => c.char_name);

    while (otherAccountCharacters.length > 0) {
      const characterList = (await fetchCharactersFromServer(
        otherAccountCharacters[0]
      )) as LostArkCharacterData[];
      const ourServers = characterList.filter(
        (character) => character.ServerName === "실리안"
      );
      characters.map((char) => {
        const charInfo = ourServers.filter(
          (c) => c.CharacterName === char.char_name
        )[0];
        if (charInfo) {
          otherAccountCharacters = otherAccountCharacters.filter(
            (item) => item !== char.char_name
          );
          const className = charInfo.CharacterClassName;
          let classType = "D";
          if (
            className === "바드" ||
            className === "홀리나이트" ||
            className === "도화가"
          )
            classType = "S";
          const itemLevel = charInfo.ItemMaxLevel.replace(/[,]/g, "");
          updateCharacterInfo(char.id, className, classType, itemLevel);
        }
      });
    }

    alert("캐릭터 정보 업데이트 완료");
  } catch (error) {
    console.error("Error fetching posts:", error);
  }
};
