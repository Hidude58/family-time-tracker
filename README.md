# Family Time Tracker — GitHub Pages + Google Sheets

No Firebase. GitHub Pages hosts the free mobile website; a Google Sheet holds the shared records. GitHub Pages alone cannot securely store or sync everyone's shifts.

## Setup (about 10–15 minutes)
1. Create a **new Google Sheet** in your Google account (the account that should own the records).
2. In the Sheet choose **Extensions → Apps Script**. Replace the default `Code.gs` with the contents of the included `Code.gs` and save.
3. In Apps Script open **Project Settings → Script Properties** and add two properties:
   - `EDIT_CODE` = a long random secret that you and Isabel will use
   - `VIEW_CODE` = a DIFFERENT long random secret for Mom
   Don't share the editor code with viewers. Codes are simple shared secrets, not personal logins.
4. Run the `setup` function once in Apps Script and approve the Google authorization prompts.
5. Choose **Deploy → New deployment → Web app**. Execute as **Me**, Who has access: **Anyone**. Authorize and copy the web app URL ending `/exec`.
6. Create a public GitHub repository, upload `index.html` to the repository root, and under **Settings → Pages** select **Deploy from a branch**, branch `main`, folder `/ (root)`. Wait for the GitHub Pages URL.
7. Open the Pages URL on each phone, paste the same Apps Script URL. You and Isabel enter the `EDIT_CODE`; Mom enters the `VIEW_CODE`. Tap **Connect**. On iPhone use Safari Share → Add to Home Screen; on Android use browser menu → Add to Home Screen.

## Notes / limitations
- Mom has read-only access through the app. The owner of the Google Sheet can edit spreadsheet cells directly; this is not tamper-proof evidence or a legally certified timekeeping system.
- Every shift records timestamps in the Sheet. Manual entries are clearly marked. Export CSV or Print → Save as PDF for documentation.
- Current week/month totals count a completed shift under its start date; a shift crossing a week/month boundary is not split. Open shifts aren't included until clocked out.
- If a code is exposed, change it in Script Properties. The URL and code are saved only locally (the code is stored in session storage and may need reentry after the browser closes). Avoid entering codes on shared devices.
- Google's free Apps Script quotas and availability apply. Apps Script web app must allow anonymous access because this lightweight app uses access codes rather than Google sign-in.
- To change worker names, edit the `['Kevin','Isabel']` list in `Code.gs` and the two name options in `index.html`.
