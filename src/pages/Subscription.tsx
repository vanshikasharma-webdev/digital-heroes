import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Trophy, CheckCircle2, Shield, Zap } from 'lucide-react';

export default function Subscription() {
  const [loading, setLoading] = useState(false);

  // Replace with your actual Stripe Price ID from your Stripe dashboard
  const STRIPE_PRICE_ID = 'price_1P...'; 

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // 1. Check user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Please sign in to continue with your subscription.');
        window.location.href = '/login';
        return;
      }

      // 2. Call Supabase Edge Function
      const response = await supabase.functions.invoke('create-checkout-session', {
        body: { 
          priceId: STRIPE_PRICE_ID,
          returnUrl: window.location.origin
        },
      });

      if (response.error) {
        let errorDetails = response.error.message;
        try {
          const body = await response.error.context?.json();
          if (body?.error) errorDetails = body.error;
        } catch (_) {}

        alert(`Subscription Error: ${errorDetails}`);
        return;
      }

      if (response.data?.url) {
        window.location.href = response.data.url;
      } else {
        alert('Could not retrieve checkout URL from server.');
      }
    } catch (err: any) {
      alert(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-16 text-white">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold mb-6">
          <Zap className="h-4 w-4" />
          <span>Unlock Full Access</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
          Elevate Your Game & Support Causes
        </h1>
        <p className="text-gray-400 text-lg">
          Join Digital Heroes to enter weekly prize draws, track verified scores, and contribute to non-profit impact initiatives.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Free / Basic Tier info */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2 text-gray-200">Standard Access</h3>
            <p className="text-gray-400 text-sm mb-6">Basic platform viewing and profile management.</p>
            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 className="h-5 v-5 text-gray-500 flex-shrink-0" />
                <span>View leaderboards & impact stats</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 className="h-5 v-5 text-gray-500 flex-shrink-0" />
                <span>Standard community features</span>
              </div>
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-500 py-3 text-center border border-white/5 rounded-xl">
            Current Status
          </div>
        </div>

        {/* Pro / Hero Subscription Tier */}
        <div className="bg-gradient-to-b from-emerald-900/40 via-gray-900/80 to-gray-900 border-2 border-emerald-500/40 rounded-3xl p-8 backdrop-blur-sm flex flex-col justify-between relative shadow-2xl shadow-emerald-500/10">
          <div className="absolute -top-4 right-8 bg-emerald-500 text-gray-950 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
            Most Popular
          </div>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="h-6 w-6 text-emerald-400" />
              <h3 className="text-2xl font-bold text-white">HERO Pass</h3>
            </div>
            <p className="text-gray-400 text-sm mb-6">Full participation in weekly draws and charity backing.</p>
            
            <div className="mb-8">
              <span className="text-4xl font-extrabold text-white">₹999</span>
              <span className="text-gray-400 text-sm ml-2">/ month</span>
            </div>

            <div className="space-y-3 mb-8">
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 className="h-5 v-5 text-emerald-400 flex-shrink-0" />
                <span>Up to 5 verified scorecard uploads / month</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 className="h-5 v-5 text-emerald-400 flex-shrink-0" />
                <span>Automatic entry into weekly cash & gear draws</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <CheckCircle2 className="h-5 v-5 text-emerald-400 flex-shrink-0" />
                <span>Direct percentage contribution to chosen charity</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <Shield className="h-5 v-5 text-emerald-400 flex-shrink-0" />
                <span>Secure payments powered by Stripe</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSubscribe}
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-extrabold rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Redirecting to Checkout...' : 'Subscribe Now'}
          </button>
        </div>
      </div>
    </div>
  );
}