<script lang="ts">
	import type { DataConnection } from "peerjs";
	import { onMount } from "svelte";

    let conn: DataConnection;

    onMount(() => {
        conn = window.NAKL_PEER_CONNECTION;
        console.log(conn);
        conn.on('data', (data) => {
            console.log('Received', data);
        })
        conn.send("Sup bro");
    });


</script>

<div>
    <h1 class="h1">CHAT</h1>
    <button 
    class="btn variant-filled"
    
    on:click={() => {
        conn.send("new message wooooooooo");
    }}></button>
</div>