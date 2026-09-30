# PAO+ME MVP v1 — Rule Matrix

## Source/account rules

| Source | Default role | Default treatment |
|---|---|---|
| KTB | Operating account | Income / daily payment / transfer / card settlement |
| UOB | Credit card | Consumption or Official/Reimbursable according to purpose |
| The 1 | Credit card | Consumption; online/app/marketplace |
| SCB | Treasury | Investment / Reserve / Sinking Fund / Internal Transfer only |
| Gov Clearing | Virtual ledger | Advance / Reimbursable / Reimbursement / Return |

## Non-expense rules

- KTB → UOB/The1 card bill = Credit Card Settlement; expense = 0
- KTB ↔ SCB = Internal Transfer; expense = 0
- SCB fund purchase/redemption = Investment Movement; income/expense = 0
- Wallet top-up = transfer until underlying spend is known
- Reimbursement = not income; clears Gov receivable
- Government advance received = not income; creates Gov liability
- Return of unused government advance = not personal expense; reduces Gov liability

## Expense decision dimensions

1. Category: Food / Housing / Transport / Health & Care / Family & Education / Digital & Communication / Lifestyle / Taxes & Annual Obligations
2. Priority: P1 Must Pay / P2 Important / P3 Flexible / P4 Cut First
3. Behavior: Recurring / Predictable Irregular / One-off
4. Accounting treatment: Consumption / Transfer / Investment / Reimbursement
5. Responsibility (optional): Self / Household / Mother / Younger Daughter / Older Daughter / Official

## Exception-only policy

Auto-classify if confidence is high. Ask only when classification changes a management decision.

Examples:
- Shopee repeated household item: remember prior choice
- Shopee unusually large amount: ask Essential / Discretionary
- Apple recurring amount: Subscription; priority depends on service
- UOB hotel + note "ประชุม/เบิกคืน": Official Reimbursable
- KTB incoming + note "เบิกคืน": Reimbursement
