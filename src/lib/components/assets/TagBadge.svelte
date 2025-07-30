<script lang="ts">
  import { Tags } from "$lib/scripts/api/DBTypes";
  import { Badge } from "$shadcn/components/ui/badge";
  import { cn } from "$shadcn/utils";
  import { onMount } from "svelte";
  import type { ClassValue } from "svelte/elements";

  let { 
    tag,
    variant = "secondary",
    class: className,
    ...restProps
  } : { tag: Tags, variant?: "default" | "secondary" | "destructive" | "outline" | undefined, class?: ClassValue, restProps?: HTMLDivElement } = $props();

  let intClass: ClassValue = $state(``);
  $effect(() => {
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
      case Tags.FirstPersonCompatible:
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
  })
</script>

<div class="flex items-center justify-center p-0.5 rounded-lg {intClass}">
  <Badge {variant} class={className} {...restProps}>{tag}</Badge>
</div>

