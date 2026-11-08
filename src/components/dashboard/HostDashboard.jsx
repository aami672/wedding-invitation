import React, { useState, useEffect } from 'react';
import { 
  Users, CheckCircle2, XCircle, Clock, Download, Search, 
  Music, Utensils, ArrowLeft, RefreshCw, Trash2, ExternalLink, ShieldCheck
} from 'lucide-react';

export default function HostDashboard({ onBackToStudio, onOpenLivePreview }) {
  const [rsvps, setRsvps] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all', 'attending', 'declined'
  const [search, setSearch] = useState('');

  // Sample default RSVPs if none are present in localStorage
  useEffect(() => {
    const stored = localStorage.getItem('wishlys_rsvps');
    if (stored) {
      setRsvps(JSON.parse(stored));
    } else {
      const initialSeed = [
        {
          id: 'seed_1',
          name: 'Kabir & Ananya Roy',
          phone: '+91 98200 11223',
          status: 'attending',
          guestCount: 2,
          dietary: 'Vegetarian',
          songRequest: 'Gallan Goodiyaan',
          message: 'Super thrilled for you both! See you on the dance floor.',
          submittedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        },
        {
          id: 'seed_2',
          name: 'Rohan Mehra & Family',
          phone: '+91 98111 22334',
          status: 'attending',
          guestCount: 4,
          dietary: 'Jain',
          songRequest: 'London Thumakda',
          message: 'Blessings to the wonderful couple from all of us.',
          submittedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
        },
        {
          id: 'seed_3',
          name: 'Devika Singhania',
          phone: '+91 99300 44556',
          status: 'declined',
          guestCount: 0,
          dietary: 'None',
          songRequest: '',
          message: 'So sad to miss it due to international travel, sending all my love!',
          submittedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 'seed_4',
          name: 'Vikram Joshi & Tanya',
          phone: '+91 98450 77889',
          status: 'attending',
          guestCount: 2,
          dietary: 'Non-Vegetarian',
          songRequest: 'Mauja Hi Mauja',
          message: 'Counting down the days to Udaipur!',
          submittedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
        },
      ];
      setRsvps(initialSeed);
      localStorage.setItem('wishlys_rsvps', JSON.stringify(initialSeed));
    }
  }, []);

  const totalResponses = rsvps.length;
  const attendingRsvps = rsvps.filter(r => r.status === 'attending');
  const totalAttendingGuests = attendingRsvps.reduce((acc, curr) => acc + (Number(curr.guestCount) || 0), 0);
  const totalDeclined = rsvps.filter(r => r.status === 'declined').length;
  const attendanceRate = totalResponses > 0 ? Math.round((attendingRsvps.length / totalResponses) * 100) : 0;

  // Filtered list
  const filteredList = rsvps.filter(r => {
    if (filter === 'attending' && r.status !== 'attending') return false;
    if (filter === 'declined' && r.status !== 'declined') return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return r.name.toLowerCase().includes(q) || (r.phone && r.phone.includes(q)) || (r.songRequest && r.songRequest.toLowerCase().includes(q));
    }
    return true;
  });

  const handleDelete = (id) => {
    const updated = rsvps.filter(r => r.id !== id);
    setRsvps(updated);
    localStorage.setItem('wishlys_rsvps', JSON.stringify(updated));
  };

  const handleExportCsv = () => {
    const headers = ['Guest Name', 'Phone', 'Status', 'Total Guests', 'Dietary Preference', 'Song Request', 'Message', 'Submitted Date'];
    const rows = rsvps.map(r => [
      `"${r.name}"`,
      `"${r.phone || ''}"`,
      r.status,
      r.guestCount,
      `"${r.dietary || ''}"`,
      `"${r.songRequest || ''}"`,
      `"${(r.message || '').replace(/"/g, '""')}"`,
      new Date(r.submittedAt).toLocaleDateString(),
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `wishlys-guest-list-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-stone-900 font-sans">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E6D5BF] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBackToStudio}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Studio</span>
          </button>
          <div className="h-4 w-px bg-stone-200" />
          <div>
            <h1 className="font-serif text-xl font-light text-[#2B1E17] leading-none">
              Private Host Dashboard
            </h1>
            <p className="text-[10px] text-[#8B6F47] tracking-wider uppercase font-semibold">
              Live RSVP Center & Guest Analytics
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#2B1E17] text-white hover:bg-[#8B6F47] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* KPI STAT CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-[10px] tracking-widest uppercase font-bold text-stone-400">Total Responses</span>
            <p className="font-serif text-3xl font-light text-stone-900">{totalResponses}</p>
            <p className="text-xs text-stone-500 font-light">Responses logged</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-[10px] tracking-widest uppercase font-bold text-emerald-600">Attending Headcount</span>
            <p className="font-serif text-3xl font-light text-emerald-700">{totalAttendingGuests}</p>
            <p className="text-xs text-emerald-600 font-light">{attendingRsvps.length} party reservations</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-[10px] tracking-widest uppercase font-bold text-stone-400">Regretfully Declined</span>
            <p className="font-serif text-3xl font-light text-stone-700">{totalDeclined}</p>
            <p className="text-xs text-stone-500 font-light">Unable to join</p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-1">
            <span className="text-[10px] tracking-widest uppercase font-bold text-[#8B6F47]">Acceptance Rate</span>
            <p className="font-serif text-3xl font-light text-[#8B6F47]">{attendanceRate}%</p>
            <p className="text-xs text-stone-500 font-light">Confirmation ratio</p>
          </div>
        </div>

        {/* SONG REQUESTS & DIETARY SUMMARY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* DJ Song Request Jukebox */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 text-[#8B6F47]" />
              <h2 className="font-serif text-xl font-light text-[#2B1E17]">DJ Jukebox & Song Requests</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rsvps.filter(r => r.songRequest).map((r, i) => (
                <div key={i} className="p-3.5 bg-[#FAF5ED] rounded-xl border border-[#E6D5BF] space-y-1">
                  <p className="text-xs font-bold text-stone-800">🎵 "{r.songRequest}"</p>
                  <p className="text-[10px] text-[#8B6F47] uppercase font-semibold">Requested by {r.name}</p>
                </div>
              ))}
              {rsvps.filter(r => r.songRequest).length === 0 && (
                <p className="text-xs text-stone-400 italic">No songs requested yet.</p>
              )}
            </div>
          </div>

          {/* Dietary Summary */}
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Utensils className="w-5 h-5 text-[#8B6F47]" />
              <h2 className="font-serif text-xl font-light text-[#2B1E17]">Catering Breakdown</h2>
            </div>
            <div className="space-y-2 text-xs">
              {['Vegetarian', 'Jain', 'Non-Vegetarian', 'Vegan'].map(type => {
                const count = rsvps.filter(r => r.status === 'attending' && r.dietary === type).length;
                return (
                  <div key={type} className="flex justify-between items-center py-1.5 border-b border-stone-100">
                    <span className="text-stone-700">{type}</span>
                    <span className="font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded-full">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* GUEST RESPONSES TABLE */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden space-y-4 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-serif text-2xl font-light text-[#2B1E17]">Guest Responses</h2>
              <p className="text-xs text-stone-500">Live replies updated instantly when guests submit their RSVP.</p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search guests..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#8B6F47]"
                />
              </div>

              <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                    filter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('attending')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                    filter === 'attending' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-500'
                  }`}
                >
                  Attending
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('declined')}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-pointer ${
                    filter === 'declined' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-500'
                  }`}
                >
                  Declined
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-y border-stone-200 text-stone-500 font-semibold tracking-wider uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Guest Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Count</th>
                  <th className="py-3 px-4">Dietary</th>
                  <th className="py-3 px-4">Wishes / Note</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredList.map((guest) => (
                  <tr key={guest.id} className="hover:bg-stone-50/60 transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-stone-900">
                      {guest.name}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 font-mono text-[11px]">
                      {guest.phone || '—'}
                    </td>
                    <td className="py-3.5 px-4">
                      {guest.status === 'attending' ? (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3" />
                          Attending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3 h-3" />
                          Declined
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-stone-800">
                      {guest.status === 'attending' ? `${guest.guestCount} guests` : '0'}
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      {guest.dietary || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-stone-500 max-w-xs truncate italic">
                      {guest.message || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDelete(guest.id)}
                        className="text-stone-400 hover:text-red-500 p-1 cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredList.length === 0 && (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400 italic">
                      No matching guest responses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
