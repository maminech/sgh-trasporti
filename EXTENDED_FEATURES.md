# 🚀 Extended Features Documentation

This document describes the newly implemented features based on the Future Expansion section of the project requirements.

## 📍 GPS Tracking Simulation

### Overview
A comprehensive GPS tracking system with simulation capabilities for testing and demonstration purposes. Allows real-time tracking of vehicle locations during transport operations.

### Backend Implementation

#### New Models
- **GPSLocation** (`backend/src/models/GPSLocation.js`)
  - Stores GPS coordinates, speed, heading, altitude, accuracy
  - Links to booking and vehicle
  - Supports both real and simulated data
  - Indexed for efficient queries

#### Controllers
- **gpsController.js** (`backend/src/controllers/gpsController.js`)
  - `getBookingGPSHistory` - Retrieve location history for a booking
  - `getCurrentLocation` - Get real-time location with ETA calculation
  - `getVehicleGPSHistory` - Track specific vehicle movements
  - `getActiveFleetLocations` - View all active vehicles on map
  - `startGPSSimulation` - Start simulated tracking
  - `stopGPSSimulation` - Stop simulation
  - `recordGPSLocation` - Record real GPS data from devices

#### Simulation Service
- **gpsSimulator.js** (`backend/src/services/gpsSimulator.js`)
  - Generates realistic route simulation between origin and destination
  - Calculates intermediate waypoints using interpolation
  - Simulates realistic speed variations (0-120 km/h)
  - Haversine distance calculation
  - Bearing/heading calculation
  - Automatic status updates (moving, stopped, idle)

#### API Endpoints
```
GET    /api/gps/booking/:bookingId              - GPS history for booking
GET    /api/gps/booking/:bookingId/current      - Current location with ETA
GET    /api/gps/vehicle/:vehicleId              - Vehicle GPS history
GET    /api/gps/fleet/active                    - All active fleet locations
POST   /api/gps/simulate/:bookingId/start       - Start simulation
POST   /api/gps/simulate/:bookingId/stop        - Stop simulation
GET    /api/gps/simulate/active                 - Active simulations
POST   /api/gps/location                        - Record GPS location
```

### Frontend Implementation

#### Components
- **GPSTrackingMap** (`frontend/src/components/tracking/GPSTrackingMap.tsx`)
  - Real-time location display
  - Progress bar with percentage
  - Speed, distance, and ETA cards
  - Vehicle and driver information
  - Auto-refresh capability (configurable interval)
  - Map placeholder (ready for Leaflet/Google Maps integration)

#### Pages
- **Tracking Page** (`frontend/src/app/[locale]/tracking/page.tsx`)
  - Enhanced tracking code search
  - Full booking details display
  - Integrated GPS map (for in-transit bookings)
  - Status history timeline
  - Origin and destination cards

- **Fleet Tracking Admin** (`frontend/src/app/[locale]/admin/fleet-tracking/page.tsx`)
  - Real-time fleet overview
  - Active vehicle count statistics
  - Fleet map view (placeholder for integration)
  - Vehicle list table with live data
  - Auto-refresh every 30 seconds

### Usage

#### Start GPS Simulation (Admin)
```javascript
// API call
POST /api/gps/simulate/:bookingId/start
{
  "updateInterval": 5000,    // Update every 5 seconds
  "speedKmH": 60,            // Average speed
  "steps": 50                // Number of waypoints
}
```

#### Track Package (Public)
```javascript
// Frontend
<GPSTrackingMap 
  bookingId="60f7b3b3b3b3b3b3b3b3b3b3" 
  autoRefresh={true}
  refreshInterval={30000}
/>
```

---

## 🏠 Customer Portal

### Overview
Secure client dashboard where customers can manage their bookings, view invoices, and track shipments.

### Backend Implementation

#### New Models
- **Invoice** (`backend/src/models/Invoice.js`)
  - Auto-generated invoice numbers (INV-YEAR-XXXXX)
  - Customer details (name, company, VAT, address)
  - Line items with tax calculation
  - Multiple payment methods
  - Status tracking (draft, sent, paid, overdue, cancelled)
  - Automatic due date calculation (default 30 days)

#### Controllers
- **invoiceController.js** (`backend/src/controllers/invoiceController.js`)
  - `createInvoice` - Generate invoice from booking
  - `getAllInvoices` - List with filters and pagination
  - `getInvoice` - Single invoice details
  - `updateInvoice` - Update status and payment info
  - `deleteInvoice` - Delete invoice and PDF
  - `generateInvoicePDF` - Export as PDF using PDFKit
  - `getInvoiceStats` - Revenue and payment statistics

#### PDF Generation
Uses **PDFKit** library to generate professional invoices with:
- Company header
- Customer billing information
- Itemized line items
- Tax calculations
- Totals and notes
- Downloadable PDF format

#### API Endpoints
```
POST   /api/invoices                 - Create invoice (admin)
GET    /api/invoices                 - List invoices (filtered by user)
GET    /api/invoices/:id             - Get invoice details
PUT    /api/invoices/:id             - Update invoice (admin)
DELETE /api/invoices/:id             - Delete invoice (admin)
GET    /api/invoices/:id/pdf         - Download PDF
GET    /api/invoices/stats           - Statistics (admin)
```

### Frontend Implementation

#### Components
- **CustomerLayout** (`frontend/src/components/portal/CustomerLayout.tsx`)
  - Sidebar navigation with menu items
  - User authentication check
  - Role-based access (client and admin)
  - Logout functionality
  - Mobile responsive with overlay

#### Pages

1. **Dashboard** (`frontend/src/app/[locale]/portal/page.tsx`)
   - KPI cards (active bookings, completed, pending invoices, total spent)
   - Recent bookings table
   - Quick action buttons (new booking, get quote)

2. **My Bookings** (`frontend/src/app/[locale]/portal/bookings/page.tsx`)
   - Complete bookings list with filters
   - Status-based color coding
   - Origin and destination display
   - Vehicle assignment info
   - "Track Live" button for in-transit bookings

3. **Invoices** (`frontend/src/app/[locale]/portal/invoices/page.tsx`)
   - Invoices table with status filters
   - View and download PDF actions
   - Summary cards (total, paid, outstanding)
   - Due date tracking

### Usage

#### Access Customer Portal
Navigate to: `/{locale}/portal`

Features available:
- Dashboard overview
- Booking history
- Invoice management
- Profile settings

---

## 💬 AI Chatbot Support

### Overview
Interactive chatbot widget with FAQ responses and live chat capabilities. Available on all public and portal pages.

### Implementation

#### Component
- **ChatbotWidget** (`frontend/src/components/chatbot/ChatbotWidget.tsx`)
  - Floating button in bottom-right corner
  - Expandable chat window
  - Message history
  - Quick reply buttons
  - Typing indicator
  - Keyword-based FAQ matching

#### Features
- **Auto-responses for common queries:**
  - Pricing information
  - Tracking instructions
  - Booking process
  - Contact information
  - Delivery times
  - Payment methods

- **UI Elements:**
  - User and bot message differentiation
  - Timestamps
  - Quick reply buttons
  - Responsive design
  - Smooth animations

#### FAQ Response Topics
```javascript
- 'pricing'   → Quote and pricing information
- 'tracking'  → How to track shipments
- 'booking'   → Booking process guide
- 'contact'   → Contact details
- 'delivery'  → Delivery time estimates
- 'payment'   → Payment methods accepted
```

### Integration
The chatbot is automatically loaded on all pages via the root layout:

```tsx
// frontend/src/app/[locale]/layout.tsx
import ChatbotWidget from '@/components/chatbot/ChatbotWidget';

<body>
  <NextIntlClientProvider messages={messages}>
    {children}
    <ChatbotWidget />  // Available everywhere
  </NextIntlClientProvider>
</body>
```

### Customization

#### Add New FAQ Responses
Edit `FAQ_RESPONSES` object in `ChatbotWidget.tsx`:

```typescript
const FAQ_RESPONSES: Record<string, string> = {
  newTopic: 'Your response here...',
  // Add more topics
};
```

#### Modify Appearance
Adjust Tailwind classes in the component:
- Chat button position
- Window size
- Colors and styling
- Animation speed

### Future Enhancements
- Backend API integration for chat history
- Admin dashboard for viewing conversations
- AI/ML integration (OpenAI, Dialogflow)
- Multi-language support
- File attachment support
- Email conversation transcripts

---

## 📊 API Updates

### New Dependencies
```json
// backend/package.json
{
  "pdfkit": "^0.15.0"  // PDF generation for invoices
}
```

### Updated API Client
```typescript
// frontend/src/lib/api.ts
api.gps.getActiveFleet()
api.gps.getCurrentLocation(bookingId)
api.gps.startSimulation(bookingId, options)

api.invoices.getAll(params)
api.invoices.getById(id)
api.invoices.downloadPDF(id)
```

---

## 🧪 Testing

### GPS Simulation Testing
1. Create a booking with origin and destination coordinates
2. Assign a vehicle to the booking
3. Start GPS simulation via admin panel or API
4. Monitor real-time updates on tracking page
5. Check fleet tracking admin page for live vehicle positions

### Customer Portal Testing
1. Register/login as a client
2. Navigate to `/portal`
3. Create bookings
4. Check invoice generation
5. Download invoice PDF
6. Test filters and search

### Chatbot Testing
1. Click chatbot button on any page
2. Test quick reply buttons
3. Type keywords: "pricing", "tracking", "booking"
4. Verify appropriate responses
5. Test on mobile devices

---

## 🔐 Security Considerations

### GPS Tracking
- Public endpoint for tracking requires valid booking ID
- Admin endpoints protected with JWT
- Rate limiting on GPS endpoints
- Input validation on coordinates

### Customer Portal
- JWT authentication required
- Role-based access control
- Customers can only see their own data
- Admins have full access

### Invoices
- PDF generation is server-side (no client exposure)
- Secure file handling
- Customer data validation
- XSS prevention in PDF content

---

## 🚀 Deployment Notes

### Environment Variables
Add to backend `.env`:
```env
# No additional variables required for these features
# Existing JWT_SECRET and MONGODB_URI are sufficient
```

### Database Migrations
Run seed script to create sample data:
```bash
cd backend
npm run seed
```

### Build Process
```bash
# Backend
cd backend
npm install
npm start

# Frontend
cd frontend
npm install
npm run build
npm start
```

---

## 📝 Future Roadmap

### GPS Tracking
- [ ] Real GPS device integration (Traccar, Geotab)
- [ ] WebSocket for true real-time updates
- [ ] Route optimization algorithms
- [ ] Geofencing and alerts
- [ ] Historical route playback

### Customer Portal
- [ ] Push notifications for status updates
- [ ] Online payment integration (Stripe)
- [ ] Booking templates for frequent routes
- [ ] Document upload/management
- [ ] Multi-user access per company

### Chatbot
- [ ] OpenAI GPT integration
- [ ] Sentiment analysis
- [ ] Human agent handoff
- [ ] Voice input support
- [ ] Analytics dashboard

---

## 📞 Support

For questions or issues with extended features:
- Email: dev@sghtrasporti.com
- Documentation: See README.md and INSTALLATION.md
- Issues: Submit via project repository

---

**Version:** 2.0.0  
**Last Updated:** October 2025  
**Author:** SGH Trasporti Development Team
