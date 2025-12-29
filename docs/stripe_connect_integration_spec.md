# Stripe Connect Integration

## GOALS
- Pay creators
- Enable tipping
- Handle 90/10 Founding 50 split

---

# 1. ACCOUNT TYPES

Creators → Stripe Express Accounts  
Platform → Standard account

---

# 2. REQUIRED API CALLS

POST /stripe/connect/create  
POST /stripe/payouts  
POST /tips/create-payment-intent  

---

# 3. 90/10 REVENUE SPLIT LOGIC

If Founding 50:
- Creator receives 90%
- Platform receives 10%

Else:
- Normal split (to be defined)
