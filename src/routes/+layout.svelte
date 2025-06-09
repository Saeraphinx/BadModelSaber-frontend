<script lang="ts">
  import '../app.css';
  import * as NavigationMenu from "$shadcn/components/ui/navigation-menu/index.js";
  import * as DropdownMenu from '$shadcn/components/ui/dropdown-menu/index.js';
  import { onMount } from 'svelte';
  import Button from '$shadcn/components/ui/button/button.svelte';
  import MdiCog from "~icons/mdi/cog"
  import * as Avatar from '$shadcn/components/ui/avatar';
  import type { Orientation } from 'bits-ui';
  import { MediaQuery } from 'svelte/reactivity';
  import * as Popover from '$shadcn/components/ui/popover';
  
  let { data, children } = $props();
  let theme: `system` | `light` | `dark` = $state('system');
  let showFullBar = new MediaQuery("min-width: 727px");

  onMount(() => {
    theme = localStorage.getItem('theme') as typeof theme || 'system';
    handleThemeChange();
  });

  function handleThemeChange() {
    if (theme === 'system') {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } else {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
    localStorage.setItem('theme', theme);
  }
</script>

{#snippet navbar_main(orientation="vertical")}
  <NavigationMenu.Root orientation="vertical">
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Link class="text-base" href="/">Home</NavigationMenu.Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link class="text-base" href="/about">About</NavigationMenu.Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link class="text-base" href="/contact">Contact</NavigationMenu.Link>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link class="text-base" href="/settings">Settings</NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
{/snippet}

<div class="flex w-auto flex-row">
  <div class="flex items-center justify-center h-16 {showFullBar.current ? `w-[20em] px-16` : `px-4`}">
    <span class="text-xl font-bold">ModelSaber</span>
  </div>
  <div class="flex p-4 w-full justify-center">
  {#if showFullBar.current}
    {@render navbar_main("horizontal")}  
  {/if}
  </div>
  <div class="flex items-center justify-end h-16 {showFullBar.current ? `w-[20em] px-16` : `px-4`}">
    {#if !showFullBar.current}
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="ghost" class="text-base">Search</Button>
        </Popover.Trigger>
        <Popover.Content class="w-[200px]">
          {@render navbar_main("vertical")}
        </Popover.Content>
      </Popover.Root>
    {/if}
    {#if data.user && data.user.id}
      <Avatar.Root>
        <Avatar.Image src={data.user.avatarUrl} alt={data.user.displayName} />
        <Avatar.Fallback>{data.user.displayName.charAt(0)}</Avatar.Fallback>
      </Avatar.Root>
    {:else}
      <Button variant="default" class="text-base" href="/login">
          Login with Discord
      </Button>
    {/if}
  </div>
</div>

<div class="px-4">
  {@render children()}
</div>

<div class="fixed left-4 bottom-4">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button variant="secondary" size="icon" aria-label="Settings" class="fixed left-4 bottom-4">
        <MdiCog class="text-2xl"/>
      </Button>
    </DropdownMenu.Trigger>
    <DropdownMenu.Content class="mb-8 ml-4">
      <DropdownMenu.RadioGroup bind:value={theme} onValueChange={handleThemeChange}>
        <DropdownMenu.Label>Theme</DropdownMenu.Label>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioItem closeOnSelect={false} value="system">System</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem closeOnSelect={false} value="dark">Dark</DropdownMenu.RadioItem>
        <DropdownMenu.RadioItem closeOnSelect={false} value="light">Light</DropdownMenu.RadioItem>
      </DropdownMenu.RadioGroup>
    </DropdownMenu.Content>
  </DropdownMenu.Root>
</div>