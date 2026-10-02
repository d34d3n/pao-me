# PAO+ME MVP v1.1 — Baseline Sprint

เป้าหมายของ v1.1 คือเปลี่ยนจาก demo dashboard เป็น baseline ที่ยึดข้อมูลจริง มิ.ย.–ส.ค. 2026 และ operating model ที่ตกลงกัน

## Operating model
- KTB = Operating Account: เงินเข้า/QR/โอน/ชำระบัตร
- UOB = Card consumption + official reimbursable spending
- The 1 = Online/app/7-Eleven/marketplace consumption
- SCB = Treasury: investment/reserve/sinking fund; ไม่มี external merchant spending
- Gov Clearing = virtual ledger สำหรับ advance / reimbursable / reimbursement / return of unused advance

## Planning baseline
- Baseline income: 120,000 THB/month
- Essential: 45,000
- Discretionary: 12,000
- Sinking funds: 12,000
- Planned future capital: 51,000

Subscriptions are not a fourth budget bucket. Each subscription is classified into Essential or Discretionary to avoid double-counting.

## Evidence caveat
Historical Jun–Aug cards are evidence views, not complete household accounting. Missing/unresolved transactions remain separate. June has identifiable large one-offs; August electricity included roughly two months and is normalized to ~5,500/month in planning.

## Deployment update
Upload/overwrite these files in the GitHub `pao-me` repository root:
- app.js
- data.js
- sw.js
- README.md

GitHub Pages will redeploy automatically. If an installed PWA still shows the old version, fully close it and reopen; the new service worker cache is `pao-me-v1-1`.
