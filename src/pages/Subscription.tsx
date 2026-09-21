import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Subscription() {
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (priceId: string) => {
    setLoading(true);
    try {
      // 1. Verify User Session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        alert('Please log in to subscribe.');
        window.location.href = '/login';
        return;
      }

      // 2. Invoke Edge Function with Auth Headers
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      });

      if (error) {
        console.error('Edge Function Details:', error);
        alert(`Subscription Error: ${error.message || 'Failed to connect to checkout'}`);
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Checkout URL not returned by server.');
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      alert(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-8 text-center">Choose Your Plan</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <h2 className="text-xl font-bold text-white mb-2">Monthly HERO Pass</h2>
          <p className="text-gray-400 mb-6">Access to weekly draws & charity contributions</p>
          <button
            onClick={() => handleSubscribe('price_monthly_id_here')}
            disabled={loading}
            className="w-full py-3 bg-emerald-500 text-gray-950 font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Subscribe Monthly'}
          </button>
        </div>
      </div>
    </div>
  );
}