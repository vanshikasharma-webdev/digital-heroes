import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { Check, Shield, AlertCircle, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Subscription() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubscribe = async (planType: 'monthly' | 'yearly') => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('Please log in to activate a subscription.');
        return;
      }

      // Call deployed Edge Function
      const { data, error: fnError } = await supabase.functions.invoke(
        'create-checkout-session',
        {
          body: { plan_type: planType },
        }
      );

      if (fnError) {
        throw new Error(fnError.message || 'Failed to trigger checkout.');
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      // Success
      navigate('/dashboard');
    } catch (err: any) {
      console.error('Subscription error:', err);
      setError(err.message || 'An unexpected error occurred during activation.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with High-Contrast White Text */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl drop-shadow-md">
          Choose Your Plan
        </h1>
        <p className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto font-medium">
          Unlock weekly draws, track your golf scores, and support meaningful charities with every game.
        </p>
      </div>

      {error && (
        <div className="max-w-2xl mx-auto mb-8 p-4 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-lg flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Monthly Plan Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-8 shadow-lg flex flex-col justify-between hover:border-emerald-500 transition-all">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Monthly Plan</h2>
              <span className="p-2 bg-gray-100 rounded-lg text-gray-700">
                <Shield className="h-6 w-6" />
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-6">Flexible monthly subscription with full access to draws.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-gray-900">₹499</span>
              <span className="text-gray-600 font-medium"> / month</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" /> Track up to 5 latest scores
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" /> Automatic weekly draw entry
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" /> Direct charity support
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSubscribe('monthly')}
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Activate Monthly Plan'}
          </button>
        </div>

        {/* Yearly Plan Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl border-2 border-emerald-500 p-8 shadow-xl flex flex-col justify-between relative">
          <div className="absolute -top-3.5 right-6 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Sparkles className="h-3.5 w-3.5" /> Best Value
          </div>
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-900">Yearly Plan</h2>
              <span className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
                <Shield className="h-6 w-6" />
              </span>
            </div>
            <p className="text-gray-600 text-sm mb-6">Save more with annual commitment and continuous eligibility.</p>
            <div className="mb-6">
              <span className="text-4xl font-extrabold text-gray-900">₹4,999</span>
              <span className="text-gray-600 font-medium"> / year</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-gray-700">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" /> All Monthly features included
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" /> Discounted annual rate
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-600 shrink-0" /> Uninterrupted draw access
              </li>
            </ul>
          </div>
          <button
            onClick={() => handleSubscribe('yearly')}
            disabled={loading}
            className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Activate Yearly Plan'}
          </button>
        </div>
      </div>
    </div>
  );
}