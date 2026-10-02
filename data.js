window.PAO_DATA = {
  schemaVersion: 2,
  mode: "baseline",
  month: "Baseline Jun–Aug 2026",
  baselineIncome: 120000,
  budgetPlan: {
    essential: {
      label: "Essential",
      budget: 45000,
      used: 0,
      note: "เป้าหมายรายเดือนหลัง normalize: ภาระครอบครัว/ดูแล + household operations"
    },
    discretionary: {
      label: "Discretionary",
      budget: 12000,
      used: 0,
      note: "Shopping / leisure / optional services ที่ตัดหรือเลื่อนได้"
    },
    sinking: {
      label: "Sinking Funds",
      budget: 12000,
      used: 0,
      note: "กันเงินสำหรับภาษี ค่าเทอม ซ่อมบ้าน และรายจ่ายคาดได้แต่ไม่เกิดทุกเดือน"
    }
  },
  essentialPlan: [
    {name:"Elder Care Commitment", amount:8500, priority:"P1 Must Pay", responsibility:"Mother"},
    {name:"Younger Daughter Support", amount:10000, priority:"P1 Must Pay", responsibility:"Younger Daughter"},
    {name:"Older Daughter Support", amount:10000, priority:"P1 Must Pay", responsibility:"Older Daughter"},
    {name:"Electricity (normalized)", amount:5500, priority:"P1 Must Pay", responsibility:"Household"},
    {name:"Food / household basics", amount:4500, priority:"P1/P2", responsibility:"Household"},
    {name:"Transport / mobility", amount:2500, priority:"P2 Important", responsibility:"Household"},
    {name:"Telecom / internet", amount:2500, priority:"P1/P2", responsibility:"Household"},
    {name:"Other essential buffer", amount:1500, priority:"P2 Important", responsibility:"Household"}
  ],
  subscriptions: [
    {name:"Essential subscriptions", amount:0, priority:"P1/P2", bucket:"Essential", action:"Classify when statement identifies service"},
    {name:"Optional subscriptions", amount:0, priority:"P3/P4", bucket:"Discretionary", action:"Review quarterly"}
  ],
  historical: [
    {
      month:"2026-06",
      knownSpending:151088.42,
      familySupportRecorded:1000,
      provisional:646.93,
      unresolved:10148,
      oneOff:[
        {label:"Healthcare / dental", amount:81710, treatment:"One-off / review reimbursability"},
        {label:"Land tax", amount:26978.40, treatment:"Predictable irregular / sinking fund"}
      ],
      normalizedKnown:42400.02
    },
    {
      month:"2026-07",
      knownSpending:27250.16,
      familySupportRecorded:3874.54,
      provisional:11609.38,
      unresolved:9305,
      oneOff:[],
      normalizedKnown:27250.16
    },
    {
      month:"2026-08",
      knownSpending:39091.59,
      familySupportRecorded:8150,
      provisional:36024.39,
      unresolved:104903,
      oneOff:[
        {label:"Electricity catch-up above normalized one month", amount:6233.22, treatment:"Timing effect; not higher monthly run-rate"}
      ],
      normalizedKnown:32858.37
    }
  ],
  gov: { receivable:0, liability:0 },
  inbox: [
    {
      id:101,
      date:"2026-08-27",
      source:"KTB",
      merchant:"BUDGETREFUND",
      amount:27760,
      note:"ชื่อรายการบ่งชี้ว่าอาจเกี่ยวกับการคืนงบ/คืนเงินราชการ แต่ parser เดิมนับเป็น provisional merchant spending",
      prompt:"รายการนี้คือการคืนเงินเหลือใช้/คืนเงินยืมราชการหรือไม่?",
      choices:["Return of Gov Advance","Personal Expense","Other"]
    },
    {
      id:102,
      date:"2026-08-19",
      source:"KTB",
      merchant:"Card payment candidate",
      amount:29616.10,
      note:"parser เดิมอ่านเป็น credit_card_payment แต่ยังไม่ยืนยันปลายทาง",
      prompt:"เป็นการชำระยอดบัตรเครดิตหรือไม่?",
      choices:["Card Settlement","Personal Expense","Other"]
    }
  ],
  rules: {
    sourceRoles: {
      KTB:"Operating / income / QR / transfers / card settlement",
      UOB:"Card consumption + official reimbursable spending",
      THE1:"Online/app/7-Eleven/marketplace consumption",
      SCB:"Treasury / investment / reserve / sinking fund; no external merchant spend"
    }
  }
};
