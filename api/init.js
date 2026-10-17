export default async function handler(req,res){
  const { nomineeId, count, email } = JSON.parse(req.body)
  const amount = count * 50 // 1 vote = 50 pesewas
  const reference = "LND26-" + Date.now()
  
  // save transaction as pending
  await fetch(`${process.env.SUPABASE_URL}/rest/v1/transactions`, {
    method:'POST',
    headers:{ apikey: process.env.SUPABASE_SERVICE_KEY, Authorization: Bearer ${process.env.SUPABASE_SERVICE_KEY}, 'Content-Type':'application/json'},
    body: JSON.stringify({ reference, nominee_id: nomineeId, amount, status:'pending' })
  })

  // call Paystack
  const ps = await fetch("https://api.paystack.co/transaction/initialize",{
    method:'POST',
    headers:{ Authorization: Bearer ${process.env.PAYSTACK_SECRET_KEY}, 'Content-Type':'application/json'},
    body: JSON.stringify({ email: email || "voter@lanoche.com", amount, currency:"GHS", reference })
  }).then(r=>r.json())

  res.json({ url: ps.data.authorization_url })
}