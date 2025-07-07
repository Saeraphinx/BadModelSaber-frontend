<script lang="ts">
  import { AssetFileFormat, AssetType, Status, type AssetPublicAPI } from "$lib/api/DBTypes";
  import AssetCard from "$lib/components/browser/AssetCard.svelte";
  import Badge from "$shadcn/components/ui/badge/badge.svelte";
  import Button from "$shadcn/components/ui/button/button.svelte";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";

  let { data } = $props();
</script>

<div class="flex flex-col items-center w-[80%] m-auto max-w-6xl p-4 bg-accent rounded-2xl">
  <div class="flex flex-row w-full">
    <div class="flex flex-col items-center justify-center w-72">
      <img src="/testicon.png" alt="ModelSaber Logo" class="w-72 h-72 rounded-2xl" />
      <div class="">
        {#if data.data.status === Status.Approved}
          <Badge class="text-green-400">Approved</Badge>
        {:else if data.data.status === Status.Pending}
          <Badge class="text-yellow-400">Pending</Badge>
        {:else}
          <Badge class="text-red-400">Unverified</Badge>
        {/if}
      </div>
    </div>
    <div class="flex flex-col ml-4 mt-2">
      <span class="text-3xl font-bold">{data.data.name}</span>
      <span class="text-xl text-gray-500 dark:text-gray-400">{data.data.author.displayName}</span>
      <span class="text-lg text-gray-500 dark:text-gray-400">{data.data.description || "No description available."}</span>
    </div>
  </div>
</div>
