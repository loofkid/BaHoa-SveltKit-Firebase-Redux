<script lang="ts">
    import { fly } from "svelte/transition";
    import { page } from "$app/stores";
</script>

{#key $page.url}
<div in:fly={{ x:'-100%', duration: 500 }} out:fly={{ x:'-100%', duration: 100 }}>
    <slot />
</div>
{/key}
