<script lang="ts">
  import { AlertType, type AlertPublicAPIv3 } from '$lib/scripts/api/DBTypes';
  import Button from '$shadcn/components/ui/button/button.svelte';
  import { cn } from '$shadcn/utils';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    alert,
    class: className,
    ...restProps
  }: {
    alert: AlertPublicAPIv3;
  } & HTMLAttributes<HTMLDivElement> = $props();

  let isVisible = $state(true);

  let bgColor = $derived.by(() => {
    switch (alert.type) {
      case AlertType.AssetApproved:
        return 'bg-green-800/20';
      case AlertType.AssetRejected:
        return 'bg-red-800/20';
      case AlertType.AssetRemoval:
        return 'bg-yellow-800/20';
      case AlertType.Request:
        return 'bg-blue-800/20';
      default:
        return 'bg-gray-800';
    }
  });
</script>

<div class={cn(`${bgColor} ${isVisible ? `` : `hidden`} rounded-xl p-4`,className)} {...restProps}>
  <div class="flex items-center justify-between">
    <span class="font-semibold">{alert.header}</span>
    <span class="text-sm text-gray-500">{new Date(alert.createdAt).toLocaleDateString()}</span>
  </div>
  <p class="mt-1 text-sm">{alert.message}</p>
  <div class="mt-2 flex justify-end">
    {#if alert.assetId}
      <Button href={`/assets/${alert.assetId}`}>
        View Asset
      </Button>
    {/if}
    {#if alert.requestId}
      <Button href={`/requests/${alert.requestId}`}>
        View Request
      </Button>
    {/if}
    {#if !alert.read}
    <Button variant="outline" onclick={() => {
      isVisible = false
    }}>
      Mark as Read
    </Button>
    {:else}
    <Button variant="destructive" onclick={() => {
      isVisible = false
    }}>
      Delete
    </Button>
    {/if}
  </div>
</div>
