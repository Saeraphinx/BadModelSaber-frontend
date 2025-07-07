<script lang="ts">
  import Button from "$shadcn/components/ui/button/button.svelte";
  import * as Carousel from "$shadcn/components/ui/carousel/index.js";
  import { type CarouselAPI } from "$shadcn/components/ui/carousel/context.js";
  import { ChevronLeftIcon, ChevronRightIcon } from "@lucide/svelte";

  let {
    api,
  }: {
    api?: CarouselAPI;
  } = $props();

  let currentIndexes = $derived.by(() => api?.slidesInView() || []);
  let items = $derived.by(() => api?.slideNodes() || []);
</script>

<div class="flex justify-between w-full mt-2">
  <Button variant="ghost" size="icon" onclick={() => api?.scrollPrev()}>
    <ChevronLeftIcon class="w-5 h-5" />
  </Button>
  {#each items as idk, index}
    <Button variant="ghost" size="icon" onclick={() => api?.scrollTo(index)}>
      <span class="h-2 w-2 rounded-4xl transition-colors {currentIndexes.includes(index) ? `bg-gray-400 dark:bg-gray-200` : `bg-gray-200 dark:bg-gray-500`}"></span>
    </Button>
  {/each}
  <Button variant="ghost" size="icon" onclick={() => api?.scrollNext()}>
    <ChevronRightIcon class="w-5 h-5" />
  </Button>
</div>
