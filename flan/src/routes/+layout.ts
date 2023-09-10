// This disables ssr on ALL pages (since its a layout)
//https://kit.svelte.dev/docs/single-page-apps
export const ssr = false;


// import { goto } from "$app/navigation";
// import { peerId } from "$lib/stores";
// import type Peer from "peerjs";
// import { getContext } from "svelte";

// This is called when the request to load is made, but before the page is rendered (instead of onMount) (it doesnt get access to any client side stores) (dunno if it gets access to context)
// export function load({ url }) {
//     const peer = getContext<Peer>("peer");

//     console.log("layout load", url, peer?.id);
//     // Load function cant get access to stores 
//     if (url.pathname != "/" && !peer) {
//         console.log("redirecting to /");
//         return {
//             status: 302,
//             headers: {
//                 location: "/"
//             }
//         };
//     }
// }