# Quick Start Guide - Authentication Implementation

**Status**: ✅ Frontend Complete | ⏳ Backend Pending

---

## For Testing the Frontend (Right Now)

### 1. Run the Application
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### 2. Test Registration Flow
```
1. Click "Create one" on login page or go to /register
2. Fill 5-step form:
   - Step 1: Email, Username, Phone (REQUIRED)
   - Step 2: Personal info (optional)
   - Step 3: Address (optional)
   - Step 4: Employment (optional)
   - Step 5: Pension details (required: contribution rate)
3. Click "Create Account & Pay 1 KES"
4. See toast: "💳 M-Pesa prompt sent to your phone!"
5. See: "PaymentPendingModal" (waiting for payment)
6. ⚠️ Backend will handle M-Pesa from here
```

### 3. Test Login Flow
```
1. Go to /login
2. Try these identifiers:
   - Email: any@email.com
   - Username: any_username
   - Phone: +254...
3. Enter password
4. See toast: "📧 OTP sent to your email!"
5. Redirect to /verify-otp
6. ⚠️ Backend will handle OTP from here
```

### 4. Check Toast Messages
- Open browser console
- All messages follow pattern: emoji + message
- Examples: 📧 ✅ 🔒 ❌ ⏰ 🎉 💳

---

## For Backend Implementation

### Start With This Checklist
1. **Read**: `BACKEND_IMPLEMENTATION_CHECKLIST.md`
   - All 6 API endpoints listed
   - Exact request/response formats
   - Database schema included
   - M-Pesa integration steps

2. **Create These API Endpoints**:
   - `POST /api/auth/register`
   - `GET /api/auth/register/status/{transactionId}`
   - `POST /api/auth/login`
   - `POST /api/auth/login/otp`
   - `POST /api/auth/send-otp`
   - `GET /api/auth/verify`

3. **Set Up Database Tables**:
   - `users` - User accounts
   - `otp_records` - OTP tracking
   - `registration_transactions` - M-Pesa payments
   - `login_attempts` - Security logs (optional but recommended)

4. **Integrate M-Pesa**:
   - Sign up for Safaricom Daraja API
   - Implement OAuth 2.0 authentication
   - Implement STK Push for payment
   - Set up webhook for payment notifications

5. **Set Up Notifications**:
   - Email service (SendGrid, Mailgun, etc.)
   - SMS service (Twilio, Africa's Talking, etc.)
   - Test templates

---

## File Locations

### Modified Frontend Files
```
app/
├── lib/
│   ├── api-client.ts        ✅ Updated with types
│   └── schemas.ts           ✅ Updated with interfaces
├── components/
│   ├── LoginForm.tsx        ✅ Step 1 implementation
│   └── RegisterForm.tsx     ✅ Registration + M-Pesa
└── verify-otp/
    └── VerifyOtpClient.tsx  ✅ Step 2 implementation
```

### Documentation Files
```
/
├── DOCUMENTATION_INDEX.md                    ← START HERE
├── IMPLEMENTATION_SUMMARY.md                 ← Executive Summary
├── AUTHENTICATION_IMPLEMENTATION.md          ← Technical Details
├── BACKEND_IMPLEMENTATION_CHECKLIST.md       ← For Backend Dev
├── TOAST_MESSAGES.md                         ← Message Reference
├── FLOW_VISUAL_GUIDE.md                      ← Visual Diagrams
└── this file (QUICK_START.md)
```

---

## Environment Variables

### Frontend
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
```

### Backend (Recommended)
```env
JWT_SECRET=your-secret-key-here
JWT_EXPIRATION=24h
BCRYPT_ROUNDS=10

# M-Pesa
SAFARICOM_CONSUMER_KEY=your_key
SAFARICOM_CONSUMER_SECRET=your_secret
SAFARICOM_BUSINESS_SHORTCODE=your_shortcode
MPESA_PASSKEY=your_passkey
MPESA_CALLBACK_URL=http://localhost:5000/api/payment/callback

# Email (SendGrid example)
SENDGRID_API_KEY=your_key
SENDGRID_FROM_EMAIL=noreply@pensions.com

# SMS (Twilio example)
TWILIO_ACCOUNT_SID=your_sid
TWILIO_AUTH_TOKEN=your_token
TWILIO_PHONE_NUMBER=+your_number
```

---

## API Response Format Examples

### Registration Success
```json
{
  "success": true,
  "status": "payment_initiated",
  "message": "Payment initiated...",
  "transactionId": "550e8400-e29b-41d4-a716-446655440000",
  "checkoutRequestId": "ws_1234567890",
  "statusCheckUrl": "/api/auth/register/status/550e8400-..."
}
```

### Login Success
```json
{
  "success": true,
  "message": "OTP sent to your email"
}
```

### OTP Success
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "customer"
  }
}
```

---

## Testing Scenarios

### Happy Path - Registration
```
1. Fill form with valid data
2. Get M-Pesa prompt on phone
3. Complete M-Pesa payment
4. Backend confirms payment
5. Account created with temp password
6. User auto-logged in
7. Redirected to dashboard
```

### Happy Path - Login
```
1. Enter email/username + password
2. Backend verifies password
3. OTP sent to email
4. User enters OTP
5. First-time? Set permanent password
6. JWT token issued
7. Redirected to dashboard
```

### Error Scenarios to Test
```
- Invalid password → locked after 5 attempts
- Invalid OTP → can resend, expires after 10 min
- Expired OTP → button to resend
- Payment failure → retry message
- Network errors → graceful error messages
```

---

## Key Implementation Notes

### Frontend is Ready ✅
- All components implement the spec exactly
- All toast messages use emoji
- All error handling is specific
- All validation is in place
- localStorage integration ready
- All loading states implemented

### Backend Must Implement ⏳
- **MUST**: All 6 API endpoints with exact response format
- **MUST**: M-Pesa payment integration
- **MUST**: Email/SMS sending for passwords and OTP
- **MUST**: Account lockout after 5 failed attempts
- **MUST**: OTP expiration after 10 minutes
- **MUST**: JWT token generation and validation
- **SHOULD**: Database schema as specified
- **SHOULD**: Security logging and monitoring

### Critical Error Messages
Backend **MUST** return these exact error messages:
```
- "Invalid email or password" → 401
- "Account locked due to too many failed login attempts..." → 403
- "Invalid OTP" → 401
- "OTP has expired" → 401
- "Password must be at least 6 characters" → 400
- "Email already registered" → 400
- "Failed to initiate payment..." → 500
```

Frontend uses these to determine what toast to show.

---

## Browser DevTools Tips

### Check Authentication
```javascript
// In browser console:
localStorage.getItem('auth_token')      // See JWT
localStorage.getItem('user')            // See user data
localStorage.getItem('auth_identifier') // See identifier
document.cookie                         // See auth cookie
```

### Test API Calls
```javascript
// Register
fetch('http://localhost:5000/api/auth/register', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'test@example.com',
    username: 'testuser',
    phone: '+254712345678'
  })
})

// Login
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    identifier: 'testuser',
    password: 'password123'
  })
})
```

---

## Common Issues & Solutions

### Issue: "Cannot find module"
```
Solution: npm install
```

### Issue: "Backend URL not found"
```
Check: NEXT_PUBLIC_BACKEND_URL environment variable
Make sure backend is running on correct port
```

### Issue: "Toast messages not showing"
```
Check: Sonner is installed (npm install sonner)
Check: Toast import is correct
```

### Issue: "OTP input not auto-advancing"
```
Check: OtpInput component is being used correctly
Check: onChange handler is updating state
```

---

## Next Steps Timeline

### Week 1: Backend Setup
- [ ] Database schema created
- [ ] API endpoints stubbed out
- [ ] M-Pesa integration started

### Week 2: Backend Implementation
- [ ] All 6 endpoints implemented
- [ ] M-Pesa integration complete
- [ ] Email/SMS integration complete

### Week 3: Integration Testing
- [ ] Complete end-to-end testing
- [ ] Fix any integration issues
- [ ] Security review

### Week 4: Production
- [ ] Deploy frontend
- [ ] Deploy backend with M-Pesa production credentials
- [ ] Set up monitoring

---

## Support Documents

- **For Frontend Issues**: See `AUTHENTICATION_IMPLEMENTATION.md`
- **For Backend Issues**: See `BACKEND_IMPLEMENTATION_CHECKLIST.md`
- **For Message Issues**: See `TOAST_MESSAGES.md`
- **For Flow Issues**: See `FLOW_VISUAL_GUIDE.md`
- **For Overview**: See `IMPLEMENTATION_SUMMARY.md`

---

## Success Criteria

✅ **Frontend is complete when**:
- All 5 modified files compile without errors
- Registration form submits data correctly
- Login redirects to OTP page
- OTP page shows password form for first-time users
- All toast messages display with emoji
- localStorage persists correctly

✅ **Backend is complete when**:
- All 6 API endpoints return correct response format
- M-Pesa payment works end-to-end
- Emails sent with temp passwords and OTP
- SMS sent with passwords
- Account lockout works (5 attempts, 15 min)
- OTP expiration works (10 minutes)
- JWT token verification works

✅ **System is complete when**:
- User can register → pay → login → access dashboard
- Error messages are specific and helpful
- All security features work as documented
- Load testing passes

---

**Ready to build?** Start with your backend team on `BACKEND_IMPLEMENTATION_CHECKLIST.md`! 🚀

---

**Last Updated**: December 25, 2025  
**Frontend Status**: ✅ Complete  
**Backend Status**: ⏳ Ready for Implementation
