const BASE_URL = ''

async function request(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', accept: 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  // FIX: Throw on any non-2xx status so callers can catch errors reliably
  if (!res.ok) throw new Error(data.detail || data.message || 'Request failed')
  return data
}

// API-1: Send OTP
export const sendOtp = (email) =>
  request('POST', '/auth/send-otp', { email })

// API-2: Verify OTP
export const verifyOtp = (email, otp) =>
  request('POST', '/auth/verify-otp', { email, otp })

// API-3: Register
// FIX: Was /user/register — backend route is /users/register (prefix in main.py)
export const register = (full_name, email, password, mobile_number) =>
  request('POST', '/users/register', { full_name, email, password, mobile_number })

// API-4: Login
// FIX: Was /user/login — backend route is /users/login
export const login = (email, password) =>
  request('POST', '/users/login', { email, password })

// API-5: Add emails to monitor
export const addEmails = (user_id, emails) =>
  request('POST', '/email-accounts/add', { user_id, emails })

// API-6: Bulk add keywords
export const bulkAddKeywords = (user_id, category) =>
  request('POST', '/keywords/bulk-add', { user_id, category })

// API-7: Save alert config
export const saveAlertConfig = (user_id, alert_config) =>
  request('POST', '/alerts/config', { user_id, alert_config })

// API-8: Get added emails
export const getEmails = (user_id) =>
  request('GET', `/email-accounts/${user_id}`)

// API-9: Update pass keys
export const updatePassKeys = (user_id, emails) =>
  request('POST', '/email-accounts/update-passkey', { user_id, emails })
