<script lang="ts">
  import { Status, Tags, UserRole, type AssetPublicAPIv3 } from "$lib/scripts/api/DBTypes.js";
  import AssetCard from "$lib/components/assets/AssetCard.svelte";
  import Badge from "$shadcn/components/ui/badge/badge.svelte";
  import Button from "$shadcn/components/ui/button/button.svelte";
  import * as Carousel from "$shadcn/components/ui/carousel/index.js";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";
  import { type CarouselAPI } from "$shadcn/components/ui/carousel/context.js";
  import { BadgeAlert, Car, ChevronLeftIcon, ChevronRightIcon, CircleDot, CircleIcon, CloudDownloadIcon, DotIcon, DownloadIcon, Edit, MegaphoneIcon } from "@lucide/svelte";
  import { MediaQuery } from "svelte/reactivity";
  import { page } from "$app/state";
  import Skeleton from "$shadcn/components/ui/skeleton/skeleton.svelte";
  import CarouselNavigator from "$lib/components/generic/CarouselNavigator.svelte";
  import { fetchApiSafe, getAssetThumbnailUrl, getAssetUrl } from "$lib/scripts/utils/api.js";
  import ApprovalPopup from "$lib/components/assets/ApprovalDialog.svelte";
  import { onMount } from "svelte";
  import { toast } from "svelte-sonner";
  import { getAssetTypeData } from "$lib/scripts/utils/stylizer";
  import TagBadge from "$lib/components/assets/TagBadge.svelte";
  import Input from "$shadcn/components/ui/input/input.svelte";
  import Textarea from "$shadcn/components/ui/textarea/textarea.svelte";

  let { data } = $props();
  const asset = data.pageData;
  const typeData = getAssetTypeData(asset.type);

  let mobileView = new MediaQuery("min-width: 700px");
  let iconApi = $state<CarouselAPI>();
  let relatedApi = $state<CarouselAPI>();
  let authorApi = $state<CarouselAPI>();
  let dialog: ApprovalPopup;

  //#region Editing
  let allowedToEdit = $derived.by(() => {
    if (!data.user) return false;
    if (data.user.roles.includes(UserRole.Admin)) return true;
    if (data.user.roles.includes(UserRole.Moderator)) return true;
    if (data.pageData.uploader.id === data.user.id) return true;
    return false;
  });
  let isEditing = $state<boolean>(true);
  let editName = $state<string>(asset.name);
  let editDescription = $state<string>(asset.description || "");
  let editTags = $state<Tags[]>(asset.tags as Tags[] || []);
  //#endregion

  // #region Loading
  let isRelatedLoading = $state<boolean>(true);
  let relatedAssets = $state<AssetPublicAPIv3[]>([]);
  let isAuthorLoading = $state<boolean>(true);
  let authorAssets = $state<AssetPublicAPIv3[]>([]);

  onMount(async () => {
    if (asset.linkedIds.length > 0) {
      fetchApiSafe<{ [key: string]: AssetPublicAPIv3 }>(`/multi/assets?id=${data.pageData.linkedIds.slice(0, 20).join("&id=")}`, {}, data.fetch).then((res) => {
        if (res.isError) {
          toast.error(`Failed to load related assets: ${res.message}`);
          isRelatedLoading = false;
          return;
        } else {
          relatedAssets = res.data ? Object.values(res.data) : [];
          isRelatedLoading = false;
        }
      });
    } else {
      isRelatedLoading = false;
    }
    fetchApiSafe<{ assets: AssetPublicAPIv3[] }>(`/users/${data.pageData.uploader.id}/assets?limit=10`, {}, data.fetch).then((res) => {
      if (res.isError) {
        toast.error(`Failed to load author's assets: ${res.message}`);
        isAuthorLoading = false;
        return;
      } else {
        authorAssets = res.data?.assets.filter(i => i.id !== asset.id) || [];
        isAuthorLoading = false;
      }
    });
  });
  // #endregion
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
      <div class="flex justify-between items-center">
        <span class="text-muted-foreground">Uploaded By</span>
        <a href="/users/{data.pageData.uploader.id}" class="font-medium text-primary hover:underline">{data.pageData.uploader.displayName}</a>
      </div>
      <div class="flex justify-between items-start">
        <span class="text-muted-foreground">Tags</span>
        <div class="flex flex-wrap gap-1 max-w-[200px] justify-end">
          {#each data.pageData.tags as tag}
            <TagBadge tag={tag as Tags} />
          {/each}
        </div>
      </div>
      {@render dT_Regular(`Type`, typeData.combinedString)}
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
      {@render dT_Regular("Uploaded", new Date(data.pageData.createdAt).toLocaleString())}
      {@render dT_Regular("Last Updated", new Date(data.pageData.updatedAt).toLocaleString())}
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

{#snippet assetCarousel(assets: AssetPublicAPIv3[], isLoading: boolean, apiType: `author` | `related`, title = "Related Assets", ifNoFound = "No related assets found.", guessNumber = 5)}
  <div class="w-full">
    <span class="text-lg font-semibold">{title}</span>
    {#if assets.length === 0 && !isLoading}
      <span class="text-gray-500 dark:text-gray-400 w-full py-8 text-center">{ifNoFound}</span>
    {:else}
      <Carousel.Root
        class="w-full"
        setApi={(api) => {
          if (apiType === "related") {
            relatedApi = api;
          } else if (apiType === "author") {
            authorApi = api;
          }
        }}
        opts={{ loop: true }}>
        <Carousel.Content class="-ml-4">
          {#if isLoading}
            {#each { length: guessNumber }}
              <Carousel.Item class="pl-4 basis-auto">
                <Skeleton class="bg-gray-400/20 w-48 h-48 rounded-2xl" />
              </Carousel.Item>
            {/each}
          {:else}
            {#each assets as asset}
              <Carousel.Item class="pl-4 basis-auto">
                <AssetCard {asset} size="normal" />
              </Carousel.Item>
            {/each}
          {/if}
        </Carousel.Content>
        {#if apiType === "related" && relatedApi}
          <CarouselNavigator api={relatedApi} showOnlyOne={true} />
        {:else if apiType === "author" && authorApi}
          <CarouselNavigator api={authorApi} showOnlyOne={true} />
        {/if}
      </Carousel.Root>
    {/if}
  </div>
{/snippet}

{#snippet buttons()}
  {#if !isEditing}
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
    {#if data.user && data.user.roles.includes(UserRole.Moderator)}
      <Button
        variant="secondary"
        onclick={() => {
          dialog?.showDialog(data.pageData.id, data.pageData.name);
        }}>
        <BadgeAlert />
        Approval Dialog
      </Button>
    {/if}
  {/if}
  {#if allowedToEdit}
    {#if isEditing}
        <Button variant="default">
          Submit
        </Button>
        <Button variant="secondary" onclick={() => {
          isEditing = !isEditing;
          editName = asset.name;
          editDescription = asset.description || "";
          editTags = asset.tags as Tags[] || [];
        }}>
          Discard Changes
        </Button>
    {:else}
      <Button variant="secondary" onclick={() => {
        isEditing = !isEditing;
      }}>
        <Edit />
        Edit
      </Button>
    {/if}
  {/if}
{/snippet}

<div class="flex flex-col items-center w-[90%] m-auto max-w-6xl p-4 bg-background rounded-2xl">
  {#if !mobileView.current}
    <!-- Mobile View -->
    <div class="flex flex-col items-center w-full">
      {#if isEditing}
        <Input type="text" bind:value={editName} placeholder="Asset Name" class="w-full mb-2" />
      {:else}
        <span class="text-3xl font-bold my-2">{data.pageData.name}</span>
      {/if}
      {@render iconCarousel()}
      <div class="flex flex-row gap-2 mt-4 flex-wrap justify-center">
        {@render buttons()}
      </div>
      <Separator class="my-2 w-full" />
      <span class="text-lg text-gray-500 dark:text-gray-400">{data.pageData.description || "No description available."}</span>
      <Separator class="my-2 w-full" />
      {@render assetCarousel(relatedAssets, isRelatedLoading, `related`, "Related Assets:", "No related assets found.")}
      <Separator class="my-4 w-full" />
          {@render assetCarousel(authorAssets, isAuthorLoading, `author`, `Other assets by ${data.pageData.uploader.displayName}:`, "No other assets found.")}
      <Separator class="my-4 w-full" />
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
          {#if isEditing}
            <Input type="text" bind:value={editName} placeholder="Asset Name" class="w-full mb-2" />
          {:else}
            <span class="text-3xl font-bold">{data.pageData.name}</span>
          {/if}
          <div class="flex flex-row gap-2 mt-4 flex-wrap">
        {@render buttons()}
      </div>
          <Separator class="my-4 w-full" />
          <!-- Description -->
          {#if isEditing}
            <Textarea bind:value={editDescription} placeholder="Asset Description" class="w-full mb-2 min-h-64" />
          {:else}
            <span class="text-lg text-gray-500 dark:text-gray-400">{data.pageData.description || "No description available."}</span>
          {/if}
          <Separator class="my-4 w-full" />
          <!-- Related Assets -->
          {@render assetCarousel(relatedAssets, isRelatedLoading, `related`, "Related Assets:", "No related assets found.")}
          <Separator class="my-4 w-full" />
          {@render assetCarousel(authorAssets, isAuthorLoading, `author`, `Other assets by ${data.pageData.uploader.displayName}:`, "No other assets found.")}
        </div>
      </div>
    </div>
  {/if}
</div>

<ApprovalPopup bind:this={dialog} />
