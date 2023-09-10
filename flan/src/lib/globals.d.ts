// https://www.emmanuelgautier.com/blog/typescript-extend-window
// Declaring global types on window in order to set the peer objects on them
import type { Peer, DataConnection } from 'peerjs';

declare global {
    interface Window {
        NAKL_PEER: Peer | null;
        NAKL_PEER_CONNECTION: DataConnection;
    }
}