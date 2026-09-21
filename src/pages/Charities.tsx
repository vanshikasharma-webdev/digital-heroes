import { useEffect, useState } from 'react'
import { Heart, Search } from 'lucide-react'
import { supabase } from '../lib/supabase'

type Charity = {
  id: string
  name: string
  description: string | null
  image_url: string | null
}

function Charities() {
  const [charities, setCharities] = useState<Charity[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  async function loadCharities() {
    setLoading(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from('charities')
      .select('id, name, description, image_url')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) {
      setErrorMessage(error.message)
      setLoading(false)
      return
    }

    setCharities(data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    loadCharities()
  }, [])

  const filteredCharities = charities.filter((charity) => {
    const search = searchTerm.toLowerCase().trim()

    if (!search) {
      return true
    }

    return (
      charity.name.toLowerCase().includes(search) ||
      charity.description?.toLowerCase().includes(search)
    )
  })

  return (
    <main className="min-h-screen bg-[#080d18] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-slate-500">
            Digital Heroes
          </p>

          <h1 className="mt-3 text-3xl font-semibold tracking-tight">
            Support a Charity
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Explore the charities supported through Digital Heroes and discover
            the causes your subscription can help.
          </p>
        </div>

        <div className="relative mt-8 max-w-xl">
          <Search
            size={18}
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
          />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search charities..."
            className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-blue-400/60"
          />
        </div>

        {errorMessage && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {loading ? (
          <div className="py-16 text-center">
            <p className="text-sm text-slate-500">
              Loading charities...
            </p>
          </div>
        ) : filteredCharities.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/10 px-6 py-16 text-center">
            <Heart
              size={30}
              className="mx-auto text-slate-600"
            />

            <p className="mt-4 text-sm text-slate-400">
              {charities.length === 0
                ? 'No active charities have been added yet.'
                : 'No charities match your search.'}
            </p>
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCharities.map((charity) => (
              <article
                key={charity.id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                {charity.image_url ? (
                  <img
                    src={charity.image_url}
                    alt={charity.name}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-white/[0.03]">
                    <Heart
                      size={36}
                      className="text-slate-600"
                    />
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-lg font-semibold">
                    {charity.name}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {charity.description ||
                      'No description has been added yet.'}
                  </p>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default Charities