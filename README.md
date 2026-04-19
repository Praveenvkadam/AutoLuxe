# Car - AutoLuxe

AutoLuxe is a modern, interactive car comparison and booking platform built with React and Tailwind CSS. The application provides users with a seamless experience to browse, compare, and book test drives for various car models.

## Features

- **Car Browsing**: Explore a wide range of car models with detailed specifications
- **Advanced Filtering**: Filter cars by brand, price range, and car type
- **Search Functionality**: Search for specific car models
- **Car Comparison**: Compare up to 2 cars side-by-side
- **Test Drive Booking**: Schedule test drives for selected car models
- **AI Chat Assistant**: Interactive chat for car recommendations and assistance
- **Responsive Design**: Mobile-friendly interface with smooth animations

## Tech Stack

- **Frontend**: React 19.2.4 with Vite
- **Styling**: Tailwind CSS 4.2.2
- **Icons**: Lucide and React Icons
- **Build Tool**: Vite 8.0.4
- **Linting**: ESLint with React hooks plugin

## Project Structure

```
car/
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── Api/         # API configurations
│   │   └── App.jsx      # Main application component
│   ├── package.json     # Dependencies and scripts
│   └── vite.config.js   # Vite configuration
└── README.md            # This file
```

## Available Scripts

In the `frontend` directory, you can run:

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Getting Started

1. Clone the repository
2. Navigate to the `frontend` directory
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`
5. Open https://auto-luxe-iota.vercel.app/ in your browser

## Components

- **Navbar**: Navigation header with active link highlighting
- **CarHero**: Hero section with car showcase
- **CarFilter**: Filtering and search interface
- **CarGrid**: Grid layout for car listings
- **Comparison**: Side-by-side car comparison
- **TestDrive**: Test drive booking form
- **AutoLuxeChat**: AI-powered chat assistant

## Development

The application uses React hooks for state management and follows modern React patterns. The UI is built with Tailwind CSS for a responsive and consistent design system.

## License

This project is open source and available under the [MIT License](LICENSE).
