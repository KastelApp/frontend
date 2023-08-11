<script>
	import { fade } from 'svelte/transition';

	let quotes = [
		'Insert random quote here - Dev',
		'Loading your next adventure!',
		'How are you doing today?',
		"I'm feeling really good today!",
		"You meet today's quota?",
		"I don't know much",
		'Getting things ready for you...',
		'One of the devs loves otters',
		"I can't code without coffee!",
		"I'm not lazy, I'm just on my energy-saving mode.",
		"I'm not a complete idiot; some parts are missing.",
		'I speak fluent sarcasm.',
		"I don't suffer from insanity; I enjoy every minute of it.",
		"If at first you don't succeed, call it version 1.0.",
		"I'm not a pessimist; I'm just an optimist with experience.",
		"I'm not procrastinating; I'm just giving my ideas time to mature.",
		"I'm not weird. I'm limited edition!",
		"I'm not anti-social; I'm just not user-friendly.",
		'I put the "fun" in dysfunctional.',
		'The code works on my machine!',
		"I'm not clumsy. It's just the floor hates me, the tables and chairs are bullies, and the walls get in my way.",
		'I like chicken ~ Random Person Probably'
	];
	let quote1 = quotes[Math.floor(Math.random() * quotes.length)];
	let quote2 = quotes[Math.floor(Math.random() * quotes.length)];
	let active = 1;
	let show = true;

	setInterval(() => {
		if (active == 1) {
			active = 2;
			quote1 = quotes[Math.floor(Math.random() * quotes.length)];
		} else {
			active = 1;
			quote2 = quotes[Math.floor(Math.random() * quotes.length)];
		}
	}, 3000);
</script>

<div class="fixed inset-0 flex items-center justify-center bg-black w-full h-full">
	<div class="flex flex-col items-center">
		<img src="/logo.png" alt="The Kastel Logo" />
		<div class="quotecontainer">
			{#if active === 1}
				<div class="text-white text-2xl font-bold mt-4 text-center" out:fade in:fade>{quote1}</div>
			{:else if active === 2}
				<div class="text-white text-2xl font-bold mt-4 text-center" in:fade out:fade>{quote2}</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.quotecontainer {
		display: grid;
		grid-template-rows: 1fr;
		grid-template-columns: 1fr;
	}

	.quotecontainer > div {
		grid-row: 1;
		grid-column: 1;
	}
</style>
