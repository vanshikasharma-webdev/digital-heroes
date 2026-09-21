import { Link } from 'react-router-dom';
import { Trophy, Heart, ShieldCheck, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center py-12">
        <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider inline-flex items-center gap-1.5 mb-6">
          <Trophy className="h-4 w-4" /> Weekly Golf Draws & Social Impact
        </span>
        <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto drop-shadow-md">
          Play Your Best Game. <br />
          <span className="text-emerald-400">Support Great Causes.</span>
        </h1>
        <p className="mt-6 text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto font-medium">
          Track your golf scores, enter verified weekly prize draws, and make a real difference with automated charity contributions.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/subscription"
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2"
          >
            Get Started <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/impact"
            className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/10 transition-all flex items-center justify-center gap-2"
          >
            Explore Impact <Heart className="h-5 w-5 text-rose-400" />
          </Link>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 my-16">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-xl text-gray-900">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl w-fit mb-6">
            <Trophy className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-3">Track & Win</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Store up to 5 verified scores. Eligible players are automatically entered into transparent weekly draws.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-xl text-gray-900">
          <div className="p-3 bg-rose-100 text-rose-700 rounded-xl w-fit mb-6">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-3">Direct Charity Impact</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Select your preferred partner charity. A percentage of every subscription fee directly fuels social initiatives.
          </p>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-8 border border-gray-200 shadow-xl text-gray-900">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit mb-6">
            <ShieldCheck className="h-8 w-8" />
          </div>
          <h3 className="text-xl font-bold mb-3">100% Verified Draws</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Powered by secure cloud functions and transparent payout status tracking for complete peace of mind.
          </p>
        </div>
      </div>

      {/* Trust Points */}
      <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-2xl p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
        <div>
          <h3 className="text-xl font-bold text-white">Ready to join Digital Heroes?</h3>
          <p className="text-sm text-emerald-200/80 mt-1">Activate your plan today and start logging your scores.</p>
        </div>
        <Link
          to="/subscription"
          className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl transition-colors shrink-0"
        >
          View Subscription Plans
        </Link>
      </div>
    </div>
  );
}