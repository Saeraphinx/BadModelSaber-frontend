<script lang="ts">
  import { assets } from "$app/paths";
  import { Status, type AssetPublicAPI, type UserPublicAPI } from "$lib/scripts/api/DBTypes";
  import { Badge } from "$shadcn/components/ui/badge";
  import Button from "$shadcn/components/ui/button/button.svelte";
  import { BadgeAlert, BadgeCheck, BadgeX, Download, DownloadCloud, InfoIcon } from "@lucide/svelte";
  import ApprovalDialog from "./ApprovalDialog.svelte";

  let props: {
    asset: AssetPublicAPI;
    size?: "linked" | "normal" | "large";
    approvalDialog?: ApprovalDialog;
  } = $props();

  let sizeClasses = $derived.by(() => {
    switch (props.size) {
      case "linked":
        return "w-24 h-24";
      case "normal":
        return "w-48 h-48";
      case "large":
        return "w-64 h-64";
      default:
        return "w-48 h-48"; // Default to normal size
    }
  });
  let downloadUrl = `/files/${props.asset.fileHash}.${props.asset.fileFormat.split("_")[1].toLowerCase()}`;
</script>

<div class="relative {sizeClasses}">
  <!-- Image -->
  <div>
    <img src="/testicon.png" alt="ModelSaber Logo" class="{sizeClasses} mb-4 rounded-2xl" />
  </div>

  <!-- Card Overlay -->

  <div
    class="absolute top-0 left-0 w-full h-full opacity-0 focus:opacity-100 hover:opacity-100 transition-opacity duration-300"
    aria-label="Navigate to Asset Page"
    role="button"
    tabindex="-1"
    onkeydown={(e) => {
      if (e.currentTarget !== e.target) return; // Ensure click is on the overlay, not child elements
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        // Navigate to asset page
        window.location.href = `/assets/${props.asset.id}`;
      }
    }}
    onclick={(e) => {
      if (e.currentTarget !== e.target) return; // Ensure click is on the overlay, not child elements
      e.preventDefault();
      // Navigate to asset page
      window.location.href = `/assets/${props.asset.id}`;
    }}>
    <!-- Title Banner -->
    <div class="absolute top-0 left-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xs w-full rounded-t-2xl">
      <div class="p-2 pl-4 flex flex-col">
        <span class={props.size == `normal` ? `text-2xl` : `text-lg`}>{props.asset.name}</span>
        <a href="/user/{props.asset.author.id}" class="text-sm text-gray-500 dark:text-gray-400">{props.asset.author.displayName}</a>
      </div>
      <!-- <div class="flex flex-row flex-wrap pb-2 pl-4 gap-1">
        
      </div> -->
    </div>

    <!-- Buttons -->
    <div class="absolute flex bottom-2 right-2 hover:backdrop-blur-sm bg-white/20 dark:bg-gray-800/20 rounded-md">
      {#if props.approvalDialog}
        <Button variant="ghost" size="icon" title="Update Status" onclick={() => props.approvalDialog?.showDialog(props.asset.id, props.asset.name)}>
          <BadgeAlert />
        </Button>
      {/if}
      <Button variant="ghost" href="/assets/{props.asset.id}" size="icon" title="Goto Asset Page">
        <InfoIcon />
      </Button>
      <Button variant="ghost" href={downloadUrl} size="icon" title="Download">
        <Download />
      </Button>
      <Button variant="ghost" href="" size="icon" title="OneClick Install">
        <DownloadCloud />
      </Button>
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
</div>
