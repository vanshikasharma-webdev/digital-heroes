import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Heart, CheckCircle2, ShieldAlert } from 'lucide-react';

interface Charity {
  id: string;
  name: string;
  description: string;
  logo_url?: string;
  website_url?: string;
}

export default function CharitySelection() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharityId, setSelectedCharityId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchCharitiesAndProfile();
  }, []);

  const fetchCharitiesAndProfile = async () => {
    try {
      setLoading(true);
      setMessage(null);

      // 1. Fetch active charities list
      const { data: charityData, error: charityErr } = await supabase
        .from('charities')
        .select('*')
        .order('name');

      if (charityErr) throw charityErr;
      setCharities(charityData || []);

      // 2. Fetch current user selected charity
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('charity_id')
          .eq('id', user.id)
          .single();

        if (profile?.charity_id) {
          setSelectedCharityId(profile.charity_id);
        }
      }
    } catch (err: any) {
      console.error('Error loading charities:', err);
      setMessage({ type: 'error', text: 'Failed to load charities list.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCharity = async (charityId: string) => {
    try {
      setSaving(true);
      setMessage(null);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setMessage({ type: 'error', text: 'Please login to select a charity.' });
        return;
      }

      const { error: updateErr } = await supabase
        .from('profiles')
        .update({ charity_id: charityId })
        .eq('id', user.id);

      if (updateErr) throw updateErr;

      setSelectedCharityId(charityId);
      setMessage({ type: 'success', text: 'Charity updated successfully!' });
    } catch (err: any) {
      console.error('Error updating charity:', err);
      setMessage({ type: 'error', text: err.message || 'Failed to update charity selection.' });
    } finally {
      setSaving(false);
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
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Heart className="h-8 w-8 text-rose-600" /> Select Your Charity
        </h1>
        <p className="text-gray-600 mt-1">
          Choose the cause you want your subscription fee to support.
        </p>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-rose-50 border border-rose-200 text-rose-700'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 shrink-0" />
          ) : (
            <ShieldAlert className="h-5 w-5 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {charities.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center text-gray-500">
          No charities found in database.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {charities.map((item) => {
            const isSelected = selectedCharityId === item.id;
            return (
              <div
                key={item.id}
                className={`bg-white p-6 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-emerald-500 ring-2 ring-emerald-500/20 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  {isSelected && (
                    <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="h-3.5 w-3.5 mr-1" /> Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-6">{item.description}</p>
                <button
                  onClick={() => handleSelectCharity(item.id)}
                  disabled={saving || isSelected}
                  className={`w-full py-2.5 px-4 rounded-lg text-sm font-medium transition-colors ${
                    isSelected
                      ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                      : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
                >
                  {isSelected ? 'Currently Selected' : 'Choose This Charity'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}