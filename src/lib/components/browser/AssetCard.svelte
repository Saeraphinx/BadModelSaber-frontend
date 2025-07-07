<script lang="ts">
  import { Status, type AssetPublicAPI, type UserPublicAPI } from "$lib/api/DBTypes";
  import { Badge } from "$shadcn/components/ui/badge";
  import Button from "$shadcn/components/ui/button/button.svelte";
  import { BadgeAlert, BadgeCheck, BadgeX, Check, Computer, Download, DownloadCloud, Headset, X } from "@lucide/svelte";

  let props: {
    asset: AssetPublicAPI;
  } = $props();
</script>

<div class="relative w-64 h-64">
  <!-- Image -->
  <div>
      <img src="/testicon.png" alt="ModelSaber Logo" class="w-64 h-64 mb-4 rounded-2xl" />
  </div>

  <!-- Title -->
  <div class="absolute top-0 left-0 w-full h-full opacity-0 hover:opacity-100 transition-opacity duration-300">
    <div class="absolute top-0 left-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs w-full rounded-t-2xl">
      <div class="p-2 pl-4 flex flex-col">
        <span class="text-2xl">{props.asset.name}</span>
        <a href="/user/{props.asset.author.id}" class="text-sm text-gray-500 dark:text-gray-400">{props.asset.author.displayName}</a>
      </div>
      <!-- <div class="flex flex-row flex-wrap pb-2 pl-4 gap-1">
        
      </div> -->
    </div>
  </div>

  <!-- Status -->
  <div class="absolute top-0 right-0 p-3 pointer-events-none">
    {#if props.asset.status === Status.Approved}
      <BadgeCheck class="text-green-400" />
    {:else if props.asset.status === Status.Pending}
      <BadgeAlert class="text-yellow-400" />
    {:else}
      <BadgeX class="text-red-400" />
    {/if}
  </div>

  <!-- Buttons -->
  <div class="absolute flex bottom-2 right-2 hover:backdrop-blur-sm bg-white/20 dark:bg-gray-800/20 rounded-md">
    <Button variant="ghost" href="" size="icon" title="Download" aria-label="Download">
      <Download />
    </Button>
    <Button variant="ghost" href="" size="icon" title="OneClick Install" aria-label="OneClick Install">
      <DownloadCloud />
    </Button>
  </div>
</div>
