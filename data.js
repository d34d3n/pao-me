window.PAO_DATA = {
  month: "2026-09",
  baselineIncome: 120000,
  budgets: {
    essential: { label:"Essential", budget:45000, used:31200 },
    discretionary: { label:"Discretionary", budget:12000, used:8700 },
    sinking: { label:"Sinking Funds", budget:12000, used:12000 },
    subscriptions: { label:"Subscriptions", budget:3500, used:3180 }
  },
  gov: { receivable:4500, liability:0 },
  subscriptions:[
    {name:"Home Internet", amount:900, priority:"P1 Must Pay", action:"Keep"},
    {name:"Mobile", amount:600, priority:"P1 Must Pay", action:"Keep"},
    {name:"AI Service", amount:699, priority:"P2 Important", action:"Review"},
    {name:"Cloud", amount:350, priority:"P2 Important", action:"Keep"},
    {name:"Streaming", amount:399, priority:"P3 Flexible", action:"Review"},
    {name:"App", amount:199, priority:"P4 Cut First", action:"Cancel candidate"}
  ],
  inbox:[
    {id:1, source:"The 1", merchant:"Shopee", amount:1280, note:"", prompt:"ของใช้จำเป็นหรือ discretionary?", choices:["Essential","Discretionary","Other"]},
    {id:2, source:"UOB", merchant:"Hotel", amount:3500, note:"สำรองค่าที่พักประชุม เบิกคืนได้", prompt:"เป็นค่าใช้จ่ายราชการที่เบิกคืนได้?", choices:["Official/Reimbursable","Personal","Other"]},
    {id:3, source:"KTB", merchant:"Incoming transfer", amount:8000, note:"เบิกคืนค่าเดินทางราชการ", prompt:"เงินเข้านี้คืออะไร?", choices:["Reimbursement","Income","Other"]}
  ]
}
