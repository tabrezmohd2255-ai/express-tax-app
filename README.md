# Express Tax - Premium Client Portal

A production-ready, premium client portal for tax preparation services. Built with React 19, Vite, and modern CSS.

## Features

### Pages
- **Home** - Welcome dashboard with tax year selector, quick actions, recent documents, tax returns overview, and messages
- **Documents** - Document management with categories (W-2, 1099, Business Income, Bank Statements), drag & drop upload, status tracking
- **Tax Returns** - Multi-year tax return management with progress tracking, status badges, and download capabilities
- **Messages** - Real-time chat interface with advisor and support threads, emoji picker, file attachments
- **Settings** - Profile, Business Info, Personal Info, Security (password, 2FA), Notification preferences

### Design System
- **Colors**: Navy (#0B1F33) primary, Gold (#D4AF37) accent, White background
- **Typography**: Inter font family
- **Components**: Buttons, cards, forms, modals, dropdowns, toasts, tables, tabs, badges, avatars, skeletons
- **Animations**: Smooth page transitions, hover effects, loading states, micro-interactions
- **Responsive**: Mobile-first design with sidebar collapse, touch-friendly interactions

### Technical Stack
- React 19 + Vite
- React Router v7 for navigation
- Lucide React for icons
- clsx for class composition
- Custom hooks for state management (useForm, useModal, useToast, useFileUpload, etc.)
- Context API for global state
- CSS Custom Properties for theming
- No external UI library - all components built from scratch

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Sidebar.jsx   # Navigation sidebar with collapse
│   ├── Header.jsx    # Top header with search, notifications, user menu
│   └── Layout.jsx    # Main layout wrapper
├── pages/            # Page components
│   ├── Home.jsx
│   ├── Documents.jsx
│   ├── TaxReturns.jsx
│   ├── Messages.jsx
│   └── Settings.jsx
├── context/          # React Context providers
│   └── AppContext.jsx
├── hooks/            # Custom React hooks
│   └── index.js
├── styles/           # Global styles
│   └── global.css
├── App.jsx           # App routes
└── main.jsx          # Entry point
```

## Key Features Implemented

### Navigation
- Persistent sidebar with logo space
- Collapsible sidebar (desktop) / slide-out (mobile)
- Active route highlighting
- Breadcrumb-style section navigation in Settings

### Interactive Components
- **Dropdowns**: Tax year selector, user menu, notifications
- **Modals**: Document upload, tax return creation, return details, 2FA setup
- **Forms**: Validation, password strength meter, toggle switches
- **File Upload**: Drag & drop, multiple files, progress, validation
- **Chat**: Real-time messaging UI with emoji picker, timestamps, read receipts
- **Tables**: Sortable, filterable, responsive with grid/list views

### State Management
- Centralized AppContext with all mock data
- Optimistic UI updates
- Toast notifications for feedback
- Form validation with touched/dirty tracking

### Accessibility
- Semantic HTML
- ARIA labels and roles
- Keyboard navigation
- Focus management
- Screen reader support
- Color contrast compliance

## Customization

### Colors
Edit CSS custom properties in `src/styles/global.css`:
```css
:root {
  --color-navy-900: #0B1F33;
  --color-gold-500: #D4AF37;
  /* ... */
}
```

### Adding Pages
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation item in `src/components/Sidebar.jsx`

## Production Deployment

The `dist/` folder contains the production-ready build. Deploy to any static hosting:
- Vercel
- Netlify
- AWS S3 + CloudFront
- GitHub Pages

## License

Proprietary - Express Tax