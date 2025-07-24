<script lang="ts">
  import UserCard from '$lib/components/users/UserCard.svelte';
  import { getRoleData } from '$lib/scripts/utils/stylizer.js';
  import { Badge } from '$shadcn/components/ui/badge';
  import { Button } from '$shadcn/components/ui/button';

  let { data } = $props();
</script>

<div class="flex flex-col items-center mx-4">
  <div class="flex flex-row gap-4">
    <UserCard user={data.pageData} class="min-w-92"/>
    <div class="flex flex-col bg-accent p-4 rounded-lg w-full">
      <p class="text-base">{data.pageData.bio}</p>
      {#if data.pageData.sponsorUrl}
        <Button variant="outline" class="mt-4" href={data.pageData.sponsorUrl} target="_blank">
          Patreon
        </Button>
      {/if}
    </div>
  </div>
</div>