# Try it yourself

Everything is static files. You need a laptop or desktop with Node 22 (or Python 3) and a phone on the same Wi-Fi. Nothing is installed on the phone.

## 1. Get the code
Run these one at a time (this works in Windows PowerShell, macOS and Linux; older PowerShell does not accept `&&`):
```bash
git clone https://github.com/wigojese/timehunt.git
```
```bash
cd timehunt
```
```bash
git checkout claude/peaceful-fermat-j8inv8
```
```bash
cd app
```

## 2. Start the server
You need Node 22 (nodejs.org, the LTS installer is fine) or Python 3. Check with `node -v` or `python --version`.

With Node:
```bash
node scripts/serve.mjs --lan
```
It prints the addresses to open on your phone.

With Python, from the same `app` folder:
```bash
python -m http.server 5173 --bind 0.0.0.0
```
Then find your computer's Wi-Fi address (`ipconfig` on Windows, look for "IPv4 Address") and open `http://<that address>:5173/motion/` on the phone.

If the phone cannot connect, the Windows firewall is the usual cause. When Windows asks whether to allow Node or Python, allow it on **Private** networks.

## 3. What to open
| Address | What it is |
|---|---|
| `/` | The game (Stage 7 UI). Add `?debug=1` for the crash-injection tools, `?pseudo=1` for long translated text, `?variant=deep` for the relation clue sold as a Deep clue |
| `/motion/` | The camera, path scroll, evidence branch, lock opening and reveal (Stage 8). Add `?perf=1` for the recorder |

## 4. What to try on the phone (about 10 minutes)
Motion prototype, `/motion/?perf=1`:
1. Scroll the page. Does the path move with your finger and does the page keep scrolling after it?
2. Tap a mark, then pinch the year ruler with two fingers. Does the year under your fingers stay under them? Does anything jump?
3. Drag the red handle at the right edge. Does it move the marker and not the page? Does your phone's back gesture ever fire instead?
4. Put one finger on the ruler and swipe up. Does the page scroll?
5. Open Evidence, press Back (or your phone's back), open it again and press Back quickly mid-slide. Does it end up where it should?
6. Lock a year, let it open, then try Skip on a second go.
7. Open the world around the year. Scroll the steps, use Next, reload and use Resume.
8. Turn on Reduce motion (Display options) and repeat steps 5 to 7. Turn the text size to 160% or 200%.
9. Try browser zoom (pinch outside the ruler) and double-tap the ruler. Note what happens.

To record numbers: press **Record** in the bar at the bottom, do steps 2, 3 and 5, press **Stop**, then **Download JSON**. Send me the file and your phone model and browser.

Game, `/`:
1. Play a few cases. Is the next action always obvious? Is Lock's confirmation protective or annoying?
2. Switch Text size to Largest in Settings. Does anything break?
3. Anything you could not do with one hand?

## 5. How to tell me what happened
For each thing that felt wrong: what you did, what you expected, what happened, phone and browser. A screen recording of the phone is the most useful thing you can send.

## Notes
- Fonts load from Google Fonts, so the phone needs internet. Without it, the layout is the same in fallback fonts.
- The pack is a draft and the day's results on the trail are illustrative.
- Over plain `http` on a local address, "Copy" in the game falls back to selecting the text, because browsers allow clipboard writes only on secure pages.
