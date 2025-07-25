<script lang="ts">
	import { page } from '$app/state';
	import { revokeJWT } from '$lib/api/auth';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import Icon from '@iconify/svelte';
	import { mode } from 'mode-watcher';
	import { onDestroy, onMount } from 'svelte';

	interface Props {
		onLogin: (
			username: string,
			password: string,
			type: string,
			language: string,
			remember: boolean
		) => void;
	}

	let { onLogin }: Props = $props();

	let username = $state('');
	let password = $state('');
	let authType = $state('sylve');
	let language = $state('en');
	let remember = $state(false);
	let loading = $state(false);

	$effect(() => {
		if (page.url.search.includes('loggedOut')) {
			revokeJWT();
		}
	});

	async function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (loading) return;
			loading = true;

			try {
				onLogin(username, password, authType, language, remember);
			} catch (error) {
				console.error('Login error:', error);
			} finally {
				loading = false;
			}
		}
	}

	onMount(() => {
		window.addEventListener('keydown', handleKeydown);
	});

	onDestroy(() => {
		window.removeEventListener('keydown', handleKeydown);
	});

	let languageArr = [
		{ value: 'en', label: 'English' },
		{ value: 'mal', label: 'മലയാളം' },
		{ value: 'cn-simplified', label: '简体中文' }
	];
</script>

<div class="fixed inset-0 flex items-center justify-center px-3">
	<Card.Root class="w-full max-w-lg rounded-lg shadow-lg">
		<Card.Header class="flex flex-row items-center justify-center gap-2">
			{#if mode.current === 'dark'}
				<img src="/logo/white.svg" alt="Sylve Logo" class="mt-2 h-8 w-auto" />
			{:else}
				<img src="/logo/black.svg" alt="Sylve Logo" class="h-8 w-auto" />
			{/if}
			<p class="ml-2 text-xl font-medium tracking-[.45em] text-gray-800 dark:text-white">SYLVE</p>
		</Card.Header>

		<Card.Content class="space-y-4 p-6">
			<div class="flex items-center gap-2">
				<Label for="username" class="w-44">Username</Label>
				<Input
					id="username"
					class="h-8 w-full"
					type="text"
					placeholder="Enter your username"
					bind:value={username}
					required
				/>
			</div>
			<div class="flex items-center gap-2">
				<Label for="password" class="w-44">Password</Label>
				<Input
					id="password"
					type="password"
					placeholder="●●●●●●●●"
					class="h-8 w-full"
					bind:value={password}
					required
				/>
			</div>

			<div class="flex items-center gap-2">
				<Label for="realm" class="w-44">Realm</Label>
				<Select.Root type="single" bind:value={authType}>
					<Select.Trigger class="h-8 w-full">
						{#if authType === 'pam'}
							PAM
						{:else if authType === 'sylve'}
							Sylve
						{/if}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="pam">PAM</Select.Item>
						<Select.Item value="sylve">Sylve</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex items-center gap-2" title="Language selection is disabled for now">
				<Label for="language" class="w-44">Language</Label>
				<Select.Root type="single" bind:value={language}>
					<Select.Trigger class="h-8 w-full">
						{languageArr.find((lang) => lang.value === language)?.label || 'Select Language'}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="en">English</Select.Item>
						<Select.Item value="mal">Malayalam (മലയാളം)</Select.Item>
						<Select.Item value="cn-simplified">Chinese (简体中文)</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
		</Card.Content>

		<Card.Footer class="flex items-center justify-between px-6 py-4">
			<div class="flex items-center space-x-2">
				<Checkbox id="remember" bind:checked={remember} />
				<Label for="remember" class="text-sm font-medium">Remember Me</Label>
			</div>
			<Button
				onclick={() => {
					onLogin(username, password, authType, language, remember);
				}}
				size="sm"
				class="w-20 rounded-md bg-blue-700 text-white hover:bg-blue-600"
			>
				{#if loading}
					<Icon icon="line-md:loading-loop" width="24" height="24" />
				{:else}
					Login
				{/if}
			</Button>
		</Card.Footer>
	</Card.Root>
</div>
