<script lang="ts">
  import { AlertType, type AlertPublicAPIv3 } from '$lib/scripts/api/DBTypes';
  import { fetchApi } from '$lib/scripts/utils/api';
  import Button from '$shadcn/components/ui/button/button.svelte';
  import { cn } from '$shadcn/utils';
  import { toast } from 'svelte-sonner';
  import type { HTMLAttributes } from 'svelte/elements';

  let {
    alert,
    showRead = $bindable(false),
    class: className,
    ...restProps
  }: {
    alert: AlertPublicAPIv3;
    showRead?: boolean;
  } & HTMLAttributes<HTMLDivElement> = $props();

  let isVisible = $state(true);

  let bgColor = $derived.by(() => {
    switch (alert.type) {
      case AlertType.RequestAccepted:
      case AlertType.AssetApproved:
        return 'bg-green-800/20';
      case AlertType.AssetRejected:
        return 'bg-red-800/20';
      case AlertType.RequestDeclined:
      case AlertType.AssetRemoval:
        return 'bg-yellow-800/20';
      default:
        return 'bg-gray-800';
    }
  });

  function markRead() {
    isVisible = false;
    fetchApi(`/alerts/${alert.id}/read`, {
      method: 'POST',
    }).catch((error) => {
      console.error('Failed to mark alert as read:', error);
      toast.error('Failed to mark alert as read.', {
        description: error.message,
      });
    });
  }
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
      if (!showRead) {
        isVisible = false;
      }
      markRead();
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
