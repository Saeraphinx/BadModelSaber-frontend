<script lang="ts">
  import Badge from '$shadcn/components/ui/badge/badge.svelte';
  import * as Tabs from '$shadcn/components/ui/tabs/index.js';

  let {data} = $props();
</script>

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
        <ul class="w-full max-w-2xl">
          {#each data.requests.outgoing as request}
            <li class="p-4 border-b last:border-b-0">
              <a href={`/requests/${request.id}`} class="text-blue-600 hover:underline">
                {request.requestType || request.id}
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-gray-500">You have no outgoing requests.</p>
      {/if}
    </Tabs.Content>
    <Tabs.Content value="incoming">
      {#if data.requests.incoming.length > 0}
        <ul class="w-full max-w-2xl">
          {#each data.requests.incoming as request}
            <li class="p-4 border-b last:border-b-0">
              <a href={`/requests/${request.id}`} class="text-blue-600 hover:underline">
                {request.requestType || request.id}
              </a>
            </li>
          {/each}
        </ul>
      {:else}
        <p class="text-gray-500">You have no incoming requests.</p>
      {/if}
    </Tabs.Content>
  </Tabs.Root>
</div>