# NAKL (Not Another Key Logger)

![](/logo.png)
![kongi](https://img.shields.io/badge/kongi-purple?style=plastic) ![Year](https://img.shields.io/badge/Year-2023-red?style=plastic) ![Language](https://img.shields.io/badge/TypeScript-grey?style=plastic&logo=typescript) ![Framework](https://img.shields.io/badge/Sveltekit-grey?style=plastic&logo=svelte) ![Framework](https://img.shields.io/badge/SkeletonUI-grey?style=plastic)

This is the monorepo for NAKL, a serverless P2P platform where you can transfer files, images & text seamlessly between two devices/parties. 

>Forget about DMing yourself a password on Discord or Messenger, 2FA code or a picture because you can't afford AirDrop, use NAKL instead for all of your inter-device and interpersonal file transfer needs. NAKL is a P2P file transfer & chat website intended for short-term exchanges of information whether that is between yourself or others with the benefit that there is no storage of information from our end with the data being exchanged only being accessible for the time that the connection is active.

Go to the live [website](https://nakl.kongroo.xyz) to check it out.
 
## About
This project was originally made as a part of the [2022 UQCS Hackathon](https://uqcs.org/competitions/hackathon-2022/), with work continuing to the present. We originally made the front-end using [CRA](https://create-react-app.dev/), transitioning to [NextJS](https://nextjs.org/) with app router and then finally to [SvelteKit](https://kit.svelte.dev/) which is in production. 

Our goal with this project was to address the gap in the market for an AirDrop-like experience on other devices without needing to worry about device compatibility or privacy-concerns. 
## Structure
This is our project's current repo structure, the names being based off pudding-type desserts.

| Codebase | Description                  |
| -------- | ------------------------     |
| brulee   | React Native Application     |
| pudding  | PeerJS Express Server        |
| custurd  | NextJS Client Front-end      |
| flan     | Sveltekit Client Front-end   |

## Stack
- [SvelteKit](https://kit.svelte.dev/), our chosen front-end JS framework. 
- [SkeletonUI](https://www.skeleton.dev/) our chosen UI toolkit for SvelteKit & TailwindCSS
- [PeerJS](https://peerjs.com/) a WebRTC-based framework to handle the P2P connection
- [React Native](https://reactnative.dev/) our mobile development framework