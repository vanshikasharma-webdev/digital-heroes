import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Trophy, 
  LayoutDashboard, 
  Heart, 
  Award, 
  ShieldCheck, 
  LogOut, 
  LogIn, 
  UserPlus, 
  Menu, 
  X 
} from 'lucide-react';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Get initial user session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      }
    });

    // 2. Listen to auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        checkAdminRole(session.user.id);
      } else {
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (data && data.role === 'admin') {
        setIsAdmin(true);
      }
    } catch (err) {
      console.error('Error fetching role:', err);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsOpen(false);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-gray-900/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 group-hover:border-emerald-500/40 transition-colors">
              <Trophy className="h-6 w-6 text-emerald-400" />
            </div>
            <span className="font-extrabold text-xl text-white tracking-wide">
              Digital<span className="text-emerald-400">Heroes</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/impact"
              className={`text-sm font-medium transition-colors hover:text-emerald-400 flex items-center gap-1.5 ${
                isActive('/impact') ? 'text-emerald-400' : 'text-gray-300'
              }`}
            >
              <Heart className="h-4 w-4" />
              Impact
            </Link>

            <Link
              to="/winners"
              className={`text-sm font-medium transition-colors hover:text-emerald-400 flex items-center gap-1.5 ${
                isActive('/winners') ? 'text-emerald-400' : 'text-gray-300'
              }`}
            >
              <Award className="h-4 w-4" />
              Winners
            </Link>

            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-medium transition-colors hover:text-emerald-400 flex items-center gap-1.5 ${
                    isActive('/dashboard') ? 'text-emerald-400' : 'text-gray-300'
                  }`}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Link>

                <Link
                  to="/scores"
                  className={`text-sm font-medium transition-colors hover:text-emerald-400 flex items-center gap-1.5 ${
                    isActive('/scores') ? 'text-emerald-400' : 'text-gray-300'
                  }`}
                >
                  <Trophy className="h-4 w-4" />
                  Scores
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`text-sm font-medium transition-colors hover:text-emerald-400 flex items-center gap-1.5 ${
                      isActive('/admin') ? 'text-emerald-400' : 'text-gray-300'
                    }`}
                  >
                    <ShieldCheck className="h-4 w-4" />
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all flex items-center gap-1.5 ml-2"
                >
                  <LogOut className="h-4 w-4 text-rose-400" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex items-center gap-3 ml-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-gray-200 hover:text-white hover:bg-white/5 rounded-xl transition-all flex items-center gap-1.5"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-bold text-gray-950 bg-emerald-500 hover:bg-emerald-400 rounded-xl shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                >
                  <UserPlus className="h-4 w-4" />
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-white/10 bg-gray-900/95 backdrop-blur-lg px-4 pt-2 pb-6 space-y-3">
          <Link
            to="/impact"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-medium text-gray-300 hover:text-emerald-400"
          >
            Impact
          </Link>
          <Link
            to="/winners"
            onClick={() => setIsOpen(false)}
            className="block py-2 text-base font-medium text-gray-300 hover:text-emerald-400"
          >
            Winners
          </Link>

          {user ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-base font-medium text-gray-300 hover:text-emerald-400"
              >
                Dashboard
              </Link>
              <Link
                to="/scores"
                onClick={() => setIsOpen(false)}
                className="block py-2 text-base font-medium text-gray-300 hover:text-emerald-400"
              >
                Scores
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className="block py-2 text-base font-medium text-gray-300 hover:text-emerald-400"
                >
                  Admin Portal
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left py-2 text-base font-medium text-rose-400 hover:text-rose-300 flex items-center gap-2 pt-4 border-t border-white/10"
              >
                <LogOut className="h-5 w-5" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-semibold text-white bg-white/10 rounded-xl"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center py-2.5 text-sm font-bold text-gray-950 bg-emerald-500 rounded-xl"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}