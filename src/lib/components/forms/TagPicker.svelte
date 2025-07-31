<script lang="ts">
  import { AssetFileFormat, type Tags } from "$lib/scripts/api/DBTypes";
  import { getAllTagsData } from "$lib/scripts/utils/tags";
  import { Button } from "$shadcn/components/ui/button";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";
  import { MinusIcon, PlusIcon } from "@lucide/svelte";
  import TagBadge from "../assets/TagBadge.svelte";

  let {
    type = AssetFileFormat.Note_Bloq,
    selectedTags = $bindable([] as Tags[]),
  } : {
    type?: AssetFileFormat;
    selectedTags?: Tags[];
  } = $props();

  let allTags = getAllTagsData(type);
  let filteredTags = $derived.by(() => {
    let tags: Map<string, Tags[]> = new Map();
    allTags.forEach(({ tag, data }) => {
      let existingArray = tags.get(data.category) || [];
      if (!existingArray.includes(tag)) {
        existingArray.push(tag);
      }
      tags.set(data.category, existingArray);
    });
    return tags
  });
</script>

<div>
  <div>
    <p class="text-sm font-semibold mb-2">Selected Tags</p>
    <div class="flex flex-wrap gap-2">
      {#each selectedTags as tag}
        <TagBadge {tag} />
      {/each}
    </div>  
    <Separator class="my-2" />
    {#each Array.from(filteredTags.entries()) as [category, tags]}
      <div class="mb-4">
        <p class="text-sm font-semibold mb-2">{category}</p>
        <div class="flex flex-wrap gap-2">
          {#each tags as tag}
            <button onclick={() => {
              if (selectedTags.includes(tag)) {
                selectedTags = selectedTags.filter(t => t !== tag);
              } else {
                selectedTags = [...selectedTags, tag];
              }
              }}>
              <TagBadge class="hover:bg-gray-600" {tag}>
                {#if !selectedTags.includes(tag)}
                  <PlusIcon />
                {:else}
                  <MinusIcon />
                {/if}
              </TagBadge>
            </button>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</div>

