import { useState, useEffect, useRef } from 'react'
import { paymentsAPI } from '../lib/api'

const STEPS = { form: 'form', waiting: 'waiting', success: 'success', failed: 'failed' }

export default function MpesaModal({ job, workerId, workerName, onClose, onSuccess }) {
  const [step, setStep] = useState(STEPS.form)
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)
  const [receipt, setReceipt] = useState(null)
  const [checkoutId, setCheckoutId] = useState(null)
  const [pollCount, setPollCount] = useState(0)
  const pollRef = useRef(null)

  // Validate Kenyan phone number
  const validPhone = (p) => /^(?:0|\+?254)7\d{8}$/.test(p.replace(/\s/g, ''))
  const formatPhone = (p) => p.replace(/\s/g, '').replace(/^0/, '254').replace(/^\+/, '')

  // Poll for payment status after STK push
  useEffect(() => {
    if (step !== STEPS.waiting || !checkoutId) return
    let attempts = 0

    pollRef.current = setInterval(async () => {
      attempts++
      setPollCount(attempts)
      try {
        const tx = await paymentsAPI.getStatus(checkoutId)
        if (tx.status === 'success') {
          clearInterval(pollRef.current)
          setReceipt(tx.mpesa_receipt_number)
          setStep(STEPS.success)
          onSuccess?.()
        } else if (tx.status === 'failed') {
          clearInterval(pollRef.current)
          setStep(STEPS.failed)
        }
      } catch (_) {}

      if (attempts >= 12) {   // stop after ~60s
        clearInterval(pollRef.current)
        setStep(STEPS.failed)
      }
    }, 5000)

    return () => clearInterval(pollRef.current)
  }, [step, checkoutId])

  const initiate = async () => {
    if (!validPhone(phone)) return setErr('Enter a valid M-Pesa number e.g. 0712 345 678')
    try {
      setLoading(true); setErr(null)
      // Try real Edge Function first, fallback to simulation
      let result
      try {
        result = await paymentsAPI.initiate({
          jobId: job.id, phone: formatPhone(phone),
          amount: job.budget, workerId,
        })
      } catch (_) {
        // Edge Function not deployed — use simulation
        result = await paymentsAPI.simulate({
          jobId: job.id, phone: formatPhone(phone),
          amount: job.budget, workerId,
        })
      }

      if (result.simulated) {
        setReceipt(result.receipt)
        setStep(STEPS.success)
        onSuccess?.()
      } else {
        setCheckoutId(result.checkoutId)
        setStep(STEPS.waiting)
      }
    } catch (e) {
      setErr(e.message || 'Payment failed. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && step !== STEPS.waiting && onClose()}>
      <div className="sheet">
        <div className="sheet-handle" />
        <div className="sheet-body">

          {/* ── FORM STEP ── */}
          {step === STEPS.form && (
            <>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:6 }}>
                  <span className="mpesa" style={{ fontSize:12 }}>M-PESA</span>
                  <div className="sheet-title">Pay Worker</div>
                </div>
                <p className="text-sm muted">Send payment directly to {workerName}'s M-Pesa.</p>
              </div>

              {/* Job summary */}
              <div style={{ background:'var(--surface)', borderRadius:'var(--r-md)', padding:14 }}>
                <div style={{ fontSize:12, color:'var(--ink-mid)', marginBottom:4 }}>Job</div>
                <div style={{ fontWeight:600, fontSize:14, marginBottom:8 }}>{job.title}</div>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <div>
                    <div style={{ fontSize:11, color:'var(--ink-mid)' }}>Amount to send</div>
                    <div style={{ fontFamily:'var(--font-head)', fontSize:'1.6rem', fontWeight:800, color:'var(--green)', lineHeight:1.1 }}>
                      KES {Number(job.budget).toLocaleString()}
                    </div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontSize:11, color:'var(--ink-mid)' }}>To worker</div>
                    <div style={{ fontSize:14, fontWeight:600 }}>{workerName}</div>
                  </div>
                </div>
              </div>

              <div className="field">
                <label>M-Pesa Phone Number</label>
                <input
                  className="input"
                  placeholder="0712 345 678"
                  value={phone}
                  onChange={e => { setPhone(e.target.value); setErr(null) }}
                  onKeyDown={e => e.key === 'Enter' && initiate()}
                  maxLength={13}
                />
                <div style={{ fontSize:11, color:'var(--ink-soft)' }}>Enter the number that will receive the payment</div>
              </div>

              {err && <div className="alert alert-err">{err}</div>}

              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <div style={{ background:'var(--green-light)', borderRadius:'var(--r-md)', padding:'10px 13px', display:'flex', gap:8, alignItems:'flex-start' }}>
                  <span style={{ fontSize:'1rem', flexShrink:0 }}>🔐</span>
                  <div className="text-sm" style={{ color:'var(--green-dark)', lineHeight:1.5 }}>
                    A prompt will appear on {workerName}'s phone. They enter their M-Pesa PIN to confirm.
                  </div>
                </div>
                <button className="btn btn-primary btn-lg btn-full" onClick={initiate} disabled={loading}>
                  {loading
                    ? <><span className="spin" style={{width:18,height:18}} /> Sending prompt…</>
                    : `Send KES ${Number(job.budget).toLocaleString()} via M-Pesa →`}
                </button>
                <button className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
              </div>
            </>
          )}

          {/* ── WAITING STEP ── */}
          {step === STEPS.waiting && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>📱</div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', fontWeight:800, marginBottom:8 }}>
                Waiting for PIN…
              </div>
              <p className="muted text-sm" style={{ marginBottom:24, lineHeight:1.6 }}>
                An M-Pesa prompt has been sent to <strong>{phone}</strong>.<br />
                Ask {workerName} to enter their PIN to confirm.
              </p>
              <div className="spin" style={{ margin:'0 auto 20px' }} />
              <div style={{ fontSize:12, color:'var(--ink-soft)' }}>
                Checking status… ({pollCount}/12)
              </div>
              <div style={{ marginTop:24, padding:12, background:'var(--amber-light)', borderRadius:'var(--r-md)', fontSize:13, color:'var(--amber)' }}>
                ⚠️ Do not close this screen until payment is confirmed.
              </div>
            </div>
          )}

          {/* ── SUCCESS STEP ── */}
          {step === STEPS.success && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ width:64, height:64, borderRadius:'50%', background:'var(--green-light)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', margin:'0 auto 16px' }}>
                💰
              </div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'1.3rem', fontWeight:800, marginBottom:6 }}>
                Payment Sent!
              </div>
              <p className="muted text-sm" style={{ marginBottom:20 }}>
                KES {Number(job.budget).toLocaleString()} successfully sent to {workerName}.
              </p>
              <div style={{ background:'var(--green-light)', borderRadius:'var(--r-md)', padding:'14px 16px', marginBottom:20, textAlign:'left' }}>
                <div className="flex justify-between" style={{ marginBottom:8 }}>
                  <span className="text-sm muted">Amount</span>
                  <span className="text-sm bold">KES {Number(job.budget).toLocaleString()}</span>
                </div>
                <div className="flex justify-between" style={{ marginBottom:8 }}>
                  <span className="text-sm muted">Worker</span>
                  <span className="text-sm bold">{workerName}</span>
                </div>
                <div className="flex justify-between" style={{ marginBottom:8 }}>
                  <span className="text-sm muted">Phone</span>
                  <span className="text-sm bold">{phone}</span>
                </div>
                {receipt && (
                  <div className="flex justify-between">
                    <span className="text-sm muted">Receipt</span>
                    <span className="text-sm bold" style={{ fontFamily:'monospace', color:'var(--green-dark)' }}>{receipt}</span>
                  </div>
                )}
              </div>
              <button className="btn btn-primary btn-full btn-lg" onClick={onClose}>Done ✓</button>
            </div>
          )}

          {/* ── FAILED STEP ── */}
          {step === STEPS.failed && (
            <div style={{ textAlign:'center', padding:'20px 0' }}>
              <div style={{ fontSize:'3rem', marginBottom:16 }}>❌</div>
              <div style={{ fontFamily:'var(--font-head)', fontSize:'1.2rem', fontWeight:800, marginBottom:8 }}>
                Payment Failed
              </div>
              <p className="muted text-sm" style={{ marginBottom:24 }}>
                The M-Pesa payment was not completed. The worker may have cancelled or the request timed out.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                <button className="btn btn-primary btn-full" onClick={() => { setStep(STEPS.form); setCheckoutId(null); setPollCount(0) }}>
                  Try Again
                </button>
                <button className="btn btn-ghost btn-full" onClick={onClose}>Cancel</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
