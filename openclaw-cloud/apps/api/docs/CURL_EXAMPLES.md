# Credits & Usage API - cURL Examples

Base URL: `http://localhost:3001/api` (adjust if different)

**Auth:** All endpoints require `Authorization: Bearer <JWT>` from login/register.

## Credits Balance

```bash
curl -s "http://localhost:3001/api/v1/credits/balance" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "balance": 12345,
  "plan": "starter_20",
  "mode": "STRONG",
  "thresholds": { "smart": 800, "light": 200, "queue": 0 },
  "queued": false
}
```

## Usage Today

```bash
curl -s "http://localhost:3001/api/v1/usage/today" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
{
  "day": "2026-02-11",
  "usedCredits": 320,
  "balance": 3680
}
```

## Usage History

```bash
# Last 7 days (default)
curl -s "http://localhost:3001/api/v1/usage/history" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Last 30 days
curl -s "http://localhost:3001/api/v1/usage/history?range=30d" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Response:**
```json
[
  { "day": "2026-02-05", "usedCredits": 120 },
  { "day": "2026-02-06", "usedCredits": 0 },
  { "day": "2026-02-07", "usedCredits": 450 }
]
```

## Service Methods (Webhook / Chat)

Internal endpoints removed. Stripe webhook calls `CreditsService` directly.

```typescript
await creditsService.grantMonthlyCredits('userId', 'starter_20', 'inv_xxx');
await creditsService.topupCredits('userId', 'topup10', 'pi_xxx');
await creditsService.debitForChat('userId', 'requestId', 50);
```
