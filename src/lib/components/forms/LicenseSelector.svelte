<script lang="ts">
 import Check from "@lucide/svelte/icons/check";
 import ChevronsUpDown from "@lucide/svelte/icons/chevrons-up-down";
 import * as Command from "$shadcn/components/ui/command/index.js";
 import * as Popover from "$shadcn/components/ui/popover/index.js";
 import { Button } from "$shadcn/components/ui/button/index.js";
 import { cn } from "$shadcn/utils";
 import { tick } from "svelte";

 let { value = $bindable(""), id="license" } = $props();
 
 const licenses = [
    { label: "Creative Commons Zero v1.0 Universal", value: "cc0-1.0" },
    { label: "Creative Commons BY 4.0", value: "cc4.0-by" },
    { label: "Creative Commons BY-SA 4.0", value: "cc4.0-by-sa" },
    { label: "Creative Commons BY-ND 4.0", value: "cc4.0-by-nd" },
    { label: "Creative Commons BY-NC 4.0", value: "cc4.0-by-nc" },
    { label: "Creative Commons BY-NC-SA 4.0", value: "cc4.0-by-nc-sa" },
    { label: "Creative Commons BY-NC-ND 4.0", value: "cc4.0-by-nc-nd" },
    { label: "Custom...", value: "custom" }
 ];
 
 let open = $state(false);
 
 let selectedValue = $derived.by(() => licenses.find((f) => f.value === value)?.label ?? "Select a license...");
 
 // We want to refocus the trigger button when the user selects
 // an item from the list so users can continue navigating the
 // rest of the form with the keyboard.
 function closeAndFocusTrigger(triggerId: string) {
  open = false;
  tick().then(() => {
   document.getElementById(triggerId)?.focus();
  });
 }


</script>
 
<Popover.Root bind:open>
 <Popover.Trigger id={id}>
  <Button
   variant="outline"
   role="combobox"
   aria-expanded={open}
   class="justify-between w-[100%] text-left"
  >
   {selectedValue}
   <ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
  </Button>
 </Popover.Trigger>
 <Popover.Content class="p-0">
  <Command.Root>
   <Command.Input placeholder="Search framework..." />
   <Command.Empty>No framework found.</Command.Empty>
   <Command.Group>
    {#each licenses as license}
     <Command.Item
      value={license.value}
      onSelect={() => {
       value = license.value;
       closeAndFocusTrigger(id);
      }}
     >
      <Check
       class={cn(
        "mr-2 h-4 w-4",
        value !== license.value && "text-transparent"
       )}
      />
      {license.label}
     </Command.Item>
    {/each}
   </Command.Group>
  </Command.Root>
 </Popover.Content>
</Popover.Root>