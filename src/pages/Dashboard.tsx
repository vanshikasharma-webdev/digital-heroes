import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Award, Heart, ShieldCheck, Trophy, Calendar, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DashboardData {
  fullName: string;
  subscription: {
    status: string;
    planType: string;
    periodEnd: string;
  } | null;
  charity: {
    name: string;
    logoUrl?: string;
    percentage: number;
  } | null;
  scoreCount: number;
  totalWinnings: number;
}

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    fullName: '',
    subscription: null,
    charity: null,
    scoreCount: 0,
    totalWinnings: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) return;

      // 1. Profile & Selected Charity
      const { data: profile } = await supabase
        .from('profiles')
        .select(`
          full_name,
          charity_percentage,
          charities (
            name,
            logo_url
          )
        `)
        .eq('id', user.id)
        .single();

      // 2. Active Subscription
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('status, plan_type, current_period_end')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .maybeSingle();

      // 3. Scores Count
      const { count: scoreCount } = await supabase
        .from('scores')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      // 4. Total Winnings
      const { data: winners } = await supabase
        .from('winners')
        .select('prize_amount')
        .eq('user_id', user.id)
        .eq('payout_status', 'Paid');

      const totalWinnings = winners?.reduce((sum, w) => sum + Number(w.prize_amount || 0), 0) || 0;

      const charityData = profile?.charities as unknown as { name: string; logo_url?: string } | null;

      setData({
        fullName: profile?.full_name || user.email || 'Hero',
        subscription: sub
          ? {
              status: sub.status,
              planType: sub.plan_type,
              periodEnd: new Date(sub.current_period_end).toLocaleDateString(),
            }
          : null,
        charity: charityData
          ? {
              name: charityData.name,
              logoUrl: charityData.logo_url,
              percentage: profile?.charity_percentage || 10,
            }
          : null,
        scoreCount: scoreCount || 0,
        totalWinnings,
      });
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-sm">
          Welcome back, {data.fullName}!
        </h1>
        <p className="text-gray-200 text-sm">
          Track your golf performance and impact all in one place.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Subscription Card */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                data.subscription?.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {data.subscription?.status || 'Inactive'}
            </span>
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Subscription
          </h3>
          <p className="text-2xl font-bold text-gray-900 capitalize mt-1">
            {data.subscription ? `${data.subscription.planType} Plan` : 'No Active Plan'}
          </p>
          {data.subscription && (
            <p className="text-xs text-gray-600 mt-2 flex items-center">
              <Calendar className="h-3.5 w-3.5 mr-1 text-gray-500" /> Renews: {data.subscription.periodEnd}
            </p>
          )}
          {!data.subscription && (
            <Link
              to="/subscription"
              className="mt-3 inline-flex items-center text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Subscribe now <ExternalLink className="h-3 w-3 ml-1" />
            </Link>
          )}
        </div>

        {/* Scores Tracked Card */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <Trophy className="h-6 w-6" />
            </span>
            <span className="text-xs text-gray-500 font-medium">Max 5</span>
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Recent Scores
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{data.scoreCount} / 5</p>
          <Link
            to="/scores"
            className="mt-3 inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-700"
          >
            Manage scores <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </div>

        {/* Selected Charity Card */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Heart className="h-6 w-6" />
            </span>
            {data.charity && (
              <span className="bg-rose-100 text-rose-800 text-xs font-medium px-2 py-0.5 rounded-full">
                {data.charity.percentage}% Fee
              </span>
            )}
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Selected Charity
          </h3>
          <p className="text-xl font-bold text-gray-900 truncate mt-1">
            {data.charity ? data.charity.name : 'Not Selected'}
          </p>
          <Link
            to="/charity-selection"
            className="mt-3 inline-flex items-center text-xs font-semibold text-rose-600 hover:text-rose-700"
          >
            {data.charity ? 'Change charity' : 'Select charity'} <ExternalLink className="h-3 w-3 ml-1" />
          </Link>
        </div>

        {/* Total Winnings Card */}
        <div className="bg-white/95 backdrop-blur-md p-6 rounded-xl border border-gray-200 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Award className="h-6 w-6" />
            </span>
          </div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Total Winnings
          </h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">₹{data.totalWinnings.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">Verified and Paid</p>
        </div>
      </div>
    </div>
  );
}