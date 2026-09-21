import  { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Award, ShieldAlert, CheckCircle, Clock, RefreshCw } from 'lucide-react';

interface Winner {
  id: string;
  draw_date: string;
  prize_amount: number;
  payout_status: string;
  profiles?: {
    full_name: string;
  };
}

export default function Admin() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    fetchWinners();
  }, []);

  const fetchWinners = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('winners')
        .select(`
          id,
          draw_date,
          prize_amount,
          payout_status,
          profiles (
            full_name
          )
        `)
        .order('draw_date', { ascending: false });

      if (error) throw error;
      setWinners((data as unknown as Winner[]) || []);
    } catch (err) {
      console.error('Error fetching winners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Pending' ? 'Paid' : 'Pending';
    try {
      setUpdatingId(id);
      const { error } = await supabase
        .from('winners')
        .update({ payout_status: nextStatus })
        .eq('id', id);

      if (error) throw error;
      await fetchWinners();
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm flex items-center gap-2">
            <ShieldAlert className="h-8 w-8 text-amber-400" /> Admin Management Portal
          </h1>
          <p className="mt-1 text-sm text-gray-200">
            Manage draw prize allocations and track payout fulfillment statuses.
          </p>
        </div>
        <button
          onClick={fetchWinners}
          className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/10 text-sm font-semibold flex items-center gap-2 w-fit"
        >
          <RefreshCw className="h-4 w-4" /> Refresh Data
        </button>
      </div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-6 shadow-xl text-gray-900">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Award className="h-5 w-5 text-amber-500" /> Weekly Draw Winners
        </h2>

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading winners ledger...</div>
        ) : winners.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">No winners recorded in database.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500">
                  <th className="py-3 px-4">Winner Name</th>
                  <th className="py-3 px-4">Draw Date</th>
                  <th className="py-3 px-4">Prize Amount</th>
                  <th className="py-3 px-4">Payout Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {winners.map((winner) => (
                  <tr key={winner.id} className="hover:bg-gray-50/50">
                    <td className="py-3.5 px-4 font-semibold text-gray-900">
                      {winner.profiles?.full_name || 'Anonymous User'}
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">
                      {new Date(winner.draw_date).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-extrabold text-emerald-600">
                      ₹{Number(winner.prize_amount).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          winner.payout_status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {winner.payout_status === 'Paid' ? (
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <Clock className="h-3.5 w-3.5 text-amber-600" />
                        )}
                        {winner.payout_status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => handleStatusUpdate(winner.id, winner.payout_status)}
                        disabled={updatingId === winner.id}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold rounded-lg transition-colors disabled:opacity-50"
                      >
                        {updatingId === winner.id
                          ? 'Updating...'
                          : winner.payout_status === 'Paid'
                          ? 'Mark as Pending'
                          : 'Mark as Paid'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}