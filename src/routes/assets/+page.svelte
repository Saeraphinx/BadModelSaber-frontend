<script lang="ts">
  import { AssetFileFormat, AssetType, Status, type AssetPublicAPI } from "$lib/api/DBTypes";
  import AssetCard from "$lib/components/assets/AssetCard.svelte";
  import * as RadioGroup from "$shadcn/components/ui/radio-group/index.js";
  import * as Pagination from "$shadcn/components/ui/pagination";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";
  import * as Tabs from "$shadcn/components/ui/tabs/index.js";
  import { ChevronLeft, ChevronRight, Radio } from "@lucide/svelte";
  import { Label } from "$shadcn/components/ui/label";
  import { Checkbox } from "$shadcn/components/ui/checkbox/index.js";
  import Input from "$shadcn/components/ui/input/input.svelte";
  import { DropdownMenu } from "$shadcn/components/ui/dropdown-menu";
  import * as Select from "$shadcn/components/ui/select/index.js";
  import Button from "$shadcn/components/ui/button/button.svelte";

  let dummyAssetData: AssetPublicAPI = {
    id: 1,
    name: `Asset 1`,
    oldId: null,
    linkedIds: [],
    type: AssetType.ChromaEnvironment,
    fileFormat: AssetFileFormat.JSON,
    author: {
      id: "user123",
      username: `user1`,
      displayName: `User 1`,
      bio: null,
      sponsorUrl: null,
      roles: [],
      avatarUrl: null,
    },
    description: "",
    tags: [],
    license: "",
    licenseUrl: null,
    sourceUrl: null,
    fileHash: "",
    fileSize: 0,
    status: Status.Private,
    statusHistory: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  let currentTab = $state("account");
  let assetTypes = Object.values(AssetType).map((type) => ({
    value: type,
    label: type.replaceAll(`-`, ` `),
  }));
  let assetFileFormats = Object.values(AssetFileFormat).map((format) => ({
    value: format,
    label: format.split(`_`)[1],
  }));
  let selectedAssetType = $state<AssetType | null>(null);
  let selectedFileFormats = $state<AssetFileFormat[]>([]);
  let selectedPageSizeString = $state(`24`);
  let selectedPageSize = $derived(Number(selectedPageSizeString));
  let currentPage = $state(1);
</script>

{#snippet pagination()}
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
{/snippet}

{#snippet miniPagination()}
  <div class="flex flex-row items-center">
    <Button variant="outline" size="icon" onclick={() => currentPage > 1 ? currentPage-- : null}>
      <ChevronLeft class="h-4 w-4" />
    </Button>
    <span class="text-sm whitespace-nowrap mx-2">{(currentPage - 1) * selectedPageSize + 1}-{selectedPageSize * currentPage} of 123456789</span>
    <Button variant="outline" size="icon" onclick={() => currentPage++}>
      <ChevronRight class="h-4 w-4" />
    </Button>
  </div>
{/snippet}

<div class="flex flex-col items-center w-[90%] m-auto max-w-7xl p-4 rounded-2xl">
  <div class="flex flex-row">
    <!-- Filter Area -->
    <div class="flex flex-col items-start mb-4 mr-4 min-w-3xs">
      <!-- Type Filter -->
      <div class="flex flex-col bg-accent rounded-2xl w-full p-4 pt-2">
        <span class="text-lg mb-2 font-semibold">Type</span>
        <RadioGroup.Root value="option-one">
          {#each assetTypes as type}
            <div class="flex items-center space-x-2 capitalize">
              <RadioGroup.Item value={type.value} id={type.value} />
              <Label for={type.value}>{type.label}</Label>
            </div>
          {/each}
        </RadioGroup.Root>
      </div>
      <!-- File Format Filter -->
      <div class="flex flex-col bg-accent rounded-2xl w-full p-4 pt-2 mt-4">
        <span class="text-lg mb-2 font-semibold">File Format</span>
        {#each assetFileFormats as format}
          <div class="flex items-center space-x-2 py-1 capitalize">
            <Checkbox
              onchange={(e) => {
                if (e.currentTarget.value) {
                  selectedFileFormats.push(format.value);
                } else {
                  selectedFileFormats = selectedFileFormats.filter((f) => f !== format.value);
                }
              }}
              value={format.value}
              id={format.value} />
            <Label for={format.value}>{format.label}</Label>
          </div>
        {/each}
      </div>
    </div>
    <!-- Content -->
    <div class="flex flex-col items-center w-full">
      <!-- Top Bar -->
      <div class="flex flex-col bg-accent rounded-2xl w-full p-4 pt-2 mb-4">
        <Label for="asset-search" class="sr-only">Search</Label>
        <Input type="text" placeholder="Search assets..." class="w-full mt-2" id="asset-search" />
        <div class="flex flex-row mt-2">
          <div class="flex w-full items-center">
            <Select.Root allowDeselect={false} bind:value={selectedPageSizeString} type="single" onValueChange={(value) => currentPage = 1}>
              <Select.Trigger class="w-32">Page Size: {selectedPageSizeString}</Select.Trigger>
              <Select.Content>
                {#each [24, 48, 72] as amount}
                  <Select.Item value={amount.toString()}>
                    {amount} per page
                  </Select.Item>
                {/each}
              </Select.Content>
            </Select.Root>
          </div>
          <div class="flex-1 flex justify-end">
            {@render miniPagination()}
          </div>
        </div>
      </div>
      <!-- Cards -->
      <div class="flex flex-row flex-wrap justify-center gap-4">
        <AssetCard asset={dummyAssetData} />
        <AssetCard asset={dummyAssetData} />
        <AssetCard asset={dummyAssetData} />
        <AssetCard asset={dummyAssetData} />
      </div>
      <Separator class="my-4 w-full" />
      {@render pagination()}
    </div>
  </div>
</div>
