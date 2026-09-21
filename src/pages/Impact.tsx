import { Heart, Globe, Users, ShieldCheck } from 'lucide-react';

interface PartnerCharity {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  percentage: string;
}

const PARTNER_CHARITIES: PartnerCharity[] = [
  {
    id: '1',
    name: 'Youth Golf Development Foundation',
    category: 'Sports & Youth',
    description: 'Providing equipment, coaching, and tournament opportunities to underprivileged young athletes.',
    image: 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?auto=format&fit=crop&q=80&w=800',
    percentage: '40%',
  },
  {
    id: '2',
    name: 'Green Fairways Eco Initiative',
    category: 'Environment',
    description: 'Funding water conservation and sustainable turf management research across regional golf courses.',
    image: 'https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?auto=format&fit=crop&q=80&w=800',
    percentage: '35%',
  },
  {
    id: '3',
    name: 'Community Sports Outreach',
    category: 'Community Welfare',
    description: 'Supporting local health awareness programs and accessible fitness initiatives for seniors.',
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    percentage: '25%',
  },
];

export default function Impact() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Page Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white tracking-tight sm:text-5xl drop-shadow-md">
          Charity & Social Impact
        </h1>
        <p className="mt-4 text-xl text-gray-200 max-w-2xl mx-auto font-medium">
          Every game played and subscription active directly powers meaningful charitable causes across sports and sustainability.
        </p>
      </div>

      {/* Impact Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-md flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
            <Heart className="h-7 w-7" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">₹1,250,000+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Raised</div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-md flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">1,400+</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Lives & Athletes Impacted</div>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-6 border border-gray-200 shadow-md flex items-center gap-4">
          <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
            <Globe className="h-7 w-7" />
          </div>
          <div>
            <div className="text-2xl font-black text-gray-900">12 Courses</div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Eco Projects Funded</div>
          </div>
        </div>
      </div>

      {/* Transparency Guarantee Banner */}
      <div className="bg-emerald-900/90 border border-emerald-500/50 rounded-2xl p-6 mb-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-800 rounded-xl shrink-0">
            <ShieldCheck className="h-8 w-8 text-emerald-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold">100% Transparent Contribution</h3>
            <p className="text-xs text-emerald-200 mt-1">
              A portion of every entry and subscription fee is audited and transferred directly to verified non-profit partners every month.
            </p>
          </div>
        </div>
      </div>

      {/* Partner Charities Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-white mb-6 text-center sm:text-left drop-shadow-sm">
          Partner Non-Profits Supported
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PARTNER_CHARITIES.map((charity) => (
            <div
              key={charity.id}
              className="bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 overflow-hidden shadow-md flex flex-col justify-between hover:shadow-lg transition-shadow"
            >
              <div>
                <img
                  src={charity.image}
                  alt={charity.name}
                  className="w-full h-40 object-cover"
                />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-md">
                      {charity.category}
                    </span>
                    <span className="text-xs font-extrabold text-emerald-600">
                      {charity.percentage} Pool Share
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{charity.name}</h3>
                  <p className="text-xs text-gray-600 leading-relaxed">{charity.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: charity.percentage }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}