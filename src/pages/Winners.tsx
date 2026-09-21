import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Award, Calendar, Heart, ShieldCheck } from 'lucide-react';

interface WinnerRecord {
  id: string;
  draw_date: string;
  prize_amount: number;
  payout_status: string;
  profiles: {
    full_name: string;
  } | null;
  charities: {
    name: string;
  } | null;
}

export default function Winners() {
  const [winners, setWinners] = useState<WinnerRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchErr } = await supabase
        .from('winners')
        .select(`
          id,
          draw_date,
          prize_amount,
          payout_status,
          profiles (
            full_name
          ),
          charities (
            name
          )
        `)
        .order('draw_date', { ascending: false });

      if (fetchErr) throw fetchErr;

      setWinners((data as unknown as WinnerRecord[]) || []);
    } catch (err: any) {
      console.error('Error fetching winners:', err);
      setError('Failed to load winners history.');
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Award className="h-8 w-8 text-emerald-600" /> Draw Winners & Impact
        </h1>
        <p className="text-gray-600 mt-1">
          Transparent record of weekly winners and associated charitable contributions.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      {winners.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
          No draw winners recorded yet. Check back after the upcoming weekly draw!
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Draw Date</th>
                  <th className="py-3.5 px-4">Winner</th>
                  <th className="py-3.5 px-4">Prize Amount</th>
                  <th className="py-3.5 px-4">Selected Charity</th>
                  <th className="py-3.5 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 text-sm">
                {winners.map((winner) => (
                  <tr key={winner.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-gray-900 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(winner.draw_date).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-gray-900">
                      {winner.profiles?.full_name || 'Anonymous Winner'}
                    </td>
                    <td className="py-4 px-4 font-bold text-emerald-600">
                      ₹{Number(winner.prize_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <Heart className="h-4 w-4 text-rose-500 shrink-0" />
                        <span>{winner.charities?.name || 'N/A'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          winner.payout_status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        {winner.payout_status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}