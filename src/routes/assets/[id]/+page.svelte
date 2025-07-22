<script lang="ts">
  import { AssetFileFormat, AssetType, Status, type AssetPublicAPIv3 } from "$lib/scripts/api/DBTypes.js";
  import AssetCard from "$lib/components/assets/AssetCard.svelte";
  import Badge from "$shadcn/components/ui/badge/badge.svelte";
  import Button from "$shadcn/components/ui/button/button.svelte";
  import * as Carousel from "$shadcn/components/ui/carousel/index.js";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";
  import { type CarouselAPI } from "$shadcn/components/ui/carousel/context.js";
  import { Car, ChevronLeftIcon, ChevronRightIcon, CircleDot, CircleIcon, CloudDownloadIcon, DotIcon, DownloadIcon, MegaphoneIcon } from "@lucide/svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { page } from "$app/state";
  import Skeleton from "$shadcn/components/ui/skeleton/skeleton.svelte";
  import CarouselNavigator from "$lib/components/generic/CarouselNavigator.svelte";
  import { getAssetThumbnailUrl, getAssetUrl } from "$lib/scripts/utils/api.js";

  let { data } = $props();

  let mobileView = new MediaQuery("min-width: 668px");
  let iconApi = $state<CarouselAPI>();
  let relatedApi = $state<CarouselAPI>();

  // loading related
  let isRelatedLoading = $state<boolean>(true);
  let relatedAssets = $state<AssetPublicAPIv3[]>([]);
</script>

{#snippet dT_Regular(title = "Title", value = "", includeDiv = true)}
  {#if includeDiv}
    <div class="flex justify-between items-center">
      <span class="text-muted-foreground pr-1">{title}</span>
      <span class="font-medium text-primary">{value}</span>
    </div>
  {:else}
    <span class="text-muted-foreground pr-1">{title}</span>
    <span class="font-medium text-primary">{value}</span>
  {/if}
{/snippet}

{#snippet dT_SingleBadge(title: string = "Title", value: string = "", badgeVariant: "outline" | "default" | "secondary" | "destructive" = "outline")}
  <div class="flex justify-between items-center">
    <span class="text-muted-foreground pr-2">{title}</span>
    <Badge variant={badgeVariant} class="capitalize">{value}</Badge>
  </div>
{/snippet}

{#snippet dataTable()}
  <!-- Shows upload date, license, etc in a table format -->
  <div class="mt-4 w-full bg-card rounded-lg border border-border p-4">
    <div class="flex flex-col gap-3">
      {@render dT_Regular("Creator", `${data.pageData.uploader.displayName}`)}
      {@render dT_Regular("Uploaded", new Date(data.pageData.createdAt).toLocaleString())}
      <div class="flex justify-between items-start">
        <span class="text-muted-foreground">Tags</span>
        <div class="flex flex-wrap gap-1 max-w-[200px] justify-end">
          {#each data.pageData.tags as tag}
            <Badge variant="secondary" class="text-xs">{tag}</Badge>
          {/each}
        </div>
      </div>
      {@render dT_SingleBadge(`Type`, data.pageData.type.replace("-", " "), "outline")}
      {@render dT_Regular("Format", data.pageData.fileFormat.toUpperCase())}
      {@render dT_Regular("File Size", `${(data.pageData.fileSize / 1024 / 1024).toFixed(2)} MB`)}
      {#if data.pageData.status !== Status.Approved}
        {@render dT_SingleBadge("Status", data.pageData.status, "destructive")}
      {:else}
        {@render dT_SingleBadge("Status", data.pageData.status, "default")}
      {/if}

      {#if data.pageData.license}
        <div class="flex justify-between items-center">
          <span class="text-muted-foreground">License</span>
          {#if data.pageData.licenseUrl}
            <a href={data.pageData.licenseUrl} target="_blank" rel="noopener noreferrer" class="font-medium text-primary hover:underline">
              {data.pageData.license}
            </a>
          {:else}
            <span class="font-medium">{data.pageData.license}</span>
          {/if}
        </div>
      {/if}
      {#if data.pageData.sourceUrl}
        <div class="flex justify-between items-center">
          <span class="text-muted-foreground">Source</span>
          <a href={data.pageData.sourceUrl} target="_blank" rel="noopener noreferrer" class="font-medium text-primary hover:underline">View Source</a>
        </div>
      {/if}
      {@render dT_Regular("File Hash", data.pageData.fileHash || "N/A")}
    </div>
  </div>
{/snippet}

{#snippet iconCarousel()}
  <Carousel.Root
    setApi={(api) => {
      iconApi = api;
    }}
    opts={{ loop: true }}>
    <Carousel.Content>
      {#each data.pageData.icons as icon}
        <Carousel.Item>
          <img src={`${getAssetThumbnailUrl(icon)}`} alt="ModelSaber Logo" class="w-full h-full rounded-2xl" />
        </Carousel.Item>
      {/each}
    </Carousel.Content>
    {#if iconApi}
      <CarouselNavigator api={iconApi} />
    {/if}
  </Carousel.Root>
{/snippet}

{#snippet assetCarousel(assets: AssetPublicAPIv3[], title = "Related Assets", ifNoFound = "No related assets found.")}
  <div class="w-full">
    <span class="text-lg font-semibold">{title}</span>
    {#if data.pageData.linkedIds.length === 0}
      <span class="text-gray-500 dark:text-gray-400 w-full py-8 text-center">{ifNoFound}</span>
    {:else}
      <Carousel.Root
        class="w-full"
        setApi={(api) => {
          relatedApi = api;
        }}
        opts={{ loop: true }}>
        <Carousel.Content class="-ml-4">
          {#if isRelatedLoading}
            {#each data.pageData.linkedIds}
              <Carousel.Item class="pl-4 basis-auto">
                <Skeleton class="bg-gray-400/20 w-48 h-48 rounded-2xl" />
              </Carousel.Item>
            {/each}
          {:else}
            {#each assets as asset}
              <Carousel.Item>
                <AssetCard {asset} size="linked" />
              </Carousel.Item>
            {/each}
          {/if}
        </Carousel.Content>
        {#if relatedApi}
          <CarouselNavigator api={relatedApi} showOnlyOne={true} />
        {/if}
      </Carousel.Root>
    {/if}
  </div>
{/snippet}

{#snippet buttons()}
  <Button variant="default" href={getAssetUrl(`unknown`)} disabled>
    <DownloadIcon />
    Download
  </Button>
  <Button variant="outline" href="" disabled>
    <CloudDownloadIcon />
    OneClick Install
  </Button>
  <Button variant="destructive" href="/assets/{data.pageData.id}/report" disabled>
    <MegaphoneIcon />
    Report
  </Button>
{/snippet}

<div class="flex flex-col items-center w-[90%] m-auto max-w-6xl p-4 bg-background rounded-2xl">
  {#if !mobileView.current}
    <!-- Mobile View -->
    <div class="flex flex-col items-center w-full">
      <span class="text-3xl font-bold">{data.pageData.name}</span>
      {@render iconCarousel()}
      <div class="flex flex-row gap-2 mt-4 flex-wrap justify-center">
        {@render buttons()}
      </div>
      <Separator class="my-2 w-full" />
      <span class="text-lg text-gray-500 dark:text-gray-400">{data.pageData.description || "No description available."}</span>
      <Separator class="my-2 w-full" />
      {@render assetCarousel(relatedAssets, "Related Assets:", "No related assets found.")}
      {@render dataTable()}
    </div>
  {:else}
    <!-- Desktop View -->
    <div class="flex flex-row w-full">
      <div class="flex flex-col items-center w-auto min-w-[40%] max-w-[50%]">
        {@render iconCarousel()}
        {@render dataTable()}
      </div>
      <div class="flex flex-col ml-4 mt-2 max-w-[60%]">
        <div class="flex flex-col">
          <!-- Title & Action Buttons? -->
          <span class="text-3xl font-bold">{data.pageData.name}</span>
          <div class="flex flex-row gap-2 mt-4">
            {@render buttons()}
          </div>
          <Separator class="my-4 w-full" />
          <!-- Description -->
          <span class="text-lg text-gray-500 dark:text-gray-400">{data.pageData.description || "No description available."}</span>
          <Separator class="my-4 w-full" />
          <!-- Related Assets -->
          {@render assetCarousel(relatedAssets, "Related Assets:", "No related assets found.")}
          <Separator class="my-4 w-full" />
          {@render assetCarousel([], `Other assets by ${data.pageData.uploader.displayName}:`, "No other assets found.")}
        </div>
      </div>
    </div>
  {/if}
</div>
