# Flan

## How to run
- pnpm build will generate .svelte-kit
- This will also generate the `build` folder where the `index.html` file is located


- Most development was done with the following in the dependencies 
```json
    "peerjs": "link:../../peerjs",
```
- Turns out in the peerjs package json, you either need an updated version number, OR add in this `"prepare": "npm run build",` (very likely its this since build gets run on vercel)