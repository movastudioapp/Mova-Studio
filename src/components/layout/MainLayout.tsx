import { useState, useEffect } from 'react';
import { Home, Sparkles, Compass, Library, User, Menu, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import HomeScreen from '../../screens/HomeScreen';
import CreateScreen from '../../screens/CreateScreen';
import ExploreScreen from '../../screens/ExploreScreen';
import AssetsScreen from '../../screens/AssetsScreen';
import ProfileScreen from '../../screens/ProfileScreen';

type Tab = 'home' | 'create' | 'explore' | 'assets' | 'profile';

export default function MainLayout() {
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Auto-collapse sidebar on tablet
  useEffect(() => {
    const checkWidth = () => {
      if (window.innerWidth < 1024) {
        setIsSidebarExpanded(false);
      } else {
        setIsSidebarExpanded(true);
      }
    };
    
    checkWidth();
    window.addEventListener('resize', checkWidth);
    return () => window.removeEventListener('resize', checkWidth);
  }, []);

  const navItems = [
    { id: 'home', label: 'Feed', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'create', label: 'Create', icon: Sparkles },
    { id: 'assets', label: 'Assets', icon: Library },
    { id: 'profile', label: 'Profile', icon: User },
  ] as const;

  const renderScreen = () => {
    switch (activeTab) {
      case 'home': return <HomeScreen />;
      case 'create': return <CreateScreen />;
      case 'explore': return <ExploreScreen />;
      case 'assets': return <AssetsScreen />;
      case 'profile': return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#05050D] text-white overflow-hidden relative">
      {/* Abstract Background Glows */}
      <div className="absolute top-[-200px] right-[-200px] w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[100px] w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Desktop & Tablet Sidebar */}
      <aside 
        className={`hidden md:flex flex-col h-full bg-black/40 backdrop-blur-xl border-r border-white/5 z-50 py-6 transition-all duration-300 relative ${
          isSidebarExpanded ? 'w-[240px]' : 'w-[80px]'
        }`}
      >
        <button 
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className="absolute -right-3 top-8 w-6 h-6 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center z-50 transition-colors"
        >
          {isSidebarExpanded ? <ChevronLeft className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
        </button>

        <div className={`flex items-center mb-10 px-6 ${isSidebarExpanded ? 'gap-3' : 'justify-center px-0'}`}>
          <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-[0_0_20px_rgba(168,85,247,0.4)]">
            <span className="font-black text-xl">M</span>
          </div>
          {isSidebarExpanded && (
            <h1 className="text-xl font-bold tracking-tight text-white/90 truncate">Mova Studio</h1>
          )}
        </div>

        <nav className={`flex-1 flex flex-col gap-4 ${isSidebarExpanded ? 'px-4' : 'items-center'}`}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={!isSidebarExpanded ? item.label : undefined}
                className={`relative flex items-center ${isSidebarExpanded ? 'gap-4 px-4 py-3 w-full' : 'justify-center w-12 h-12'} rounded-xl transition-all duration-300 group ${
                  isActive ? 'text-purple-400' : 'text-white/40 hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-sidebar-bg"
                    className="absolute inset-0 bg-purple-500/10 border border-purple-500/20 rounded-xl"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                {isActive && isSidebarExpanded && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-6 bg-purple-500 rounded-full" />
                )}
                <Icon className={`w-5 h-5 relative z-10 transition-colors shrink-0 ${isActive ? 'text-purple-400' : ''}`} />
                {isSidebarExpanded && (
                  <span className="font-medium text-sm tracking-wide relative z-10">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

        <div className={`mt-auto ${isSidebarExpanded ? 'px-4' : 'px-2 flex justify-center'}`}>
          <button 
            onClick={() => setActiveTab('create')}
            className={`relative group overflow-hidden rounded-xl p-[1px] transition-transform active:scale-95 ${
              isSidebarExpanded ? 'w-full' : 'w-12 h-12'
            }`}
            title={!isSidebarExpanded ? 'Generate New' : undefined}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className={`relative bg-black/50 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/10 ${
              isSidebarExpanded ? 'px-4 py-3 gap-2' : 'w-full h-full'
            }`}>
              <Sparkles className="w-4 h-4 text-purple-400 shrink-0" />
              {isSidebarExpanded && (
                <span className="font-bold text-sm tracking-wide text-white">Generate</span>
              )}
            </div>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative h-full flex flex-col overflow-hidden pb-16 md:pb-0 z-10 bg-transparent">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -10, filter: 'blur(10px)' }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col"
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Fixed Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 w-full z-50 bg-[#05050D]/90 backdrop-blur-xl border-t border-white/10 pb-safe">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                  isActive ? 'text-purple-400' : 'text-white/40 hover:text-white/80'
                }`}
              >
                {item.id === 'create' ? (
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full transition-transform active:scale-95 ${
                    isActive ? 'bg-gradient-to-r from-purple-600 to-blue-600 shadow-[0_4px_15px_rgba(147,51,234,0.3)] text-white' : 'bg-white/10 text-white/80'
                  }`}>
                    <Icon className="w-5 h-5 shrink-0" />
                  </div>
                ) : (
                  <>
                    <Icon className="w-5 h-5 mb-1 shrink-0" />
                    <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
                  </>
                )}
                {/* Active indicator bar */}
                {isActive && item.id !== 'create' && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    className="absolute top-0 w-8 h-0.5 bg-purple-500 rounded-b-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
