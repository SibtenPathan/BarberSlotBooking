# Barber Slot Booking - Frontend

React Native mobile application built with Expo for booking barber appointments.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for Mac) or Android Emulator

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Configuration

Create a `.env` file in the frontend directory with the following variables:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

## Running the App

Start the Expo development server:

```bash
npx expo start
```

Then choose your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your physical device

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run android` - Start on Android emulator
- `npm run ios` - Start on iOS simulator
- `npm run web` - Start web version
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── app/                    # Main app screens and routing
│   ├── screens/           # Screen components
│   ├── _layout.tsx        # Root layout
│   ├── index.jsx          # Home screen
│   ├── login.tsx          # Login screen
│   └── ...
├── assets/                # Images, fonts, and static files
├── app.json              # Expo configuration
├── babel.config.js       # Babel configuration
├── tailwind.config.js    # Tailwind CSS configuration
└── tsconfig.json         # TypeScript configuration
```

## Key Features

- **Authentication**: User login and registration
- **Shop Browsing**: View and search barber shops
- **Booking System**: Schedule appointments with barbers
- **Profile Management**: Update user information
- **Payment History**: Track past transactions
- **In-App Chat**: Communicate with barbers
- **Notifications**: Receive booking updates

## Technologies Used

- **React Native**: Cross-platform mobile framework
- **Expo**: Development toolchain and runtime
- **TypeScript**: Type-safe JavaScript
- **NativeWind**: Tailwind CSS for React Native
- **React Navigation**: Navigation library
- **Expo Router**: File-based routing

## Development

### Adding New Screens

Create a new file in the `app/screens/` directory and add routing in `app/_layout.tsx`.

### Styling

This project uses NativeWind (Tailwind CSS). Add classes directly to components:

```tsx
<View className="flex-1 bg-white p-4">
  <Text className="text-xl font-bold">Hello</Text>
</View>
```

## Building for Production

### Android

```bash
expo build:android
```

### iOS

```bash
expo build:ios
```

## Troubleshooting

- **Metro bundler issues**: Clear cache with `npx expo start -c`
- **Module not found**: Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- **Port already in use**: Kill the process or use a different port

## License

MIT
