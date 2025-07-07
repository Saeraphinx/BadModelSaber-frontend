<script lang="ts">
  import { AssetFileFormat, AssetType, Status, type AssetPublicAPI } from "$lib/api/DBTypes";
  import AssetCard from "$lib/components/browser/AssetCard.svelte";
  import * as Pagination from "$shadcn/components/ui/pagination";

  let dummyAssetData: AssetPublicAPI = {
      id: 1,
      name: `Asset 1`,
      oldId: null,
      linkedIds: [],
      type: AssetType.ChromaEnvironment,
      fileFormat: AssetFileFormat.JSON,
      author: {
        id: 'user123',
        username: `user1`,
        displayName: `User 1`,
        bio: null,
        sponsorUrl: null,
        roles: [],
        avatarUrl: null
      },
      description: '',
      tags: [],
      license: '',
      licenseUrl: null,
      sourceUrl: null,
      fileHash: '',
      fileSize: 0,
      status: Status.Private,
      statusHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
</script>

<div class="flex flex-col items-center w-[80%] m-auto max-w-6xl p-4 rounded-2xl">
  <AssetCard asset={dummyAssetData}/>
  <Pagination.Root count={100} perPage={10}>
  {#snippet children({ pages, currentPage })}
    <Pagination.Content>
      <Pagination.Item>
        <Pagination.PrevButton />
      </Pagination.Item>
      {#each pages as page (page.key)}
        {#if page.type === "ellipsis"}
          <Pagination.Item>
            <Pagination.Ellipsis />
          </Pagination.Item>
        {:else}
          <Pagination.Item>
            <Pagination.Link {page} isActive={currentPage === page.value}>
              {page.value}
            </Pagination.Link>
          </Pagination.Item>
        {/if}
      {/each}
      <Pagination.Item>
        <Pagination.NextButton />
      </Pagination.Item>
    </Pagination.Content>
  {/snippet}
</Pagination.Root>
</div>