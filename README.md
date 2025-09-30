# SuitSupply - Premium Menswear E-commerce Platform

A complete production-ready React e-commerce application for a clothing brand, featuring advanced product customization, shopping cart functionality, and user authentication.

## 🚀 Features

### Core E-commerce Features
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Customization**: Interactive shirt customizer with real-time preview
- **Shopping Cart**: Full cart management with quantity controls
- **Checkout Process**: Complete checkout flow with form validation
- **User Authentication**: JWT-based login/registration system
- **User Dashboard**: Profile management and order history

### Product Customization Engine
- **Layered Image System**: Dynamic product preview with customization overlays
- **Customizable Elements**: Collar, cuffs, buttons, pockets, and sleeves
- **Real-time Pricing**: Dynamic price calculation based on customizations
- **Visual Preview**: Interactive preview with immediate updates

### Technical Features
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **State Management**: Redux Toolkit for complex state handling
- **API Integration**: Mock API with JSON Server
- **Form Validation**: Comprehensive form validation with error handling
- **Loading States**: Proper loading indicators throughout the app
- **Error Handling**: Graceful error handling and user feedback

## 🛠️ Tech Stack

- **Frontend**: React 19, React Router, Redux Toolkit
- **Styling**: Tailwind CSS, Headless UI
- **Backend**: JSON Server (Mock API)
- **Authentication**: JWT tokens
- **Build Tool**: Vite
- **Code Quality**: ESLint, Prettier

## 📦 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd suitPOC
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development servers**
   ```bash
   # Start both frontend and mock API
   npm run dev:full
   ```

   Or run them separately:
   ```bash
   # Terminal 1: Start mock API
   npm run api

   # Terminal 2: Start React app
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Mock API: http://localhost:3001

### Quick Start (Alternative)
```bash
# Make scripts executable (first time only)
chmod +x start.sh check-status.sh

# Start the application
./start.sh

# Check status anytime
./check-status.sh
```

## 🎯 Available Scripts

- `npm run dev` - Start React development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run api` - Start JSON Server mock API
- `npm run dev:full` - Start both frontend and API concurrently
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── cart/           # Shopping cart components
│   ├── common/         # Shared components
│   ├── home/           # Homepage components
│   ├── layout/         # Layout components (Header, Footer)
│   └── product/        # Product-related components
├── pages/              # Page components
├── store/              # Redux store and slices
│   ├── slices/         # Redux slices
│   └── index.js        # Store configuration
├── services/           # API service layer
├── utils/              # Utility functions
└── constants/          # Application constants
```

## 🔧 Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=SuitSupply
VITE_APP_VERSION=1.0.0
```

### Mock API Data
The mock API uses `data/db.json` for data storage. You can modify this file to add more products, users, or orders.

## 🎨 Customization

### Adding New Product Categories
1. Update `data/db.json` with new categories
2. Add category images to `public/images/categories/`
3. Update the categories component if needed

### Modifying Product Customization Options
1. Edit the `customizationOptions` in `data/db.json`
2. Add customization images to `public/images/customizations/`
3. Update the `ProductCustomizer` component for new options

### Styling Changes
- Modify `tailwind.config.js` for theme changes
- Update `src/index.css` for global styles
- Use Tailwind utility classes throughout components

## 🔐 Authentication

### Demo Credentials
- **Email**: john.doe@example.com
- **Password**: password123

### Adding New Users
1. Register through the UI, or
2. Add user data directly to `data/db.json`

## 🚀 Deployment

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Environment Setup
1. Set up a production API endpoint
2. Update environment variables
3. Configure authentication endpoints
4. Set up image hosting for product photos

## 🧪 Testing

### Manual Testing Checklist
- [ ] User registration and login
- [ ] Product browsing and filtering
- [ ] Product customization
- [ ] Shopping cart functionality
- [ ] Checkout process
- [ ] User profile management
- [ ] Responsive design on mobile

## 🐛 Troubleshooting

### Common Issues

1. **API Connection Issues**
   - Ensure JSON Server is running on port 3001
   - Check CORS configuration in middleware

2. **Authentication Problems**
   - Clear localStorage and try logging in again
   - Check JWT token expiration

3. **Image Loading Issues**
   - Verify image paths in `public/images/`
   - Check file permissions

## 📱 Mobile Responsiveness

The application is fully responsive and optimized for:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🔮 Future Enhancements

- [ ] Real payment integration
- [ ] Advanced search with filters
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Order tracking
- [ ] Multi-language support
- [ ] PWA capabilities
- [ ] Advanced analytics

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please contact:
- Email: support@suitSupply.com
- Phone: +1 (555) 123-4567

---

**Built with ❤️ using React and modern web technologies**