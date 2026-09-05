RUCK 500 — VERSION 1.3 TEST BUILD

Test-only correction:
- All dates in January 2027 are temporarily unlocked for testing.
- February–December 2027 remain protected by normal future-date logging rules.
- No other functional or visual changes in this patch.

RUCK 500 — VERSION 1.2 TEST BUILD

Testing changes only:
- All of January 2027 is temporarily unlocked so weekly streak and multi-day logging can be tested.
- Multiple milestone thresholds crossed in one save now celebrate in sequence (50, 100, 250, 500 as applicable).
- Log modal is vertically scrollable with mobile safe-area space so Save/Delete controls remain reachable.
- Horizontal page overflow is suppressed to prevent sideways white-page reveal on mobile.
- 'Rucking Fitness Kent' wording has NOT been changed pending confirmation.

RUCK 500 — VERSION 1.1 TEST BUILD

Temporary testing update:
- Responsive mobile Backup/Restore layout.
- 1 January 2027 temporarily unlocked for testing only.
- Remove test unlock before final public release.

RUCK 500 — VERSION 1.0 CONTROLLED FINAL

Purpose
-------
500-mile 2027 Ruck 500 challenge app.

Locked V1.0 changes
-------------------
1. Replaced non-standard window.storage with browser localStorage.
2. Packaged the existing app as a Vite + React project for Netlify deployment.
3. Future 2027 dates cannot be logged before they occur.
4. Added input integrity checks:
   - ruck distance must be greater than 0 miles
   - over 50 miles requires confirmation
   - over 100 miles requires a stronger confirmation
   - carried weight must be 0–100 kg
   - over 50 kg requires confirmation
5. Delete now asks "Delete this ruck?" before removing an entry.
6. Week streak is a genuine current consecutive Monday-first weekly streak.
7. Added Backup and Restore for the user's name and full 2027 ruck log.

Controlled-change rule
----------------------
The original visuals, embedded images, branding, event concepts, milestone concepts,
certificate design, trail graphic and core app copy have intentionally been retained.
No redesign was performed.

Storage
-------
Data is stored on the current browser/device using localStorage.
Use Backup to download a JSON copy and Restore to move/recover the log.

Netlify
-------
Build command: npm run build
Publish directory: dist

Version: 1.0
