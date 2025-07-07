<script lang="ts">
  import '../app.css';
  import * as NavigationMenu from "$shadcn/components/ui/navigation-menu/index.js";
  import * as DropdownMenu from '$shadcn/components/ui/dropdown-menu/index.js';
  import { getContext, onMount } from 'svelte';
  import Button from '$shadcn/components/ui/button/button.svelte';
  import * as Avatar from '$shadcn/components/ui/avatar';
  import { GitBranchIcon, LogIn, Menu, Settings } from '@lucide/svelte';
  import type { Orientation } from 'bits-ui';
  import { MediaQuery } from 'svelte/reactivity';
  import * as Popover from '$shadcn/components/ui/popover';
  import { page } from '$app/state';
  
  let { data, children } = $props();
  let theme: `system` | `light` | `dark` = $state('system');
  let showFullBar = new MediaQuery("min-width: 750px");

  // #region Theme
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
  // #endregion Theme

  const links = [
    { href: '/', label: 'Home' },
    { href: '/assets', label: 'Assets' },
    { href: 'https://bsmg.wiki/models', label: 'Model Wiki' },
    { href: '/about', label: 'PC Guide' },
    
  ];
</script>

{#snippet navbar_main(orientation="vertical")}
  <NavigationMenu.Root>
    <NavigationMenu.List class="flex {orientation === 'vertical' ? 'flex-col' : 'flex-row'}">
      {#each links as link}
        <NavigationMenu.Item>
          <NavigationMenu.Link href={link.href} class="text-base">
            {link.label}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {/each}
    </NavigationMenu.List>
  </NavigationMenu.Root>
{/snippet}

<!-- Page title & favicon -->
<svelte:head>
  <title>{page.data.pageMetadata?.title || `ModelSaber`}</title>
  <link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="flex w-auto flex-row text-base">
  <!-- Logo -->
  <div class="flex items-center justify-center h-16 {showFullBar.current ? `w-[18em] px-12` : `px-4`}">
    <span class="text-xl font-bold">ModelSaber</span>
  </div>
  <!-- Navigation Bar -->
  <div class="flex p-4 w-full justify-center">
  {#if showFullBar.current}
    {@render navbar_main("horizontal")}  
  {/if}
  </div>
  <!-- Right Side -->
  <div class="flex items-center justify-end h-16 {showFullBar.current ? `w-[18em] px-12` : `px-4`}">
    <!-- Hamburger menu for Small Screens -->
    {#if !showFullBar.current}
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="ghost" size="icon" class="text-base">
            <Menu />
          </Button>
        </Popover.Trigger>
        <Popover.Content class="w-auto">
          {@render navbar_main("vertical")}
        </Popover.Content>
      </Popover.Root>
    {/if}
    <!-- User Avatar or Login Button -->
    {#if data.user && data.user.id}
      <Avatar.Root>
        <Avatar.Image src={data.user.avatarUrl} alt={data.user.displayName} />
        <Avatar.Fallback>{data.user.displayName.charAt(0)}</Avatar.Fallback>
      </Avatar.Root>
    {:else}
      <Button variant="outline" class="text-base" href="/login">
          <LogIn />
          Login
      </Button>
    {/if}
  </div>
</div>

<div class="px-4 text-base text-foreground">
  {@render children()}
</div>

<div class="fixed left-4 bottom-4">
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <Button variant="secondary" size="icon" aria-label="Settings" class="fixed left-4 bottom-4">
        <Settings />
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