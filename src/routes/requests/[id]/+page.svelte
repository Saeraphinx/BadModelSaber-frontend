<script lang="ts">
  import AssetCard from '$lib/components/assets/AssetCard.svelte';
  import RequestCard from '$lib/components/requests/RequestCard.svelte';
  import RequestMessage from '$lib/components/requests/RequestMessage.svelte';
  import type { UserPublicAPIv3 } from '$lib/scripts/api/DBTypes.js';
  import { fetchApi } from '$lib/scripts/utils/api.js';
  import type { RequestMessage as ReqMessagge }  from '$lib/scripts/api/DBTypes.js';

  let { data } = $props();

  let users = $state<Map<string, {id: string, displayName:string, avatarUrl:string}>>(new Map());
  let messages: ReqMessagge[] = $state([{
    userId: `5`,
    message: `Beginning Message`,
    timestamp: new Date(data.pageData.createdAt)
  },
    ...data.pageData.messages
  ]);

  async function populateUsers() {
    let userIds = new Set<string>();
    console.log(data.pageData);
    data.pageData.messages.forEach(message => {
      if (message.userId && !users.has(message.userId) && message.userId !== data.user!.id) {
        userIds.add(message.userId);
      }
    });
    users.set(data.user!.id, data.user!);
    if (data.pageData.refrencedAsset && data.pageData.refrencedAsset.uploader && !users.has(data.pageData.refrencedAsset.uploader.id)) {
      users.set(data.pageData.refrencedAsset.uploader.id, data.pageData.refrencedAsset.uploader);
    }
    if (data.pageData.requesterId && !users.has(data.pageData.requesterId)) {
      userIds.add(data.pageData.requesterId);
    }
    if (userIds.size > 0) {
      for (const userId of userIds) {
        if (users.has(userId)) continue; // Skip if already fetched
        await fetchApi<UserPublicAPIv3>(`/users/${userId}`, {}, fetch)
          .then(res => users.set(userId, res.data))
          .catch(err => {
            console.error(`Failed to fetch user ${userId}:`, err);
            users.set(userId, { id: userId, displayName: userId, avatarUrl: '/default-avatar.png' });
          });
      }
    }
  }
</script>

<div class="flex flex-row items-start justify-center gap-4" data-sveltekit-preload-code="false">
  <div class="flex flex-col gap-2">
    {#if data.pageData.refrencedAsset}
      <AssetCard asset={data.pageData.refrencedAsset} size="large" />
    {/if}
    <div class="flex flex-col items-start gap-2 bg-card p-4 rounded-lg shadow-md w-full max-w-2xl">
      <h1 class="text-2xl font-bold">{data.pageData.requestType} Request</h1>
      <p class="text-gray-500">Request ID: {data.pageData.id}</p>
      <p class="text-gray-500">Status: {data.pageData.accepted}</p>
      <p class="text-gray-500">Created by: {users.get(data.pageData.requesterId)?.displayName || 'Unknown User'}</p>
      <p class="text-gray-500">Created at: {new Date(data.pageData.createdAt).toLocaleDateString()}</p>
    </div>
  </div>
  <div class="flex flex-col w-full max-w-2xl">
    {#await populateUsers()}
      <p>Loading...</p>
    {:then}
      {#each messages as message}
        <RequestMessage
          message={message}
          user={users.get(message.userId) || { id:"0", displayName: 'Unknown User', avatarUrl: '/default-avatar.png' }}
          class="w-full max-w-2xl mb-4"
        />
      {:else}
        <p class="text-muted-foreground">No messages found for this request.</p>
      {/each}
    {:catch error}
      <p class="text-red-500">Error loading messages: {error.message}</p>
    {/await}
  </div>
</div>