import type { ClassValue } from "svelte/elements";
import { AssetFileFormat, Tags } from "../api/DBTypes";

export function getTagData(tag: Tags, assetType: AssetFileFormat): { category: string, outlineColor: ClassValue, disabled: boolean } {
  let splitType = assetType.split("_");
  let type = splitType[0];
  let format = splitType[1];
  let category: string = "General";
  let intClass: ClassValue = `bg-[#333333]`; // Default class
  let disabled = false;
  //#region colors
  switch (tag) {
    case Tags.CustomColors:
      intClass = `bg-linear-to-r from-[#ff3030] via-[#F0F] to-[#3702fF]`;
      break;
    case Tags.CustomTrails:
    case Tags.CustomBombs:
    case Tags.CustomArrows:
      intClass = `bg-linear-to-tr from-[#ff3030] via-[#FF0] to-[#00F0a7]`;
      break;
    case Tags.Pride:
      intClass = `bg-pride`;
      break;
    case Tags.NSFW:
      intClass = `bg-[#ff7f00]`;
      break;
    case Tags.FBT:
    case Tags.Cloth:
    case Tags.DynamicBones:
    case Tags.AudioLink:
    case Tags.Reactive:
    case Tags.Particles:
    case Tags.Shaders:
      intClass = `bg-[#33aaFF]`;
      break;
    case Tags.Hitsound:
    case Tags.BadHitsound:
    case Tags.MenuClick:
      intClass = `bg-[#FF33AA]`;
      break;

    case Tags.Meme:
    case Tags.Thin:
    case Tags.Large:
    case Tags.Acc:
    case Tags.Sword:
    case Tags.Simple:
    case Tags.VideoGame:
    case Tags.Animated:
    case Tags.Pro:
    case Tags.Underswing:
    case Tags.TimeDependence:
    case Tags.FirstPerson:
    case Tags.ThirdPerson:
      intClass = `bg-[#33FFAA]`;
      break;

    case Tags.Contest:
      intClass = `bg-[#3b397a]`;
      break;
    default:
      intClass = `bg-[#333333]`;
      break;
  }
  //#endregion colors

  // #region categories & disabled
  switch (tag) {
    case Tags.CustomColors:
    case Tags.CustomTrails:
    case Tags.CustomBombs:
    case Tags.CustomArrows:
    case Tags.NSFW:
    case Tags.FBT:
    case Tags.Cloth:
    case Tags.DynamicBones:
    case Tags.AudioLink:
    case Tags.Reactive:
    case Tags.Particles:
    case Tags.Shaders:
      category = "Features";
      break;
    case Tags.Hitsound:
    case Tags.BadHitsound:
    case Tags.MenuClick:
      category = "Sound";
      if (type !== `sound`) disabled = true;
      break;

    case Tags.FirstPerson:
    case Tags.ThirdPerson:
      if (type !== `camera2`) disabled = true;
      category = "General";
      break;

    case Tags.Contest:
      disabled = true;
      break;
    case Tags.Pride:
    case Tags.Meme:
    case Tags.Thin:
    case Tags.Large:
    case Tags.Acc:
    case Tags.Sword:
    case Tags.Simple:
    case Tags.VideoGame:
    case Tags.Animated:
    case Tags.Pro:
    case Tags.Underswing:
    case Tags.TimeDependence:
    default:
      category = "General";
      break;
  }
  // #endregion categories & disabled
  return {
    category,
    outlineColor: intClass,
    disabled,
  };
}

export function getAllTagsData(assetType: AssetFileFormat): { tag: Tags, data: ReturnType<typeof getTagData> }[] {
  return Object.values(Tags).map((tag) => ({
    tag,
    data: getTagData(tag, assetType),
  }));
}