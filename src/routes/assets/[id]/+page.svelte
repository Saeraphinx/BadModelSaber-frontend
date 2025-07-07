<script lang="ts">
  import { AssetFileFormat, AssetType, Status, type AssetPublicAPI } from "$lib/api/DBTypes";
  import AssetCard from "$lib/components/assets/AssetCard.svelte";
  import Badge from "$shadcn/components/ui/badge/badge.svelte";
  import Button from "$shadcn/components/ui/button/button.svelte";
  import * as Carousel from "$shadcn/components/ui/carousel/index.js";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";
  import { type CarouselAPI } from "$shadcn/components/ui/carousel/context.js";
  import { Car, ChevronLeftIcon, ChevronRightIcon, CircleDot, CircleIcon, DotIcon } from "@lucide/svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { page } from "$app/state";
  import Skeleton from "$shadcn/components/ui/skeleton/skeleton.svelte";

  let { data } = $props();

  let mobileView = new MediaQuery("min-width: 768px");
  let carouselApi = $state<CarouselAPI>();
  let currentIndex = $state<number>(0);

  // loading related
  let isRelatedLoading = $state<boolean>(true);
  let relatedAssets = $state<AssetPublicAPI[]>([]);
</script>

{#snippet dT_Regular(title = "Title", value = "", includeDiv = true)}
  {#if includeDiv}
    <div class="flex justify-between items-center">
      <span class="text-muted-foreground">{title}</span>
      <span class="font-medium text-primary">{value}</span>
    </div>
  {:else}
    <span class="text-muted-foreground">{title}</span>
    <span class="font-medium text-primary">{value}</span>
  {/if}
{/snippet}

{#snippet dT_SingleBadge(title: string = "Title", value: string = "", badgeVariant: "outline" | "default" | "secondary" | "destructive" = "outline")}
  <div class="flex justify-between items-center">
    <span class="text-muted-foreground">{title}</span>
    <Badge variant={badgeVariant} class="capitalize">{value}</Badge>
  </div>
{/snippet}

{#snippet dataTable()}
  <!-- Shows upload date, license, etc in a table format -->
  <div class="mt-4 w-full bg-card rounded-lg border border-border p-4">
    <div class="flex flex-col gap-3">
      {@render dT_Regular("Creator", `${data.pageData.author.displayName}`)}
      {@render dT_Regular("Uploaded", new Date(data.pageData.createdAt).toLocaleDateString())}
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
          <a href={data.pageData.sourceUrl} target="_blank" rel="noopener noreferrer" class="font-medium text-primary hover:underline"> View Source </a>
        </div>
      {/if}
    </div>
  </div>
{/snippet}

<div class="flex flex-col items-center w-[90%] m-auto max-w-6xl p-4 bg-accent rounded-2xl">
  <div class="flex flex-row w-full">
    <div class="flex flex-col items-center justify-center w-auto min-w-[40%] max-w-[50%]">
      <Carousel.Root
        setApi={(api) => {
          carouselApi = api;
          api?.on("scroll", () => {
            currentIndex = api.selectedScrollSnap() ?? 0;
            console.log("Current Index: ", currentIndex);
          });
        }}
        opts={{ loop: true }}>
        <Carousel.Content>
          {#each [1, 2, 3, 4] as icon}
            <Carousel.Item>
              <img src="/testicon.png" alt="ModelSaber Logo" class="w-full h-full rounded-2xl" />
            </Carousel.Item>
          {/each}
        </Carousel.Content>
        <div class="flex justify-between w-full mt-2">
          <Button variant="ghost" size="icon" onclick={() => carouselApi?.scrollPrev()}>
            <ChevronLeftIcon class="w-5 h-5" />
          </Button>
          {#each [1, 2, 3, 4] as icon, index}
            <Button variant="ghost" size="icon" onclick={() => carouselApi?.scrollTo(index)}>
              <span class="h-2 w-2 rounded-4xl transition-colors {currentIndex === index ? `bg-gray-400 dark:bg-gray-200` : `bg-gray-200 dark:bg-gray-500`}"></span>
            </Button>
          {/each}
          <Button variant="ghost" size="icon" onclick={() => carouselApi?.scrollNext()}>
            <ChevronRightIcon class="w-5 h-5" />
          </Button>
        </div>
      </Carousel.Root>
      {@render dataTable()}
    </div>
    <div class="flex flex-col ml-4 mt-2">
      <div class="flex flex-col">
        <span class="text-3xl font-bold">{data.pageData.name}</span>
        <span class="text-xl text-gray-500 dark:text-gray-400">{data.pageData.author.displayName}</span>
        <div class="flex flex-row gap-2 mt-4">
          <Button variant="default" href={`/assets/${data.pageData.id}`} class="">View Asset</Button>
          <Button variant="secondary" href={`/assets/${data.pageData.id}/download`} class="">Download</Button>
        </div>
        <Separator class="my-4 w-full" />
        <span class="text-lg text-gray-500 dark:text-gray-400">{data.pageData.description || "No description available."}</span>
        <Separator class="my-4 w-full" />
        <span class="text-lg font-semibold">Related Assets:</span>
        <Carousel.Root>
          <Carousel.Content>
            {#if isRelatedLoading}
              {#each data.pageData.linkedIds }
                <Carousel.Item class="basis-1/3">
                  <Skeleton class="bg-gray-400/20 w-48 h-48 rounded-2xl" />
                </Carousel.Item>
              {/each}
            {:else}
              {#each relatedAssets as asset}
                <Carousel.Item>
                  <AssetCard asset={asset} size="linked" />
                </Carousel.Item>
              {/each}
            {/if}
          </Carousel.Content>
          <Carousel.Next />
          <Carousel.Previous />
        </Carousel.Root>
      </div>
    </div>
  </div>
</div>
