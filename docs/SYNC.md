# Keep both Macs on the same STACKHOUSE

Do this on the **Mac Mini and the MacBook Pro** whenever you start work, and after anything is merged on GitHub.

Press **Control + C** first if the site is already running. An old Terminal window will keep showing yesterday’s shop even after GitHub updates — stop it, then run this block.

```bash
cd ~/Projects/stackhouse
git fetch origin
git checkout main
git reset --hard origin/main
rm -rf .next
npm install
npm run dev -- --port 3001
```

Then open **http://127.0.0.1:3001**

You should see **“Bitcoin tees. Don’t miss the stack.”** on both machines.

Open [Genesis 2009](http://127.0.0.1:3001/product/genesis-2009-tee) and tap **Bone**. The shirt must be cream, not a dark mottled tee.

On the shop page, **More → Mummy & Daddy** must show the parent pieces, not “Nothing matches.” Drinkware must include the log-chart mug. Checkout total must match items + the shipping line. Checkout still says **demo** until your keys are in. `/fulfillment` should send you to Shipping — that page must not talk about booths.

Open [HODL Pullover](http://127.0.0.1:3001/product/hodl-pullover). You must be able to read **I AM HODLING** and see a clean orange ₿ — not a black box or broken letters. Then tap Bone: the shirt goes cream and the writing stays readable. Open [Bitcoin Daddy Hoodie](http://127.0.0.1:3001/product/bitcoin-daddy-hoodie) — **BITCOIN DADDY** must be readable with a clean ₿ on the chest. Drinkware must not show a ₿ floating off a white mug (those listings are retired).

If Drinkware still looks like only mugs and tumblers, the old process is still running. Control+C, then the block again. Direct pages: [Whiskey glasses](http://127.0.0.1:3001/collection/whiskey-glasses) and [Shot glasses](http://127.0.0.1:3001/collection/shot-glasses).

That `reset --hard` makes this Mac match GitHub `main` exactly. Do not run it if you have unpaid work on this Mac that was never uploaded — say so first and we will save a backup branch.

Official files: GitHub `perrda/stackhouse` `main`  
Wrong site (“Forged, not printed.”): `atelier-archive` — ignore it.
