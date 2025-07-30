<script lang="ts">
  import "../app.css";
  import * as NavigationMenu from "$shadcn/components/ui/navigation-menu/index.js";
  import * as DropdownMenu from "$shadcn/components/ui/dropdown-menu/index.js";
  import { getContext, onMount, setContext } from "svelte";
  import Button, { buttonVariants } from "$shadcn/components/ui/button/button.svelte";
  import * as Avatar from "$shadcn/components/ui/avatar";
  import { BellDotIcon, BellIcon, FileBadgeIcon, GitBranchIcon, Link2Icon, LogIn, LogOutIcon, Menu, PlusIcon, Settings, SunIcon, TrafficConeIcon, UserIcon } from "@lucide/svelte";
  import type { Orientation } from "bits-ui";
  import { MediaQuery } from "svelte/reactivity";
  import * as Popover from "$shadcn/components/ui/popover";
  import { page } from "$app/state";
  import { Toaster } from "$shadcn/components/ui/sonner";
  import { toast, type ExternalToast } from "svelte-sonner";
  import { env } from "$env/dynamic/public";
  import { UserRole } from "$lib/scripts/api/DBTypes";
  import Separator from "$shadcn/components/ui/separator/separator.svelte";
  import { Badge } from "$shadcn/components/ui/badge";
  import * as Sheet from "$shadcn/components/ui/sheet";
  import Alert from "$lib/components/generic/Alert.svelte";
  import * as Tabs from "$shadcn/components/ui/tabs";
  import { Switch } from "$shadcn/components/ui/switch";
  import { Label } from "$shadcn/components/ui/label";
  import ScrollArea from "$shadcn/components/ui/scroll-area/scroll-area.svelte";
  import { fetchApi } from "$lib/scripts/utils/api";
  import { invalidate, invalidateAll } from "$app/navigation";

  let { data, children } = $props();
  let theme: `system` | `light` | `dark` = $state("system");
  let showFullBar = new MediaQuery("min-width: 750px");
  let pendingAlerts = $derived(data.alerts.length > 0);
  let openAlerts = $state(false);

  // #region KonamiListener
  onMount(() => {
    if (data.user && data.user.id && data.user.roles.includes(UserRole.Banned)) return;
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

    let inputSequence: string[] = [];

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.repeat) return; // Ignore repeated key presses
      if (!konamiCode.includes(event.key)) {
        inputSequence = []; // Reset if an invalid key is pressed
        return;
      }

      inputSequence.push(event.key);
      if (inputSequence.length > konamiCode.length) {
        inputSequence.shift();
      }

      if (inputSequence.join("") === konamiCode.join("")) {
        if (!data.user || !data.user.id || data.user.roles.includes(UserRole.Banned)) {
          toast.error("You must be logged in to activate this feature.", {
            duration: 5000,
            closeButton: true,
            dismissable: true,
          });
          return;
        }
        if (data.user.roles.includes(UserRole.Secret)) {
          toast.info("You have already activated the secret features.", {
            description: "If you want to disable them, disable them in your user settings.",
            duration: 5000,
            closeButton: true,
            dismissable: true,
          });
          return;
        }
        inputSequence = []; // Reset the sequence after activation
        toast.info("Secret features unlocked!", {
          description:
            "If you enable these features, you will be able to access hidden content and features on ModelSaber. ModelSaber is not responsible for any damage caused by this content.",
          duration: 60000,
          dismissable: true,
          action: {
            label: "Enable",
            onClick: () => {
              fetchApi("/konami/add", {
                method: "POST",
              })
                .then(() => {
                  toast.success("Secret features enabled!", {
                    description: "You can now access hidden content and features on ModelSaber. Use responsibly!",
                    closeButton: true,
                  });
                  invalidateAll(); // Refresh user data to reflect new roles
                })
                .catch((error) => {
                  toast.error("Failed to enable secret features.", {
                    description: error.message,
                  });
                });
              console.log("Secret features enabled!");
            },
          },
        });
        //console.log("Konami Code activated!");
      }
    };

    document.addEventListener("keydown", handleKeydown);

    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  });

  function removeSecret() {
    fetchApi("/konami/remove", {
      method: "POST",
    })
      .then(() => {
        toast.info("Secret features disabled!", {
          description: "Access to hidden content and features has been revoked.",
        });
        invalidateAll(); // Refresh user data
      })
      .catch((error) => {
        toast.error("Failed to disable secret features.", {
          description: error.message,
        });
      });
  }
  // #endregion KonamiListener

  // #region Toasts
  // Alert count toast
  onMount(() => {
    if (pendingAlerts) {
      toast.info(`You have ${data.alerts.length} unread alert${data.alerts.length == 1 ? `` : `s`}.`, {
        description: "",
        duration: 10000,
        closeButton: true,
        dismissable: true,
        action: {
          label: "View",
          onClick: () => {
            openAlerts = true;
          },
        },
      });
    }
  });

  // Layout Error Toasts
  onMount(() => {
    for (const pendingToast of data.pendingToasts || []) {
      let options: ExternalToast = {
        description: pendingToast.description,
        closeButton: true,
        dismissable: true,
      };
      if (pendingToast.type === "info") {
        toast.info(pendingToast.title, options);
      } else if (pendingToast.type === "success") {
        toast.success(pendingToast.title, options);
      } else if (pendingToast.type === "error") {
        toast.error(pendingToast.title, options);
      }
    }
  });
  // #endregion Toasts

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
  <div class="flex items-center justify-end h-16 gap-4 {showFullBar.current ? `w-[18em] px-8` : `px-8`}">
    <!-- Hamburger menu for Small Screens -->
    {#if !showFullBar.current}
      <Popover.Root>
        <Popover.Trigger>
          {#snippet child()}
            <Button variant="ghost" size="icon" class="text-base">
              <Menu />
            </Button>
          {/snippet}
        </Popover.Trigger>
        <Popover.Content class="flex flex-col items-center justify-center w-auto">
          {@render navbar_main("vertical")}
          <Separator class="my-2 w-full" />
        </Popover.Content>
      </Popover.Root>
    {/if}
    <!-- User Avatar or Login Button -->
    {#if data.user && data.user.id}
      <DropdownMenu.Root>
        <DropdownMenu.Trigger class="p-2 rounded-full hover:bg-accent transition-colors duration-300">
          <Avatar.Root>
            <Avatar.Image src={data.user.avatarUrl} alt={data.user.displayName} />
            <Avatar.Fallback>{data.user.displayName}</Avatar.Fallback>
          </Avatar.Root>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content class="mr-12 flex flex-col">
          <a href="/users/me">
            <DropdownMenu.Item>
              <UserIcon />
              Profile
            </DropdownMenu.Item>
          </a>
          <button onclick={() => (openAlerts = true)}>
            <DropdownMenu.Item>
              <BellIcon />
              Alerts
              {#if pendingAlerts}
                <Badge class="ml-1" variant="destructive">
                  {data.alerts.length}
                </Badge>
              {/if}
            </DropdownMenu.Item>
          </button>
          {#if data.user.roles.includes(UserRole.Secret)}
            <button onclick={removeSecret}>
              <DropdownMenu.Item>
                <TrafficConeIcon class="text-orange-500" />
                Disable Secret Features
              </DropdownMenu.Item>
            </button>
          {/if}
          <a href="/create">
            <DropdownMenu.Item>
              <PlusIcon />
              Create Asset
            </DropdownMenu.Item>
          </a>
          <DropdownMenu.Separator />
          <DropdownMenu.RadioGroup bind:value={theme} onValueChange={handleThemeChange}>
            <DropdownMenu.Label>Theme</DropdownMenu.Label>
            <DropdownMenu.RadioItem closeOnSelect={false} value="system">System</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem closeOnSelect={false} value="dark">Dark</DropdownMenu.RadioItem>
            <DropdownMenu.RadioItem closeOnSelect={false} value="light">Light</DropdownMenu.RadioItem>
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator />
          <a href="/logout">
            <DropdownMenu.Item>
              <LogOutIcon class="text-red-400" />
              Logout
            </DropdownMenu.Item>
          </a>
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

<!-- #region Alert Sidebar -->
<Sheet.Root bind:open={openAlerts}>
  <Sheet.Content class="grid grid-rows-[auto_1fr_auto] h-full">
    <Sheet.Header>
      <Sheet.Title class="text-lg font-semibold">Alerts</Sheet.Title>
      <div class="flex flex-row justify-between items-center">
        <Sheet.Description class="text-sm text-gray-500">
          You have {data.alerts.length} unread alert{data.alerts.length === 1 ? `` : `s`}.
        </Sheet.Description>
        <div class="flex items-center space-x-2">
          <Switch id="show-read" disabled />
          <Label for="show-read">Show Read</Label>
        </div>
      </div>
    </Sheet.Header>
    <ScrollArea class="mx-4 min-h-0">
      {#if data.alerts.length > 0}
        {#each data.alerts as alert}
          <Alert {alert} class="mb-2" />
        {/each}
      {:else}
        <p class="text-gray-500">No alerts available.</p>
      {/if}
    </ScrollArea>
    <Sheet.Footer>
      <Sheet.Close class={buttonVariants({ variant: "outline" })}>Close</Sheet.Close>
    </Sheet.Footer>
  </Sheet.Content>
</Sheet.Root>
<!-- #endregion -->

<Toaster
  richColors={true}
  {theme}
  position="top-right"
  toastOptions={{
    closeButton: true,
    duration: 5000,
    classes: {
      toast: "",
      title: "font-bold",
    },
  }} />
