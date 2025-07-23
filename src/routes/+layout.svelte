<script lang="ts">
  import "../app.css";
  import * as NavigationMenu from "$shadcn/components/ui/navigation-menu/index.js";
  import * as DropdownMenu from "$shadcn/components/ui/dropdown-menu/index.js";
  import { getContext, onMount } from "svelte";
  import Button from "$shadcn/components/ui/button/button.svelte";
  import * as Avatar from "$shadcn/components/ui/avatar";
  import { BellIcon, FileBadgeIcon, GitBranchIcon, Link2Icon, LogIn, LogOutIcon, Menu, PlusIcon, Settings, SunIcon, UserIcon } from "@lucide/svelte";
  import type { Orientation } from "bits-ui";
  import { MediaQuery } from "svelte/reactivity";
  import * as Popover from "$shadcn/components/ui/popover";
  import { page } from "$app/state";
  import { Toaster } from "$shadcn/components/ui/sonner";
  import { env } from "$env/dynamic/public";
  import { UserRole } from "$lib/scripts/api/DBTypes";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";

  let { data, children } = $props();
  let theme: `system` | `light` | `dark` = $state("system");
  let showFullBar = new MediaQuery("min-width: 750px");
  let subMenuOpen = $state(false);

  // #region Theme
  onMount(() => {
    theme = (localStorage.getItem("theme") as typeof theme) || "system";
    handleThemeChange();
  });

  function handleThemeChange() {
    if (theme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } else {
      if (theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    localStorage.setItem("theme", theme);
  }
  // #endregion Theme

  const links = [
    { href: "/", label: "Home" },
    { href: "/assets", label: "Assets" },
    { href: "https://bsmg.wiki/models", label: "Model Wiki" },
    { href: "/about", label: "PC Guide" },
  ];
</script>

{#snippet navbar_main(orientation = "vertical")}
  <NavigationMenu.Root>
    <NavigationMenu.List class="flex {orientation === 'vertical' ? 'flex-col' : 'flex-row'}">
      {#each links as link}
        <NavigationMenu.Item>
          <NavigationMenu.Link href={link.href} class="text-base text-nowrap">
            {link.label}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      {/each}
    </NavigationMenu.List>
  </NavigationMenu.Root>
{/snippet}

{#snippet tiny_buttons()}
  <Button variant="ghost" href="/upload" size="icon">
    <PlusIcon />
  </Button>
  {#if data.user?.roles.includes(UserRole.Moderator)}
    <Button variant="ghost" href="/approval" size="icon">
      <FileBadgeIcon />
    </Button>
  {/if}
{/snippet}

<!-- Page title & favicon -->
<svelte:head>
  <title>{page.data.pageMetadata?.title || `ModelSaber`}</title>
  <link rel="icon" href="/favicon.png" />
</svelte:head>

<div class="flex w-auto flex-row text-base">
  <!-- Logo -->
  <div class="flex items-center justify-center h-16 {showFullBar.current ? `w-[18em] px-8` : `px-8`}">
    <span class="text-xl font-bold">ModelSaber</span>
  </div>
  <!-- Navigation Bar -->
  <div class="flex p-4 w-full justify-center">
    {#if showFullBar.current}
      {@render navbar_main("horizontal")}
    {/if}
  </div>
  <!-- Right Side -->
  <div class="flex items-center justify-end h-16 gap-4 {showFullBar.current ? `w-[18em] px-8` : `px-8`}">
    <!-- Hamburger menu for Small Screens -->
    {#if !showFullBar.current}
      <Popover.Root>
        <Popover.Trigger>
          <Button variant="ghost" size="icon" class="text-base">
            <Menu />
          </Button>
        </Popover.Trigger>
        <Popover.Content class="flex flex-col items-center justify-center w-auto">
            {@render navbar_main("vertical")}
            <Separator class="my-2 w-full" />
            <div class="flex flex-row gap-2">
              {@render tiny_buttons()}
            </div>
        </Popover.Content>
      </Popover.Root>
    {/if}
    <!-- User Avatar or Login Button -->
    {#if data.user && data.user.id}
      {#if showFullBar.current}
        <div class="flex items-center gap-1">
          {@render tiny_buttons()}
        </div>
      {/if}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <Avatar.Root>
            <Avatar.Image src={data.user.id} alt={data.user.displayName} />
            <Avatar.Fallback>{data.user.displayName}</Avatar.Fallback>
          </Avatar.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="mr-12">
          <DropdownMenu.Item>
            <UserIcon />
            Profile
          </DropdownMenu.Item>
          <DropdownMenu.Item>
            <BellIcon />
            Alerts
          </DropdownMenu.Item>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup bind:value={theme} onValueChange={handleThemeChange}>
            <DropdownMenu.Label>
              Theme
            </DropdownMenu.Label>
            <DropdownMenu.RadioItem closeOnSelect={false} value="system">System</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem closeOnSelect={false} value="dark">Dark</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem closeOnSelect={false} value="light">Light</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator />
          <a href="/logout">
            <DropdownMenu.Item >
              <LogOutIcon />
              Logout
            </DropdownMenu.Item>
          </a>
          <DropdownMenu.Separator />
          <DropdownMenu.Item class="pointer-events-none"><span class="text-[8px] text-gray-500">Commit: {env.PUBLIC_GIT_COMMIT || `Unknown`}</span></DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Root>
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

<Toaster
  richColors={true}
  position="top-right"
  toastOptions={{
    closeButton: true,
    duration: 5000,
    classes: {
      title: "font-bold",
    },
  }} />
