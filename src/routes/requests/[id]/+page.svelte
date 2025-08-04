<script lang="ts">
  import RequestMessage from '$lib/components/requests/RequestMessage.svelte';
  import type { UserPublicAPIv3 } from '$lib/scripts/api/DBTypes.js';
  import { fetchApi, fetchApiSafe } from '$lib/scripts/utils/api.js';
  import { onMount } from 'svelte';

  let { data } = $props();

  let users = $state<Map<string, {id: string, displayName:string, avatarUrl:string}>>(new Map());

  async function populateUsers() {
    let userIds = new Set<string>();
    data.pageData.messages.forEach(message => {
      if (message.userId && !users.has(message.userId) && message.userId !== data.user!.id) {
        userIds.add(message.userId);
      }
    });
    users.set(data.user!.id, data.user!);
    if (userIds.size > 0) {
      for (const userId of userIds) {
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

<div class="flex flex-col items-center justify-center">
  {#await populateUsers()}
    <p>Loading...</p>
  {:then}
    <p class="text-3xl font-semibold mb-4">Request Messages</p>
    {#each data.pageData.messages as message}
      <RequestMessage
        message={message}
        user={users.get(message.userId) || { id:"0", displayName: 'Unknown User', avatarUrl: '/default-avatar.png' }}
        class="w-full max-w-2xl mb-4"
      />
    {/each}
  {:catch error}
    <p class="text-red-500">Error loading messages: {error.message}</p>
  {/await}
</div>