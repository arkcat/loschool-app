import axios from "axios";

const apiUrl = 'https://developer-lostark.game.onstove.com/characters/'
const bearerToken = process.env.LOSTARK_API_PRIVATE_KEY

export interface LostArkCharacterData {
    "ServerName": string,
    "CharacterName": string,
    "CharacterLevel": 0,
    "CharacterClassName": string,
    "ItemAvgLevel": string,
    "ItemMaxLevel": string
}

export const fetchCharactersFromServer = async (characterName: string) => {
    try {
        const url = apiUrl + characterName + '/siblings'
        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${bearerToken}`
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
}