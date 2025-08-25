# Services Marketplace Hub Frontend

This is the frontend application for the Services Marketplace Hub, a platform designed to connect service providers with customers. The application is built using React, Vite, TypeScript, and Shadcn UI, providing a modern, responsive, and feature-rich user experience.

## Features

*   **User Authentication:** Secure registration and login for both customers and service providers (sellers).
*   **Service Listings:** Browse, search, and view detailed information about various services.
*   **Seller Profiles:** Dedicated profiles for service providers to showcase their services, reviews, and contact information.
*   **Booking System:** Seamless appointment booking and management.
*   **Admin Dashboard:** Comprehensive administrative interface for managing users, services, bookings, and content.
*   **Blog:** Integrated blog for articles and updates.
*   **Responsive Design:** Optimized for various devices using Tailwind CSS and Shadcn UI components.
*   **State Management:** Utilizes React Context for authentication and React Query for data fetching and caching.
*   **Routing:** Implemented with React Router DOM for navigation.
*   **Error Handling:** Global error boundary for a robust user experience.

## Technologies Used

*   **Frontend Framework:** React.js
*   **Build Tool:** Vite
*   **Language:** TypeScript
*   **UI Library:** Shadcn UI
*   **Styling:** Tailwind CSS
*   **Routing:** React Router DOM
*   **State Management:** React Context, React Query
*   **HTTP Client:** Axios
*   **Charting:** Recharts
*   **Animations:** Framer Motion
*   **Form Management:** React Hook Form, Zod

## Project Structure

The project follows a standard React application structure with a focus on modularity and maintainability:

*   `src/components`: Reusable UI components categorized by feature (e.g., `auth`, `blog`, `dashboard`, `home`, `layout`, `payments`, `sellers`, `services`, `ui`).
*   `src/contexts`: React Context providers for global state management (e.g., `AuthContext`).
*   `src/data`: Mock data for development purposes.
*   `src/hooks`: Custom React hooks for reusable logic.
*   `src/lib`: Utility functions and API configurations.
*   `src/pages`: Top-level page components, organized by public, dashboard, and admin sections.
*   `src/types`: TypeScript type definitions.
*   `src/utils`: General utility functions.

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm or pnpm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/simiyu-samuel/services-marketplace-frontend.git
    cd services-marketplace-frontend
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    # or npm install
    ```

### Running the Application

1.  Start the development server:
    ```bash
    pnpm dev
    # or npm run dev
    ```
2.  Open your browser and navigate to `http://localhost:5173` (or the port displayed in your terminal).

### Building for Production

1.  Build the application:
    ```bash
    pnpm build
    # or npm run build
    ```
    The production-ready files will be generated in the `dist` directory.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue.

## License

[TBD]
