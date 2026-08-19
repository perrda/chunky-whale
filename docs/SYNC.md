# Keep both Macs on the same STACKHOUSE

Do this on the **Mac Mini and the MacBook Pro** whenever you start work, and after anything is merged on GitHub.

Press **Control + C** first if the site is already running.

```bash
cd ~/Projects/stackhouse
git fetch origin
git checkout main
git reset --hard origin/main
npm install
npm run dev -- --port 3001
```

Then open **http://127.0.0.1:3001**

You should see **“Bitcoin tees. Don’t miss the stack.”** on both machines.

That `reset --hard` makes this Mac match GitHub `main` exactly. Do not run it if you have unpaid work on this Mac that was never uploaded — say so first and we will save a backup branch.

Official files: GitHub `perrda/stackhouse` `main`  
Wrong site (“Forged, not printed.”): `atelier-archive` — ignore it.
