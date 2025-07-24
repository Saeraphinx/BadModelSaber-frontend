<script lang="ts">
  import { page } from "$app/state";
  import * as Accordion from "$shadcn/components/ui/accordion";
  import { Button } from "$shadcn/components/ui/button";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";
  import { CodeXmlIcon, HomeIcon } from "@lucide/svelte";
  import { toast } from "svelte-sonner";

  let pageUserOmitted = $derived.by(() => {
    return {
      ...page,
      data: {
        ...page.data,
        user: {
          id: page.data.user?.id,
          displayName: page.data.user?.displayName,
          roles: page.data.user?.roles,
        },
      },
    };
  });
</script>

<div class="flex flex-col h-screen-nav overflow-auto items-center justify-center">
  <p class="text-3xl font-semibold mb-4">Error</p>
  {#if page.status === 404}
    <p class="text-lg text-muted-foreground mb-4">We couldn't find this page :(</p>
  {:else}
    <p class="text-lg text-muted-foreground mb-4">An unexpected error occurred :(</p>
  {/if}
  <div>
    <Button
      variant="outline"
      onclick={() => {
        navigator.clipboard.writeText(JSON.stringify(page, null, 2));
        toast.success("Debug info copied to clipboard", {
          description: "You can paste this in a GitHub issue or Discord for help. NOTE: This includes info about the current page & user data.",
        });
      }}>
      <CodeXmlIcon />
      Copy Debug Info
    </Button>
    <Button variant="default" class="ml-2" href="/" disabled={page.url.pathname === "/"}>
      <HomeIcon />
      Go to Home
    </Button>
  </div>
  <Separator class="my-4 w-full max-w-md" />
    <Accordion.Root type="single" class="w-full max-w-md" value="">
      <Accordion.Item value="item-1">
      <Accordion.Trigger>Debug Info</Accordion.Trigger>
      <Accordion.Content>
        <pre class="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-xs"><code>{JSON.stringify(pageUserOmitted, null, 2).trim()}</code></pre>
      </Accordion.Content>
      </Accordion.Item>
    </Accordion.Root>
</div>
