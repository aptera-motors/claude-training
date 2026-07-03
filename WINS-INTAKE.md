# Win Gallery Intake Runbook

Automated pipeline that turns "Share your win" Microsoft Form submissions into
Win Gallery entries on the Aptera AI Academy site — **approval-first**: every
win becomes a pull request; merging the PR publishes it (the deploy Action does
the rest). Run weekly by a scheduled Claude task, or on demand ("run the wins
intake").

## Inputs

- **Form (submissions):**
  https://forms.office.com/Pages/ResponsePage.aspx?id=s0De5IZXIECbcc-Tdhnk1oVy0x9kpH5Ho0VoaEAGmYdUMlYwTzNBSFdUV04zT0VHTDBDWTU4VFNSRi4u
  (linked from the Win Gallery's "Share your win" card — `WIN_FORM_URL` in
  `src/pages/wins/index.astro`).
- **Responses workbook (OneDrive-synced, read with python/openpyxl):**
  `C:\Users\jacob\OneDrive - Aptera Motors, Corp\AI Wins Submission Form.xlsx`
  Sheet1 columns: `Id, Start time, Completion time, Email, Name, Name1, Team,
  Mode, What you did, Time saved, OK to publish`.
  Use **Name1** (the form field) for the person's name; fall back to **Name**
  (the account name) if blank. Never publish the Email.
- **State file (processed submissions):**
  `C:\Users\jacob\.claude\wins-intake-state.json` — `{"processedIds": [1, 2, …]}`.
  A response is "new" if its `Id` is not in `processedIds`. Read it (create with
  `{"processedIds": []}` if missing) at the start; add each handled `Id` and
  save at the end — including skipped/declined ones, so they aren't reprocessed.

## Per-response procedure

For each **new** response, in `C:\Users\jacob\claude-training-site`:

1. **Draft the win file** at `src/content/wins/<slug>.md` (short kebab-case
   slug from the story, e.g. `software-install-scripts.md`). Follow the
   `add-win` skill conventions (`~/.claude/skills/add-win/SKILL.md`):

   ```markdown
   ---
   title: "Short punchy headline (what got done)"
   who: FirstName            # from Name1
   team: IT                  # from Team, free text
   mode: code                # Mode lowercased: chat | cowork | code ("Co-Work" → cowork)
   timeSaved: "…"            # from "Time saved"; omit the line if blank
   date: "YYYY-MM-DD"        # Completion time's date, quoted string
   ---

   One short paragraph: who asked Claude for what, what Claude did, the payoff.
   Past tense, third person, concrete, 2–4 sentences. Rewrite the submission
   into the gallery's voice — don't paste it verbatim.
   ```

2. **"OK to publish" = No** → still draft the PR, but **anonymize**: `who:` the
   team name (e.g. `IT team`) or `Anonymous`, no name in the body, and flag in
   the PR description: "Submitter answered No to 'OK to publish' — merge only
   if you're sure, or close." Jake decides at merge time.

3. **Build gate:** `npm run build` must pass (schema errors — unquoted date,
   bad mode — fail here). Fix before pushing.

4. **Open a PR (one per win):**

   ```
   git checkout -b win/<slug> main
   git add src/content/wins/<slug>.md
   git commit -m "Add <Name> <topic> win"   # end with the Co-Authored-By trailer
   git push -u origin win/<slug>
   gh pr create --title "Win: <title>" --body "<summary + submission details + any flags>"
   git checkout main
   ```

   PR body: the drafted story, submitter name/team/mode/time-saved, submission
   Id and date, and any flags (anonymized, unclear team, edited heavily). End
   with the standard "🤖 Generated with Claude Code" footer.

5. **Record the Id** in the state file.

## Wrap-up

- Save the state file with all newly processed Ids.
- If any PRs were opened, tell Jake: list each PR URL + one-line summary.
  **Merging a PR publishes the win** (push-to-main → GitHub Action deploys,
  live in ~1–2 min). Nothing publishes without a merge.
- If there were no new responses, finish quietly — no notification needed.
- Never commit directly to `main` from this pipeline, never edit the workbook,
  and never include submitter emails anywhere in the repo or PRs.

## Gotchas

- OneDrive: if the workbook fails to open, it may be syncing — retry once
  after ~30 s. If it's missing entirely, stop and tell Jake (don't guess).
- The `aptera-motors` org uses SAML SSO; `gh` is authenticated as
  `aptera-motors-it` and works for this repo.
- Don't Glob/Grep from `C:\Users\jacob` (huge dir) — scope to the repo.
- Duplicate stories (same person, same story, resubmitted): open the PR anyway
  and flag it as a possible duplicate — Jake arbitrates.
