# Budget Model — v1

Baseline working income: ~120,000 THB/month (temporary planning anchor; not a guarantee)

## Management buckets

- Recurring Essential: ~42,000–46,000/month
  - Elder care share ~8,000–8,500
  - Younger daughter support ~10,000
  - Older daughter support ~10,000
  - Household operations ~14,000–17,000
- Sinking Funds: 10,000–15,000/month
- Discretionary: 10,000–15,000/month
- Future Capital: remainder after current obligations

Electricity normalized: 5,000–6,000/month; a ~11.7k payment was two months combined and should not raise the monthly baseline.

## Alert logic

Discretionary uses both threshold and pace:
- 50% = Info
- 75% = Watch
- 90% = Warning
- 100% = Review before additional discretionary spend

Spending Pace = (% budget used) / (% month elapsed)

Essential uses anomaly alert rather than stop alert.
