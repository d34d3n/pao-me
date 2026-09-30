# PAO+ME MVP v1 — Local-first PWA

เป้าหมาย: แอปมือถือสำหรับดูงบ, review เฉพาะรายการที่ไม่ชัด, Sinking Fund และ Gov Clearing โดยไม่ต้องเปิดคอมทุกวันหลัง deploy แล้ว

## Scope Freeze v1

มี 3 หน้าหลักเท่านั้น
1. Home — Essential / Discretionary / Sinking Fund / Gov Clearing / Safe-to-Spend
2. Review Inbox — ถามเฉพาะรายการที่ระบบไม่มั่นใจ
3. Monthly Review — สรุปเดือน + subscription review

ไม่รวมใน v1: portfolio optimization, tax planning, OCR engine เต็มรูปแบบ, bank API, prediction ขั้นสูง

## Financial Operating Model

- KTB = Operating Account: เงินเข้า-ออกประจำวัน, QR/transfer, จ่ายบัตร
- UOB = Card spending (offline/retail/restaurant) + official reimbursable spending
- The 1 = Online/app/7-Eleven/marketplace spending
- SCB = Treasury: reserve, investment, money waiting to invest, sinking funds; ไม่จ่าย merchant ภายนอกโดยตรง
- Gov Clearing = virtual ledger สำหรับ government advance / official reimbursable expense / reimbursement / return of unused advance

## Run locally for testing

จากโฟลเดอร์นี้:

```bash
python3 -m http.server 8080
```

เปิด http://localhost:8080

> การทดสอบ local ต้องเปิดคอม แต่การใช้งานจริงไม่จำเป็นต้องเปิดคอมทุกวันเมื่อ deploy เป็น static PWA แล้ว

## Free deployment (recommended after test)

ใช้ static hosting ฟรี เช่น GitHub Pages หรือ Cloudflare Pages แล้ว Add to Home Screen บนมือถือ

แอปนี้ไม่มี backend และเก็บข้อมูลใน browser localStorage สำหรับ MVP ดังนั้นไม่มีค่า server รายเดือน แต่ควร export backup เป็นระยะ

## Sprint Definition of Done

- เปิดจากมือถือได้
- Dashboard แสดง Used / Budget / Remaining
- Review item ได้ด้วย 1 tap
- Gov notes ถูก map ด้วย rule-based parser เบื้องต้น
- Card settlement / internal transfer / investment movement ไม่ถูกนับซ้ำเป็น expense
- Monthly review ใช้เวลาไม่เกิน 5–10 นาที
