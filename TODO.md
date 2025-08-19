# Themabinti Services Hub - Frontend Implementation Plan

This document outlines the steps to implement the Themabinti Services Hub frontend features as described in the task.

## **I. Seller Dashboard Package Overview**

*   [ ] Fetch user data (`GET /api/user`) on Seller Dashboard load.
*   [ ] Fetch dashboard insights (`GET /api/seller/dashboard/insights`) on Seller Dashboard load.
*   [ ] Display `seller_package` and `package_expiry_date`.
*   [ ] Implement dynamic status badges for package status (No Active Package, Expiring Soon, Expired).
*   [ ] Display `active_services_count`.
*   [ ] Implement "Upgrade / Renew Package" button navigation to `/dashboard/seller/package-upgrade`.

## **II. Package Upgrade / Renewal Page**

*   [ ] Fetch user data on `/dashboard/seller/package-upgrade` load.
*   [ ] Access local package configuration data.
*   [ ] Display current package details.
*   [ ] Implement package comparison grid with features and prices.
*   [ ] Implement dynamic button states (disabled for lower tiers, active for higher/current).
*   [ ] Implement payment modal.
*   [ ] Handle "Select Plan" click to open payment modal.
*   [ ] Implement "Pay Now" functionality:
    *   [ ] Initiate payment (`POST /api/payments/initiate`).
    *   [ ] Handle success response (store `checkout_request_id`, start polling).
    *   [ ] Handle error responses (422, 500).

## **III. Payment Status Polling & Package Activation**

*   [ ] Implement polling for `GET /api/payments/status/{checkoutRequestId}`.
*   [ ] Handle `pending` status (continue polling, update messages).
*   [ ] Handle `completed` status (stop polling, display success, redirect to `/dashboard`).
*   [ ] Handle `failed`/`cancelled` status (stop polling, display error, re-enable pay button).

## **IV. Service Creation Limits & Enforcement**

### **A. "Add New Service" Button**

*   [ ] Fetch user data and dashboard insights for service limits.
*   [ ] Access local package limits.
*   [ ] Conditionally disable "Add New Service" button if limit reached.
*   [ ] Display service limit message.
*   [ ] Add tooltip to disabled button.

### **B. Media Upload Field**

*   [ ] Fetch user data for media limits.
*   [ ] Access local media limits.
*   [ ] Display media upload limit message.
*   [ ] Implement client-side validation for media file count and type.
*   [ ] Display immediate inline error messages for exceeding limits.
*   [ ] Implement file previews.
*   [ ] Handle form submission with `multipart/form-data`.
*   [ ] Handle backend `422` errors for media files.
