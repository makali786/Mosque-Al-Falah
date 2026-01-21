# Dynamic Donations & Campaigns Implementation

## Summary
Successfully implemented dynamic donation data fetching from the `donors` collection to display real-time donation statistics and recent supporters in the footer.

## ✅ What Was Implemented

### 1. **API Endpoint** (`/api/donations/recent`)
**File**: `/app/api/donations/recent/route.ts`

**Features**:
- Fetches recent donors from `donors` collection
- Calculates total donor count
- Sums up `totalDonated` field for funds raised
- Counts active donation campaigns
- Formats time ago for each donation
- Handles anonymous donors

**Response Format**:
```json
{
  "success": true,
  "recentDonors": [
    {
      "id": "donor_id",
      "name": "Mahfuzur Rahman",
      "amount": "£50 GBP,",
      "time": "10 minutes ago",
      "isAnonymous": false
    }
  ],
  "stats": {
    "campaigns": 4,
    "donors": 112,
    "fundsRaised": "£5,745",
    "fundsRaisedRaw": 5745
  }
}
```

### 2. **Footer Component Updates**
**File**: `/app/(frontend)/components/layout/Footer.tsx`

**Changes**:
- Added state for `recentDonors` (recent supporters)
- Added state for `donationStats` (campaigns, donors, funds raised)
- Added `useEffect` to fetch donation data on mount
- Replaced hardcoded `SUPPORTERS` with dynamic `recentDonors`
- Replaced hardcoded `STATS` with dynamic `donationStats`
- Falls back to default data if API fails

## 📊 Data Sources

### Donors Collection
```typescript
{
  id: string;
  displayName: string;
  firstName: string;
  lastName: string;
  isAnonymous: boolean;
  totalDonated: number;          // Sum of all donations
  lastDonationAmount: number;    // Most recent donation amount
  lastDonationDate: string;      // ISO date string
}
```

### Donation Appeals Collection
```typescript
{
  isActive: boolean;  // Used to count active campaigns
}
```

## 🎯 Features

### Recent Supporters
- Shows 4 most recent donors
- Displays donor name (or "An Anonymous kind soul")
- Shows last donation amount
- Calculates and displays time ago
- Updates automatically on page load

### Statistics
1. **Campaigns**: Total count of active donation appeals
2. **Donors**: Total count of all donors in database
3. **Funds Raised**: Sum of `totalDonated` from all donors

### Time Ago Calculation
- "just now" - less than 1 minute
- "X minutes ago" - less than 1 hour
- "X hours ago" - less than 24 hours
- "X days ago" - less than 30 days
- "X months ago" - 30+ days

## 🔄 How It Works

1. **Page Load**: Footer component mounts
2. **API Call**: Fetches `/api/donations/recent?limit=4`
3. **Data Processing**: API queries donors collection and calculates stats
4. **State Update**: Component updates `recentDonors` and `donationStats`
5. **UI Render**: Footer displays dynamic data
6. **Fallback**: If API fails, shows default hardcoded data

## 📁 Files Modified

1. ✅ `/app/api/donations/recent/route.ts` - **NEW** - API endpoint
2. ✅ `/app/(frontend)/components/layout/Footer.tsx` - Dynamic data fetching

## 🚀 Usage

### API Endpoint
```bash
GET /api/donations/recent?limit=4
```

**Query Parameters**:
- `limit` (optional): Number of recent donors to return (default: 4)

### Frontend
The footer automatically fetches and displays data. No manual intervention needed.

## ✨ Benefits

1. **Real-Time Data**: Shows actual donation statistics
2. **Automatic Updates**: Refreshes on every page load
3. **Graceful Fallback**: Shows default data if API fails
4. **No Backend Changes**: Only frontend fetching, backend unchanged
5. **Performance**: Efficient queries with limits
6. **User Privacy**: Respects anonymous donor preferences

## 🧪 Testing

### Test the API
```bash
curl http://localhost:3000/api/donations/recent?limit=4
```

### Expected Response
```json
{
  "success": true,
  "recentDonors": [...],
  "stats": {
    "campaigns": 4,
    "donors": 112,
    "fundsRaised": "£5,745",
    "fundsRaisedRaw": 5745
  }
}
```

### Verify in Footer
1. Open any page on the site
2. Scroll to footer
3. Check "Recent supporters" section
4. Check "Donations & Campaigns" stats
5. Verify numbers match database

## 🔧 Configuration

### Change Number of Supporters
In `Footer.tsx`, update the fetch call:
```typescript
const response = await fetch('/api/donations/recent?limit=6'); // Show 6 instead of 4
```

### Customize Time Format
Edit the time calculation logic in `/app/api/donations/recent/route.ts`

## 📝 Notes

- Data refreshes on every page load (not real-time)
- Anonymous donors show as "An Anonymous kind soul"
- Funds raised is sum of all `totalDonated` fields
- Campaign count only includes active campaigns
- Falls back to hardcoded data if API fails

## 🎨 UI Preservation

- ✅ No design changes
- ✅ Same layout and styling
- ✅ Smooth loading (no flicker)
- ✅ Maintains responsive design
- ✅ Consistent with existing UI

## 🔮 Future Enhancements

1. **Real-Time Updates**: Use WebSockets or polling
2. **Caching**: Cache API response for better performance
3. **Loading States**: Show skeleton loaders
4. **Error Messages**: Display user-friendly errors
5. **Donor Profiles**: Link to donor profile pages
6. **Donation Trends**: Show growth charts
7. **Top Donors**: Highlight biggest contributors
