import { RaidData, CharacterData } from "@/lib/database.types";

const relatedRaidIds:{ [key: number]: number[] } = {
  40003: [40004],
  40004: [40003],
  40005: [40006],
  40006: [40005],
  40007: [40008, 40009],
  40008: [40007],
  40009: [40007],
  40010: [40011],
  40011: [40010],
  40012: [40013],
  40013: [40012],
};

export function checkRelatedRaid(
  raids: RaidData[],
  raidId: number,
  charId: number
): boolean {
  return raids.some(
    (raid) => raid.id === raidId && raid.raid_group.includes(charId)
  );
}

export function checkRaidDisabled(
  raids: RaidData[],
  raid: RaidData,
  char: CharacterData
): boolean {
  if (char.char_level < raid.raid_level) {
    return true;
  }

  const relatedRaid = relatedRaidIds[raid.id];
  const relRaid = Array.isArray(relatedRaid)
    ? relatedRaid.some((rId) => checkRelatedRaid(raids, rId, char.id))
    : relatedRaid && checkRelatedRaid(raids, relatedRaid, char.id);

  if (relRaid) {
    return true;
  }

  // Check for the specific case of raid 40008
  if (raid.id === 40008) {
    const raidFor2Week = checkRelatedRaid(raids, 40009, char.id);
    if (raidFor2Week) {
      return true;
    }
  }

  return false;
}
