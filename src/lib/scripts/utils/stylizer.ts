import { AssetFileFormat, UserRole } from "../api/DBTypes";

export function stylizeAssetType(type: AssetFileFormat): string {
  switch (type) {
    case AssetFileFormat.Camera2Config_JSON:
      return ".json (Camera2)";
    case AssetFileFormat.ChromaEnv_JSON:
      return ".json (Chroma)";
    case AssetFileFormat.CountersPlusConfig_JSON:
      return ".json (Counters+)";
    case AssetFileFormat.HSVConfig_JSON:
      return ".json (HSV)";
    default:
      return `.${type.split('_')[1]}`;  // Default case for other formats
  }
}

export function getRoleData(role: string): {
  bgColor: string;
  textColor: string;
  text: string;
  value: UserRole| undefined;
} {
  switch (role) {
    case 'admin':
      return {
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        text: 'Admin',
        value: UserRole.Admin,
      }
    case 'developer':
      return {
        bgColor: 'bg-pink-500',
        textColor: 'text-white',
        text: 'Developer',
        value: UserRole.Developer,
      }
    case 'moderator':
      return {
        bgColor: 'bg-blue-500',
        textColor: 'text-black',
        text: 'Moderator',
        value: UserRole.Moderator,
      }
    case 'bsmg':
      return {
        bgColor: 'bg-[#3b397a]',
        textColor: 'text-white',
        text: 'BSMG Staff',
        value: UserRole.BSMG,
      }
    case 'trusted':
      return {
        bgColor: 'bg-[#59d8f0]',
        textColor: 'text-black',
        text: '3D Modeler',
        value: UserRole.Trusted,
      }
    default:
      return {
        bgColor: 'bg-gray-500',
        textColor: 'text-white',
        text: 'Unknown Role',
        value: undefined,
      }; // Default color for unknown roles
  }
}

export enum KnownSponsorUrls {
  Pixiv,
  Patreon,
  KoFi,

export function getSponserUrlData(sponsorUrl: string | string[] | null): {

}