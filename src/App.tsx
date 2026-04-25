import { ConvexProvider } from "convex/react";
import { convex } from './lib/convex';
import { AuthProvider } from './components/auth/AuthProvider';
import { AppProvider } from './components/context/AppContext';
import MainLayout from './components/layout/MainLayout';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <ConvexProvider client={convex}>
          <MainLayout />
        </ConvexProvider>
      </AuthProvider>
    </AppProvider>
  );
}
