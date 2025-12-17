import { Text, View } from 'react-native';
 import { Link } from 'expo-router'; 

export default function Index() {
  return (
    <View className="flex-1 bg-slate-900 items-center justify-center">
      <Text className="text-white text-2xl font-bold mb-4">Home screen</Text>
      <Link href="/test" className="text-red-400 text-xl underline mb-2 font-bold">
        🎨 Test Tailwind Styles
      </Link>
      <Link href="/about" className="text-blue-400 text-xl underline mb-2">
        Go to About screen
      </Link>
      <Link href="/login" className="text-green-400 text-xl underline mb-2">
        Go to Login Page
      </Link>
      <Link href="/screens/Home" className="text-yellow-400 text-xl underline">
        Go to Home Page
      </Link>
      <Link href="/screens/ShopDetailScreen" className="text-blue-400 text-xl underline mb-2">
        Go to Shop Detail Screen
      </Link>
      <Link href="/screens/BookingScreen" className="text-green-400 text-xl underline mb-2">
        Go to Booking Screen
      </Link>
      <Link href="/screens/Profile" className="text-blue-400 text-xl underline mb-2">
        Go to My Profile Screen
      </Link>
      <Link href="/screens/NotificationScreen" className="text-red-400 text-xl underline mb-2 font-bold">
        Notificatoin Screen
      </Link>
      <Link href="/screens/PaymentHistoryScreen" className="text-blue-400 text-xl underline mb-2">
        Go to Payment History
      </Link>
      <Link href="/screens/InAppChatScreen" className="text-blue-400 text-xl underline mb-2">
        Go to Chat
      </Link>
    </View>
  );
}
