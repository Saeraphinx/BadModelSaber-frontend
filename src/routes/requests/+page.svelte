<script lang="ts">
  import { type AssetRequestPublicAPIv3 } from '$lib/scripts/api/DBTypes.js';
  import Badge from '$shadcn/components/ui/badge/badge.svelte';
  import * as Tabs from '$shadcn/components/ui/tabs/index.js';

  let {data} = $props();
</script>

{#snippet requestCard(request: AssetRequestPublicAPIv3)}
<div class="p-4 border rounded-lg not-last:mb-2 shadow-sm hover:shadow-md transition-shadow">
  <a href={`/requests/${request.id}`} class="text-blue-600 hover:underline">
    {request.requestType || request.id}
  </a>
  <p class="text-sm text-gray-500 mt-1">Requested by {request.requesterId}</p>
  <p class="text-sm text-gray-500 mt-1">Created at: {new Date(request.createdAt).toLocaleDateString()}</p>
</div>
{/snippet}

<div class="flex flex-col items-center justify-center">
  <Tabs.Root value="incoming">
    <Tabs.List>
      <Tabs.Trigger value="outgoing">
        My Requests
        <Badge variant="outline">
          {data.requests.outgoing.length}
        </Badge>
      </Tabs.Trigger>
      <Tabs.Trigger value="incoming">
        Incoming Requests
        <Badge variant="outline">
          {data.requests.incoming.length}
        </Badge>
      </Tabs.Trigger>
    </Tabs.List>
    <Tabs.Content value="outgoing">
      {#if data.requests.outgoing.length > 0}
        <div class="w-full max-w-2xl">
          {#each data.requests.outgoing as request}
            {@render requestCard(request)}
          {/each}
        </div>
      {:else}
        <p class="text-gray-500">You have no outgoing requests.</p>
      {/if}
    </Tabs.Content>
    <Tabs.Content value="incoming">
      {#if data.requests.incoming.length > 0}
        <div class="w-full max-w-2xl">
          {#each data.requests.incoming as request}
            {@render requestCard(request)}
          {/each}
        </div>
      {:else}
        <p class="text-gray-500">You have no incoming requests.</p>
      {/if}
    </Tabs.Content>
  </Tabs.Root>
</div>