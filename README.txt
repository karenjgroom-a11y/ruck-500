RUCK 500 — VERSION 1.6 TEST BUILD

Built from the stable V1.4 mobile foundation.

Targeted V1.6 fixes:
1. One central achievement queue handles both mileage milestones and 7-day streak awards.
   If one save crosses multiple mileage thresholds, every crossed milestone is shown in order.
2. Week streak is cumulative across the year:
   every completed 7 consecutive logged days counts as one streak block,
   including separate runs divided by gaps.
3. A pop-up is shown whenever saving a ruck creates a new 7-day streak block.
4. Certificate print mode remains one page and is centred on A4.

Preserved from V1.4:
- January 2027 temporary test unlock
- mobile width containment
- iPhone input-focus sizing
- internally scrollable log modal
- sticky Save/Delete controls and safe-area spacing
- Backup/Restore
- existing visuals, embedded images, Buzz events, branding and certificate design

RUCK 500 — VERSION 1.4 TEST BUILD

Test fixes:
- Week streak now means any rolling 7 consecutive logged days = 1 week, 14 = 2, etc.
- Strong mobile width containment on the home screen, calendar and log modal.
- iPhone Safari input-focus zoom prevented by 16px input sizing.
- Log modal now fits the visible viewport and scrolls internally.
- Save/Delete actions are sticky and have iPhone safe-area spacing.
- January 2027 remains temporarily unlocked for testing.
- No branding, image, event, certificate or concept changes.

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
