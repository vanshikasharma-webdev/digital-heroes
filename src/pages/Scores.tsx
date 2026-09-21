import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { PlusCircle, Trash2, Trophy, AlertCircle, Calendar, Hash, MapPin } from 'lucide-react';

interface Score {
  id: string;
  course_name: string;
  gross_score: number;
  date_played: string;
  created_at: string;
}

export default function Scores() {
  const [scores, setScores] = useState<Score[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [courseName, setCourseName] = useState('');
  const [grossScore, setGrossScore] = useState('');
  const [datePlayed, setDatePlayed] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setLoading(false);
        return;
      }

      const { data, error: fetchErr } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', session.user.id)
        .order('date_played', { ascending: false })
        .limit(5);

      if (fetchErr) {
        throw new Error(fetchErr.message || 'Failed to load scores.');
      }

      setScores(data || []);
    } catch (err: any) {
      console.error('Error fetching scores:', err);
      setError(err.message || 'Failed to load scores.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (scores.length >= 5) {
      setError('Maximum limit of 5 scores reached. Delete an older score to add a new one.');
      return;
    }

    if (!courseName.trim() || !grossScore || !datePlayed) {
      setError('Please fill out all required fields.');
      return;
    }

    try {
      setSubmitting(true);
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        setError('Please log in to add scores.');
        return;
      }

      const { error: insertErr } = await supabase
        .from('scores')
        .insert({
          user_id: session.user.id,
          course_name: courseName.trim(),
          gross_score: parseInt(grossScore, 10),
          date_played: datePlayed,
        });

      if (insertErr) throw insertErr;

      // Reset Form & Refresh
      setCourseName('');
      setGrossScore('');
      setDatePlayed(new Date().toISOString().split('T')[0]);
      await fetchScores();
    } catch (err: any) {
      console.error('Error adding score:', err);
      setError(err.message || 'Failed to submit score.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteScore = async (id: string) => {
    try {
      setError(null);
      const { error: deleteErr } = await supabase
        .from('scores')
        .delete()
        .eq('id', id);

      if (deleteErr) throw deleteErr;

      await fetchScores();
    } catch (err: any) {
      console.error('Error deleting score:', err);
      setError('Failed to delete score.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8 text-center sm:text-left">
        <h1 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">
          Track Golf Scores
        </h1>
        <p className="mt-2 text-sm text-gray-200">
          Maintain your latest 5 verified scores to stay eligible for weekly draws.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-rose-950/80 border border-rose-500 text-rose-200 rounded-xl flex items-center gap-2 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Add Score Form */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-6 shadow-md mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <PlusCircle className="h-5 w-5 text-emerald-600" />
          Add New Score ({scores.length}/5)
        </h2>

        <form onSubmit={handleAddScore} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Course Name
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                placeholder="e.g. DLF Golf Club"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Gross Score
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="number"
                value={grossScore}
                onChange={(e) => setGrossScore(e.target.value)}
                placeholder="e.g. 72"
                min="50"
                max="150"
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
              Date Played
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="date"
                value={datePlayed}
                onChange={(e) => setDatePlayed(e.target.value)}
                required
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="sm:col-span-3 flex justify-end mt-2">
            <button
              type="submit"
              disabled={submitting || scores.length >= 5}
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? 'Submitting...' : 'Submit Score'}
            </button>
          </div>
        </form>
      </div>

      {/* Scores List */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 p-6 shadow-md">
        <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Trophy className="h-5 w-5 text-amber-500" />
          Recent Scores Tracked
        </h2>

        {loading ? (
          <div className="py-8 text-center text-sm text-gray-500">Loading scores...</div>
        ) : scores.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-500">
            No scores added yet. Add your first score above!
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {scores.map((score) => (
              <div key={score.id} className="py-4 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm">{score.course_name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Played on {new Date(score.date_played).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-extrabold text-sm rounded-lg border border-emerald-200">
                    {score.gross_score}
                  </span>
                  <button
                    onClick={() => handleDeleteScore(score.id)}
                    className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="Delete score"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}