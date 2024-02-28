import 'react-native-gesture-handler'
import AppMainNav from './navigation/appMainNav'
import { AuthProvider } from './context/AuthContext'

export default function App() {
  return (
    <AuthProvider>
      <AppMainNav />
    </AuthProvider>
  );
}
