# Customer Frontend - Digital E-Commerce

React-based customer-facing e-commerce website.

## Features

- Product browsing and search
- Shopping cart functionality
- User authentication and registration
- Checkout with multiple payment options
- Order history and tracking
- Responsive mobile-first design

## Technology Stack

- React 18
- React Router v6
- Axios for API calls
- React Hot Toast for notifications
- React Icons
- CSS3 with CSS Variables

## Available Scripts

### `npm start`
Runs the app in development mode at [http://localhost:3000](http://localhost:3000)

### `npm run build`
Builds the app for production to the `build` folder

### `npm test`
Launches the test runner

## Environment Variables

Create `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable components
│   │   ├── Navbar.js
│   │   ├── Footer.js
│   │   ├── ProductCard.js
│   │   └── ProtectedRoute.js
│   ├── context/         # React Context
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── pages/           # Page components
│   │   ├── Home.js
│   │   ├── Products.js
│   │   ├── ProductDetail.js
│   │   ├── Cart.js
│   │   ├── Checkout.js
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Orders.js
│   │   ├── OrderDetail.js
│   │   ├── Profile.js
│   │   ├── PaymentSuccess.js
│   │   └── PaymentFail.js
│   ├── utils/           # Utilities
│   │   └── api.js       # API configuration
│   ├── App.js           # Main app component
│   ├── index.js         # Entry point
│   └── index.css        # Global styles
└── package.json
```

## Key Features Implementation

### Shopping Cart
- Stored in localStorage
- Persists across sessions
- Real-time updates

### Authentication
- JWT-based authentication
- Protected routes
- Auto-redirect for unauthorized access

### Payment Integration
- SSLCommerz payment gateway
- Cash on Delivery option
- Multiple payment methods support

## Customization

### Branding
Update colors in `src/index.css`:
```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #1e40af;
  /* ... more colors */
}
```

### API URL
Update in `.env` or `src/utils/api.js`

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the `build` folder using:
   - Nginx
   - Apache
   - Vercel
   - Netlify
   - Any static hosting service

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Code splitting with React.lazy
- Image optimization
- Minimal bundle size
- Fast page loads
