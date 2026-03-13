
Create a STUNNING, WORLD-CLASS frontend application using React and TypeScript that will make users say "WOW!"

**Design Philosophy:**
- Create a visually striking, modern interface that feels premium and engaging
- Use bold colors, smooth animations, and micro-interactions throughout
- Implement glassmorphism, gradient backgrounds, and contemporary design trends
- Every page should feel alive with subtle animations and hover effects
- Mobile-first responsive design that looks amazing on all devices

**Backend Details:**
- Framework: Laravel (PHP)
- API Authentication: Laravel Sanctum (for authenticated routes)
- Base API URL: Assume `/api` relative to the frontend application's host.
- ALL endpoints MUST be consumed and integrated

**Styling & Visual Design:**
- Utilize Tailwind CSS with custom configurations for premium aesthetics
- Implement a cohesive design system with:
  - Modern color palette (dark theme support)
  - Custom gradients and glassmorphism effects
  - Smooth animations using Framer Motion or CSS transitions
  - Interactive elements with hover states and micro-interactions
  - Beautiful loading states and skeleton screens
  - Toast notifications for user feedback
  - Modal dialogs with backdrop blur effects

**COMPLETE PAGE IMPLEMENTATION:**

## 1. **PUBLIC PAGES (Stunning Landing Experience):**

### **Home Page (`/`)** 
- Hero section with animated gradient background and floating elements
- Interactive service categories with hover animations
- Featured services carousel with smooth transitions
- Latest blog posts grid with image overlays
- Testimonials section with rotating cards
- Call-to-action sections with pulsing buttons
- Stats counter animation
- Newsletter signup with animated success states

### **Services Listing (`/services`)**
- Advanced filtering sidebar with animated toggles
- Service cards with image galleries and hover effects
- Map integration showing service locations
- Infinite scroll with loading animations
- Price range slider with real-time updates
- Category tags with color coding
- Sort options with smooth transitions
- "Book Now" and "WhatsApp" buttons with distinct styling

### **Service Details (`/services/:id`)**
- Image gallery with lightbox and zoom functionality
- Seller profile card with ratings and reviews
- Booking form with date/time picker and animations
- Related services suggestions
- Review system with star ratings and user avatars
- Pricing breakdown with animated counters
- WhatsApp booking with pre-filled message generation
- Share functionality with social media integration

### **Blog Listing (`/blog`)**
- Masonry layout with stunning image overlays
- Category filtering with smooth transitions
- Search functionality with real-time results
- Featured posts with larger cards
- Author information with avatars
- Reading time estimation
- Social sharing buttons

### **Blog Post Details (`/blog/:slug`)**
- Beautiful typography with reading progress indicator
- Table of contents with smooth scrolling
- Related posts suggestions
- Comment system (if implemented in backend)
- Social sharing with custom messages
- Author bio section with animated entrance

### **Contact Page (`/contact`)**
- Split-screen layout with contact form and information
- Interactive form with real-time validation
- Success/error animations
- WhatsApp quick contact button
- Office location with embedded map
- Contact information cards with icons

## 2. **AUTHENTICATION FLOWS (Seamless Experience):**

### **Login (`/login`)**
- Centered card with glassmorphism effect
- Animated form fields with floating labels
- Social login options (if available)
- "Remember me" toggle with smooth animation
- Password visibility toggle
- Loading states with spinners

### **Registration Selection (`/register`)**
- Split-screen design with two distinct paths
- Animated cards for Customer vs Seller options
- Interactive comparison table
- Smooth transitions between selections
- Benefits highlighting for each user type

### **Customer Registration (`/register/customer`)**
- Multi-step form with progress indicator
- Animated field validation
- Profile picture upload with preview
- Terms acceptance with animated checkbox
- Success animation with confetti effect

### **Seller Registration (`/register/seller`)**
- Enhanced multi-step form with business information
- Document upload areas with drag-and-drop
- Business category selection with visual icons
- Service area mapping interface
- Portfolio upload section
- Verification status indicators

### **Forgot Password (`/forgot-password`)**
- Simple, elegant form with email animation
- Success state with checkmark animation
- Resend timer with countdown

### **Reset Password (`/reset-password/:token`)**
- Password strength indicator with real-time feedback
- Success animation with redirect countdown

## 3. **USER DASHBOARDS (Role-Based Excellence):**

### **Shared Profile Edit (`/dashboard/profile/edit`)**
- Tabbed interface with smooth transitions
- Profile picture upload with crop functionality
- Form validation with inline error messages
- Phone/email verification status indicators
- Save button with loading and success states

## **CUSTOMER DASHBOARD (`/dashboard/customer`):**

### **Overview (`/dashboard/customer`)**
- Welcome message with user avatar
- Dashboard widgets with animated statistics
- Quick actions with icon buttons
- Recent activity timeline
- Upcoming appointments with countdown timers
- WhatsApp booking shortcuts

### **My Appointments (`/dashboard/customer/appointments`)**
- Calendar view with appointment markers
- List view with status badges
- Filter by status/date with smooth transitions
- Appointment details modal with all information
- Reschedule/cancel functionality with confirmations
- WhatsApp-originated appointments clearly marked

### **Payment History (`/dashboard/customer/payments`)**
- Transaction cards with payment method icons
- Search and filter functionality
- Downloadable receipts with PDF generation
- Payment status indicators with color coding
- Refund request functionality (if available)
- Charts showing spending patterns

### **WhatsApp Bookings (`/dashboard/customer/whatsapp-bookings`)**
- Integration status indicators
- Booking history from WhatsApp interactions
- Quick WhatsApp contact buttons
- Conversation history display
- Booking status tracking

## **SELLER DASHBOARD (`/dashboard/seller`):**

### **Overview (`/dashboard/seller`)**
- Revenue analytics with animated charts
- Service performance metrics
- Recent bookings and inquiries
- WhatsApp interaction statistics
- Quick service management actions
- Earnings summary with growth indicators

### **My Services (`/dashboard/seller/services`)**
- Grid/list toggle with smooth transitions
- Service cards with edit/delete actions
- Performance metrics per service
- Quick enable/disable toggles
- Bulk actions for multiple services
- Media management with upload progress

### **Create Service (`/dashboard/seller/services/create`)**
- Multi-step service creation wizard
- Rich text editor for descriptions
- Image upload with drag-and-drop and preview
- Pricing calculator with dynamic updates
- Category selection with visual representations
- Location selector with map integration
- WhatsApp contact preferences

### **Edit Service (`/dashboard/seller/services/:id/edit`)**
- Pre-populated forms with current data
- Version history (if backend supports)
- Media gallery management
- SEO optimization fields
- Performance analytics integration

### **WhatsApp Inquiries (`/dashboard/seller/whatsapp-inquiries`)**
- Inquiry cards with customer information
- Response time tracking
- Quick reply templates
- Conversion tracking from inquiry to booking
- Auto-generated WhatsApp links

### **Package Upgrade (`/dashboard/seller/package-upgrade`)**
- Comparison table with animated features
- Current plan highlighting
- Upgrade benefits with animations
- Payment integration for upgrades
- Feature usage tracking

## **ADMIN PANEL (`/admin/*`) - Complete Management Suite:**

### **Dashboard (`/admin/dashboard`)**
- Comprehensive analytics with interactive charts
- System health indicators
- Recent activity feed
- Quick action buttons
- Performance metrics with real-time updates
- Revenue analytics with growth trends

### **User Management (`/admin/users`, `/admin/users/:id`)**
- Advanced user table with sorting/filtering
- User detail modals with complete information
- Role management with visual indicators
- Account status toggles
- Bulk user operations
- User activity logs
- Communication tools

### **Service Management (`/admin/services`, `/admin/services/:id`)**
- Service approval workflow
- Featured service management
- Category management with drag-and-drop
- Bulk service operations
- Service analytics and performance
- Media management tools

### **Appointment Management (`/admin/appointments`, `/admin/appointments/:id`)**
- Calendar overview with appointment density
- Appointment details with all parties' information
- Status management with workflow indicators
- Dispute resolution tools
- Appointment analytics and trends
- Automated reminders management

### **Payment Management (`/admin/payments`, `/admin/payments/:id`)**
- Transaction monitoring with real-time updates
- Payment method analytics
- Refund processing interface
- Revenue analytics with detailed breakdowns
- Failed payment tracking and resolution
- Financial reporting tools

### **Contact Management (`/admin/contacts`, `/admin/contacts/:id`)**
- Contact inquiry queue with priority indicators
- Response templates and quick replies
- Conversation history tracking
- Resolution status management
- Auto-assignment rules
- Response time analytics

### **Blog Management (`/admin/blogs`, `/admin/blogs/create`, `/admin/blogs/:id/edit`)**
- Rich content editor with media integration
- SEO optimization tools
- Publishing workflow with draft/published states
- Comment moderation (if implemented)
- Blog analytics with engagement metrics
- Content calendar management

### **WhatsApp Analytics (`/admin/whatsapp-analytics`)**
- Interaction volume tracking
- Conversion rate analytics
- Popular inquiry types
- Response time metrics
- User engagement patterns
- ROI calculation for WhatsApp channel

## **TECHNICAL IMPLEMENTATION REQUIREMENTS:**

### **State Management:**
- Use React Context API or Zustand for global state
- Implement proper caching strategies for API responses
- Handle offline scenarios gracefully
- Manage loading states consistently across the application

### **API Integration:**
- Consume ALL provided endpoints without exception
- Implement proper error handling with user-friendly messages
- Add retry mechanisms for failed requests
- Implement optimistic updates where appropriate
- Handle authentication token refresh automatically

### **Performance Optimization:**
- Implement code splitting and lazy loading
- Optimize images with lazy loading and proper formats
- Use virtual scrolling for large lists
- Implement proper caching strategies
- Minimize bundle size with tree shaking

### **Accessibility:**
- Implement WCAG 2.1 AA compliance
- Proper ARIA labels and semantic HTML
- Keyboard navigation support
- Screen reader compatibility
- Color contrast compliance

### **WhatsApp Integration Features:**
- Generate dynamic WhatsApp links with pre-filled messages
- Service-specific message templates
- Customer information pre-population
- Cross-platform compatibility (mobile/desktop)
- Deep link handling for mobile apps
- Tracking for WhatsApp-originated interactions

### **Advanced Features:**
- Real-time notifications (if WebSocket available)
- Progressive Web App capabilities
- Dark/light theme switching
- Multi-language support preparation
- Print-friendly styles for receipts and reports
- Export functionality (PDF, CSV) where relevant

### **Form Handling:**
- Real-time validation with debounced API calls
- Auto-save functionality for long forms
- Progress indicators for multi-step forms
- Proper error display with field-level feedback
- Success animations and confirmations

### **Security Considerations:**
- Implement proper route protection based on user roles
- Sanitize user inputs on display
- Handle sensitive data appropriately
- Implement CSRF protection in forms
- Secure file upload handling

## **VISUAL DESIGN SPECIFICATIONS:**
Use purple-pink-white theme
### **Animation Guidelines:**
- Subtle entrance animations for page loads
- Hover effects on interactive elements
- Loading animations that feel engaging
- Smooth transitions between states
- Micro-interactions for user feedback
- Performance-conscious animation choices

### **Component Design:**
- Cards with subtle shadows and hover effects
- Buttons with multiple states (default, hover, active, disabled)
- Form inputs with floating labels and validation states
- Modals with backdrop blur and smooth scaling
- Toast notifications with slide-in animations
- Loading skeletons that match content structure

## **IMPLEMENTATION PRIORITY:**

1. **Foundation Setup** (Authentication, routing, API integration)
2. **Core Public Pages** (Home, Services, Blog)
3. **Authentication Flows** (Registration paths, login, password reset)
4. **Customer Dashboard** (Complete with all sub-pages)
5. **Seller Dashboard** (Complete with all sub-pages)
6. **Admin Panel** (Complete management interface)
7. **WhatsApp Integration** (Throughout all relevant pages)
8. **Advanced Features** (Analytics, real-time updates, PWA)
9. **Performance Optimization** (Code splitting, caching)
10. **Final Polish** (Animations, accessibility, testing)

## **SUCCESS CRITERIA:**
- Every single API endpoint is consumed and integrated
- All pages are fully functional with real data
- User experience feels smooth and professional
- Mobile responsiveness is perfect across all devices
- Loading times are optimized and feel instant
- Error handling is comprehensive and user-friendly
- The application feels like a premium, modern web app
- Users can complete all workflows without confusion
- Admin panel provides complete system management
- WhatsApp integration works seamlessly across platforms

**Make this frontend application absolutely STUNNING - something users will love to use and admins will be proud to manage. Every interaction should feel polished and professional. below is reference to understand the endpoints much better. **
This plartform is tailored for Themabinti Services Hub, A modern, inclusive platform connecting people in Kenya with quality beauty, health, and lifestyle services.
---

# **Themabinti Services Hub - Frontend API Consumption Guide**

This document details the expected API endpoints, request formats, and response structures for the Themabinti Services Hub backend (Laravel API). The frontend application should consume these APIs to provide a seamless user experience.

---

## **General Principles for API Consumption**

1.  **API Base URL:** All endpoints are relative to your configured API base URL (e.g., `https://api.themabinti.com/api` or `http://localhost:8000/api`).
2.  **Authentication:**
    *   **Token Storage:** Upon successful `register` or `login`, the `access_token` received must be stored client-side (e.g., in `localStorage`).
    *   **Authorization Header:** For all **authenticated** requests, include the `Authorization` header: `Authorization: Bearer [YOUR_ACCESS_TOKEN]`.
    *   **`X-CSRF-TOKEN`:** For all `POST`, `PUT`, `PATCH`, `DELETE` requests originating from the frontend (whether regular forms or AJAX), include the `X-CSRF-TOKEN` header. This token can be retrieved from `<meta name="csrf-token" content="...">` in your main Blade layout.
    *   **Redirect on Unauthorized:** If any authenticated request receives a `401 Unauthorized` or `403 Forbidden` response, the frontend **must** clear the stored token and redirect the user to the `/login` page with an appropriate flash message (e.g., "Session expired. Please log in again.").
3.  **Content-Type:**
    *   For `POST`, `PUT`, `PATCH` requests with JSON bodies: `Content-Type: application/json`.
    *   For `POST`, `PUT` requests involving file uploads (e.g., profile image, service media): `Content-Type: multipart/form-data`. (Usually set automatically by browser when using `FormData` object).
4.  **Accept Header:** Always include `Accept: application/json` to ensure JSON responses.
5.  **Pagination:** For endpoints returning paginated data, the response will follow Laravel's default pagination structure:
    ```json
    {
        "data": [...], // Array of resource objects
        "current_page": 1,
        "first_page_url": "...",
        "from": 1,
        "last_page": 5,
        "last_page_url": "...",
        "links": [...], // Array of pagination link objects
        "next_page_url": "...",
        "path": "...",
        "per_page": 15,
        "prev_page_url": null,
        "to": 15,
        "total": 75
    }
    ```
    The frontend should render `data` and use the `links` (or `current_page`, `last_page` etc.) for pagination controls.
6.  **Error Handling:**
    *   **`422 Unprocessable Entity` (Validation Error):**
        ```json
        {
            "message": "The given data was invalid.",
            "errors": {
                "field_name_1": ["Error message 1.", "Error message 2."],
                "field_name_2": ["Another error message."]
            }
        }
        ```
        The frontend should parse the `errors` object and display messages next to the corresponding form fields.
    *   **`403 Forbidden` (Authorization Error):**
        ```json
        {
            "message": "Unauthorized. Only sellers can perform this action."
        }
        ```
        The frontend should display a generic error toast and redirect if session expired.
    *   **`404 Not Found`:**
        ```json
        {
            "message": "Resource not found."
        }
        ```
        The frontend should display a user-friendly "Not Found" page or message.
    *   **`500 Internal Server Error` (Generic Server Error):**
        ```json
        {
            "message": "Server Error", // Or more detailed message in debug mode
            "exception": "...", // Only in debug
            "file": "...",      // Only in debug
            "line": "..."       // Only in debug
        }
        ```
        The frontend should display a generic "An unexpected error occurred" toast.
7.  **Flash Messages:** After successful operations (e.g., login, service created), the frontend should dispatch a global `flash-message` event (as implemented in `layouts/app.blade.php`) to show a toast notification.

---

## **API Endpoints Documentation**

### **I. Authentication & User Profile Management**

| Endpoint | Method | Auth Required | Request Body/Params | Expected Success Response (Status & Body) | Expected Error Responses | Frontend Action |
| :------- | :----- | :------------ | :------------------ | :---------------------------------------- | :----------------------- | :-------------- |
| `/register` | `POST` | No | `name` (string), `email` (string), `phone_number` (string), `password` (string), `password_confirmation` (string), `user_type` (enum: 'customer', 'seller'), `seller_package` (enum: 'basic', 'standard', 'premium', nullable, required if `user_type` is 'seller') | `201 Created`<br> `{ "message": "Registration successful...", "user": {id, name, email, user_type, ...}, "access_token": "...", "token_type": "Bearer" }` | `422` (Validation errors, e.g., unique email/phone, password mismatch, invalid package) | Store token, show success toast, **redirect to `/verify-email`** or `/dashboard`. |
| `/login` | `POST` | No | `email` (string), `password` (string) | `200 OK`<br> `{ "message": "Login successful.", "user": {id, name, email, user_type, is_active, ...}, "access_token": "...", "token_type": "Bearer" }` | `422` (Invalid credentials, inactive account) | Store token, show success toast, **redirect based on `user.user_type`** (`/admin/dashboard` or `/dashboard`). |
| `/logout` | `POST` | Yes | None | `200 OK`<br> `{ "message": "Logged out successfully." }` | `401` | Clear stored token, show success toast, **redirect to `/login`**. |
| `/forgot-password` | `POST` | No | `email` (string) | `200 OK`<br> `{ "message": "Password reset link sent!", "status": "passwords.sent" }` | `422` (e.g., email not found, invalid email format) | Show success/error toast. |
| `/reset-password` | `POST` | No | `token` (string), `email` (string), `password` (string), `password_confirmation` (string) | `200 OK`<br> `{ "message": "Password has been reset successfully!", "status": "passwords.reset" }` | `422` (Invalid token, email mismatch, password validation) | Show success/error toast, **redirect to `/login`**. |
| `/email/verify/{id}/{hash}` | `GET` | No (link is signed) | URL parameters `id`, `hash`, `expires`, `signature` | `200 OK`<br> `{ "message": "Email verified successfully!" }` | `403` (Invalid/expired link), `404` (User not found), `200` (Email already verified) | Display verification status on page. |
| `/email/resend` | `POST` | No (or Yes, depends on context) | `email` (string) | `200 OK`<br> `{ "message": "Verification link sent!" }` | `422` (e.g., email not found, already verified) | Show success/error toast. |
| `/phone/verify/request` | `POST` | Yes | None | `200 OK`<br> `{ "message": "Verification code sent to your phone number." }` | `401`, `403` (Already verified) | Show info toast, prompt for OTP input. |
| `/phone/verify/check` | `POST` | Yes | `otp` (string) | `200 OK`<br> `{ "message": "Phone number verified successfully!" }` | `401`, `403` (Already verified), `422` (Invalid OTP) | Show success/error toast, **redirect to `/dashboard` or refresh user state**. |
| `/user` | `GET` | Yes | None | `200 OK`<br> `{ "user": {id, name, email, phone_number, location, bio, profile_image, is_active, user_type, seller_package, package_expiry_date, ...} }` | `401` | Display user profile data. |
| `/user` | `PUT` | Yes | `name` (string, optional), `email` (string, optional), `phone_number` (string, optional), `location` (string, nullable), `bio` (text, nullable) | `200 OK`<br> `{ "message": "Profile updated successfully.", "user": {...updated_user_data...} }` | `401`, `422` (Validation errors, e.g., duplicate email/phone) | Show success toast, update local user state. |
| `/user/profile-image` | `POST` | Yes | `profile_image` (file, `multipart/form-data`) | `200 OK`<br> `{ "message": "Profile image uploaded successfully.", "profile_image_url": "..." }` | `401`, `422` (File validation: type, size) | Show success toast, update profile image display. |

---

### **II. Service Management**

| Endpoint | Method | Auth Required | Request Body/Params | Expected Success Response (Status & Body) | Expected Error Responses | Frontend Action |
| :------- | :----- | :------------ | :------------------ | :---------------------------------------- | :----------------------- | :-------------- |
| `/services` | `GET` | No | Query Params: `category`, `location`, `min_price`, `max_price`, `is_mobile` (boolean), `search` (string), `page` (int), `limit` (int) | `200 OK`<br> (Paginated list of `Service` objects including `user` relationship) | `500` (Backend error) | Render service grid, update filter UI, handle pagination. |
| `/services/{id}` | `GET` | No | URL parameter `id` (int) | `200 OK`<br> (`Service` object including `user` relationship) | `404` (Service not found or inactive) | Render service details, media gallery, provider info. |
| `/services` | `POST` | Yes (Seller) | `title` (string), `description` (text), `category` (string), `subcategory` (string, nullable), `price` (decimal), `duration` (integer), `location` (string), `is_mobile` (boolean), `media_files[]` (array of files, `multipart/form-data`) | `201 Created`<br> `{ "message": "Service created successfully.", "service": {...new_service_data...} }` | `401`, `403` (Not a seller, inactive seller, package limit reached), `422` (Validation errors: e.g., missing fields, invalid file types/sizes, exceeding media limits) | Show success toast, redirect to seller's services page. |
| `/services/{id}` | `PUT` | Yes (Seller - Owner Only) | `title`, `description`, `category`, `subcategory`, `price`, `duration`, `location`, `is_mobile`, `is_active` (boolean) (All optional, only fields to update) | `200 OK`<br> `{ "message": "Service updated successfully.", "service": {...updated_service_data...} }` | `401`, `403` (Not owner), `404` | Show success toast, update service details display or refresh list. |
| `/services/{id}` | `DELETE` | Yes (Seller - Owner Only) | None | `200 OK`<br> `{ "message": "Service deleted successfully." }` | `401`, `403` (Not owner), `404` | Show success toast, remove service from list. |
| `/services/{id}/media` | `POST` | Yes (Seller - Owner Only) | `media_files[]` (array of files, `multipart/form-data`) | `200 OK`<br> `{ "message": "Media files uploaded successfully.", "service": {...service_with_updated_media...} }` | `401`, `403`, `422` (File validation, package limits) | Show success toast, update service media display. |

---

### **III. Appointment System**

| Endpoint | Method | Auth Required | Request Body/Params | Expected Success Response (Status & Body) | Expected Error Responses | Frontend Action |
| :------- | :----- | :------------ | :------------------ | :---------------------------------------- | :----------------------- | :-------------- |
| `/appointments` | `GET` | Yes | Query Params: `status` (pending, confirmed, completed, cancelled), `customer_id`, `seller_id`, `page` (int), `limit` (int) | `200 OK`<br> (Paginated list of `Appointment` objects including `customer`, `seller`, `service` relationships) | `401` | Render appointment list/table. |
| `/appointments` | `POST` | Yes (Customer) | `service_id` (int), `appointment_date` (datetime: `YYYY-MM-DD HH:MM:SS`), `notes` (text, nullable) | `201 Created`<br> `{ "message": "Appointment booked successfully...", "appointment": {...new_appointment_data...} }` | `401`, `403` (Not a customer), `422` (Validation: invalid date, service not found/inactive, booking own service) | Show success toast, redirect to customer's appointments dashboard. |
| `/appointments/{id}` | `PUT` | Yes (Customer/Seller) | `status` (enum: 'confirmed', 'completed', 'cancelled'), `notes` (text, nullable) | `200 OK`<br> `{ "message": "Appointment updated successfully.", "appointment": {...updated_appointment_data...} }` | `401`, `403` (Not customer/seller, customer trying to confirm/complete), `404`, `422` | Show success toast, update appointment display or refresh list. |

---

### **IV. Payments & Seller Packages**

| Endpoint | Method | Auth Required | Request Body/Params | Expected Success Response (Status & Body) | Expected Error Responses | Frontend Action |
| :------- | :----- | :------------ | :------------------ | :---------------------------------------- | :----------------------- | :-------------- |
| `/payments/initiate` | `POST` | Yes | `amount` (decimal), `phone_number` (string, M-Pesa format `2547XXXXXXXX`), `payment_type` (enum: 'seller_registration', 'package_upgrade', 'service_payment'), `package_type` (enum: 'basic', 'standard', 'premium', nullable, required if `payment_type` is related to package), `service_id` (int, nullable, required if `payment_type` is `service_payment`), `appointment_id` (int, nullable, required if `payment_type` is `service_payment`) | `200 OK`<br> `{ "message": "STK push initiated...", "checkout_request_id": "...", "payment_id": int }` | `401`, `422` (Validation: invalid phone, amount, missing type/package/service/appointment, M-Pesa API error during initiation) | Show info toast (M-Pesa prompt), store `checkout_request_id`, **begin polling `/payments/status/{checkoutRequestId}`**. |
| `/mpesa/callback` | `POST` | **NO** | Raw JSON from M-Pesa. Handled by backend. Frontend does not call this. | `200 OK`<br> (Laravel expects this immediately) | | This is a backend-only route. |
| `/payments/status/{checkoutRequestId}` | `GET` | Yes | URL parameter `checkoutRequestId` (string) | `200 OK`<br> `{ "status": "pending/completed/failed/cancelled", "payment": {...full_payment_record...}, "message": "..." }` | `401`, `404` (Payment record not found for user) | Poll this endpoint. If `status` is 'completed', stop polling, show success, update user's package (refresh data). If 'failed'/'cancelled', stop polling, show error. If 'pending', continue polling. |
| `/payments/history` | `GET` | Yes | Query Params: `status`, `payment_type`, `search` (receipt/phone/email), `page` (int) | `200 OK`<br> `{ "payments": (Paginated list of `Payment` objects), "message": "..." }` | `401` | Render user's payment history table. |

---

### **V. Admin Panel (All `admin/*` endpoints)**

All Admin endpoints require `Auth: Admin`.

| Endpoint | Method | Auth Required | Request Body/Params | Expected Success Response (Status & Body) | Expected Error Responses | Frontend Action |
| :------- | :----- | :------------ | :------------------ | :---------------------------------------- | :----------------------- | :-------------- |
| `/admin/dashboard` | `GET` | Yes (Admin) | None | `200 OK`<br> `{ "stats": {total_users, total_sellers, ..., monthly_revenue, ...}, "charts": {revenue_trend_last_6_months: [...], appointment_status_breakdown: [...]}, "message": "..." }` | `401`, `403` (Not admin) | Render dashboard overview with KPIs and charts. |
| `/admin/users` | `GET` | Yes (Admin) | Query Params: `user_type`, `is_active`, `seller_package`, `search`, `page` | `200 OK`<br> (Paginated list of `User` objects) | `401`, `403` | Render users table, apply filters. |
| `/admin/users/{id}` | `GET` | Yes (Admin) | URL parameter `id` (int) | `200 OK`<br> (`User` object) | `401`, `403`, `404` | Display single user details. |
| `/admin/users/{id}` | `PUT` | Yes (Admin) | `is_active` (boolean) | `200 OK`<br> `{ "message": "User status updated successfully.", "user": {...} }` | `401`, `403` (Cannot deactivate self), `404`, `422` | Show success toast, update user status in table/display. |
| `/admin/users/{id}` | `DELETE` | Yes (Admin) | None | `200 OK`<br> `{ "message": "User deactivated successfully (not deleted)." }` (Note: Backend currently deactivates, not hard deletes) | `401`, `403` (Cannot delete self), `404` | Show success toast, remove/mark user as deactivated in table. |
| `/admin/services` | `GET` | Yes (Admin) | Query Params: `is_active`, `category`, `seller_id`, `search`, `page` | `200 OK`<br> (Paginated list of `Service` objects with `user` relationship) | `401`, `403` | Render services table, apply filters. |
| `/admin/services/{id}` | `GET` | Yes (Admin) | URL parameter `id` (int) | `200 OK`<br> (`Service` object with `user` relationship) | `401`, `403`, `404` | Display single service details. |
| `/admin/services/{id}` | `PUT` | Yes (Admin) | `is_active` (boolean) | `200 OK`<br> `{ "message": "Service status updated successfully.", "service": {...} }` | `401`, `403`, `404`, `422` | Show success toast, update service status in table/display. |
| `/admin/payments` | `GET` | Yes (Admin) | Query Params: `status`, `payment_type`, `user_id`, `search` (receipt/checkout ID/phone/email), `page` | `200 OK`<br> (Paginated list of `Payment` objects with `user` relationship) | `401`, `403` | Render payments table, apply filters. |
| `/admin/payments/{id}` | `GET` | Yes (Admin) | URL parameter `id` (int) | `200 OK`<br> (`Payment` object with `user` relationship) | `401`, `403`, `404` | Display single payment details. |
| `/admin/appointments` | `GET` | Yes (Admin) | Query Params: `status`, `customer_id`, `seller_id`, `service_id`, `date`, `page` | `200 OK`<br> (Paginated list of `Appointment` objects with `customer`, `seller`, `service` relationships) | `401`, `403` | Render appointments table, apply filters. |
| `/admin/appointments/{id}` | `GET` | Yes (Admin) | URL parameter `id` (int) | `200 OK`<br> (`Appointment` object with relationships) | `401`, `403`, `404` | Display single appointment details. |
| `/admin/appointments/{id}` | `PUT` | Yes (Admin) | `status` (string), `notes` (text, nullable) | `200 OK`<br> `{ "message": "Appointment updated by admin successfully.", "appointment": {...} }` | `401`, `403`, `404`, `422` | Show success toast, update appointment status in table/display. |
| `/admin/contacts` | `GET` | Yes (Admin) | Query Params: `status`, `search`, `page` | `200 OK`<br> (Paginated list of `Contact` objects) | `401`, `403` | Render contacts table, apply filters. |
| `/admin/contacts/{id}` | `GET` | Yes (Admin) | URL parameter `id` (int) | `200 OK`<br> (`Contact` object. Status is automatically set to 'read' on backend when retrieved.) | `401`, `403`, `404` | Display single contact message. |
| `/admin/contacts/{id}/respond` | `POST` | Yes (Admin) | `admin_response` (text) | `200 OK`<br> `{ "message": "Response sent and contact marked as responded.", "contact": {...} }` | `401`, `403`, `404`, `422` | Show success toast, update contact status. |
| `/admin/blogs` | `GET` | Yes (Admin) | Query Params: `status`, `search`, `page` | `200 OK`<br> (Paginated list of `Blog` objects with `admin` relationship) | `401`, `403` | Render blog posts table (includes drafts). |
| `/admin/blogs` | `POST` | Yes (Admin) | `title`, `slug`, `content`, `featured_image` (file, optional), `excerpt` (optional), `status` (draft/published), `published_at` (datetime, optional) | `201 Created`<br> `{ "message": "Blog post created successfully.", "blog": {...} }` | `401`, `403`, `422` | Show success toast, redirect to blog list. |
| `/admin/blogs/{id}` | `GET` | Yes (Admin) | URL parameter `id` (int) | `200 OK`<br> (`Blog` object with `admin` relationship) | `401`, `403`, `404` | Display single blog post details. |
| `/admin/blogs/{id}` | `POST` (with `_method=PUT`) | Yes (Admin) | `title`, `slug`, `content`, `featured_image` (file, optional; `null` to remove), `excerpt` (optional), `status` (draft/published), `published_at` (datetime, optional) | `200 OK`<br> `{ "message": "Blog post updated successfully.", "blog": {...} }` | `401`, `403`, `404`, `422` | Show success toast, update blog post. |
| `/admin/blogs/{id}` | `DELETE` | Yes (Admin) | None | `200 OK`<br> `{ "message": "Blog post deleted successfully." }` | `401`, `403`, `404` | Show success toast, remove blog post from list. |

---