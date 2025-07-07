<script lang="ts">
  import { AssetFileFormat, AssetType, Status, type AssetPublicAPI } from "$lib/api/DBTypes";
  import AssetCard from "$lib/components/assets/AssetCard.svelte";
  import * as Pagination from "$shadcn/components/ui/pagination";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";

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

<div class="flex flex-col items-center w-[90%] m-auto max-w-7xl p-4 rounded-2xl">
  <div class="flex flex-row flex-wrap justify-center gap-4">
    <AssetCard asset={dummyAssetData}/>
    <AssetCard asset={dummyAssetData}/>
    <AssetCard asset={dummyAssetData}/>
    <AssetCard asset={dummyAssetData}/>
  </div>
  <Separator class="my-4 w-full" />
  <Pagination.Root count={10} perPage={10}>
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