import { Link } from 'react-router-dom';
import { Trophy, Shield, Heart, ArrowRight, Sparkles } from 'lucide-react';

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center lg:pt-32">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-8">
          <Sparkles className="h-4 w-4" />
          <span>Play Golf. Win Weekly Prizes. Support Good Causes.</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-none mb-8">
          Turn Your Scorecards Into <br className="hidden sm:inline" />
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Real Impact & Rewards
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg sm:text-xl text-gray-300 mb-10 leading-relaxed">
          Log your golf rounds, join weekly prize draws, and contribute to top non-profit charities across India with every subscription.
        </p>

        {/* CTA Buttons - Connected to Routes */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-bold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 group"
          >
            <span>Get Started Now</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl border border-white/10 backdrop-blur-md transition-all flex items-center justify-center"
          >
            Sign In
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <Trophy className="h-10 w-10 text-amber-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Weekly Draws</h3>
            <p className="text-gray-400 text-sm">
              Submit up to 5 verified golf scorecards per month to qualify for automated weekly prize pool distributions.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <Heart className="h-10 w-10 text-rose-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Charity Support</h3>
            <p className="text-gray-400 text-sm">
              Choose your favorite cause. A portion of every active subscription goes directly to your selected partner charity.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <Shield className="h-10 w-10 text-emerald-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Verified Scores</h3>
            <p className="text-gray-400 text-sm">
              Transparent handicap and scorecard logging system backed by Supabase row-level security.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}