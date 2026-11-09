import React, { useState, useEffect } from 'react';
import LandingPage from './components/landing/LandingPage';
import StudioWizard from './components/studio/StudioWizard';
import HostDashboard from './components/dashboard/HostDashboard';
import InvitationExperience from './components/invitation/InvitationExperience';
import ErrorBoundary from './components/common/ErrorBoundary';
import { DEFAULT_INVITATION_DATA, OCCASIONS } from './data/presets';

export default function App() {
  const [view, setView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (['studio', 'dashboard', 'live'].includes(hash)) return hash;
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (['studio', 'dashboard', 'live'].includes(v)) return v;
    return 'studio'; // Default directly to studio so user immediately sees studio & phone simulator
  });

  const [invitationData, setInvitationData] = useState(() => {
    const saved = localStorage.getItem('wishlys_free_saved_data');
    if (saved) {
      try {
        let text = saved;
        text = text.replaceAll('"/images/', '"./images/').replaceAll('"/audio/', '"./audio/');
        const parsed = JSON.parse(text);
        // Ensure valid initials if monogram initials are missing
        if (!parsed.monogram?.initials && (parsed.hosts?.bride || parsed.hosts?.groom)) {
          const bI = (parsed.hosts?.bride || 'B')[0]?.toUpperCase() || 'B';
          const gI = (parsed.hosts?.groom || 'G')[0]?.toUpperCase() || 'G';
          parsed.monogram = { ...parsed.monogram, initials: `${bI} & ${gI}` };
        }
        if (parsed.template === 'truck' || !parsed.template) {
          parsed.template = 'caricature';
        }
        if (parsed.revealStyle === 'scratch' || !parsed.revealStyle) {
          parsed.revealStyle = 'scratch-date';
        }
        if (!parsed.photos) parsed.photos = {};
        if (!parsed.photos.cover || parsed.photos.cover.includes('zardozi') || parsed.photos.cover.includes('truck')) {
          parsed.photos.cover = './images/templates/caricature.webp';
        }
        if (!parsed.photos.bride || parsed.photos.bride.includes('unsplash')) {
          parsed.photos.bride = './images/bride.webp';
        }
        if (!parsed.photos.groom || parsed.photos.groom.includes('unsplash')) {
          parsed.photos.groom = './images/groom.webp';
        }
        if (!parsed.gallery || !Array.isArray(parsed.gallery) || (parsed.gallery[0]?.url && parsed.gallery[0].url.includes('unsplash'))) {
          parsed.gallery = DEFAULT_INVITATION_DATA.gallery;
        }
        if (!parsed.photos.brideBio || parsed.photos.brideBio === 'Loves classic poetry, morning chai & mountain hikes.') {
          parsed.photos.brideBio = 'Loves classic poetry, morning chai, and spontaneous mountain hikes.';
        }
        if (!parsed.photos.groomBio || parsed.photos.groomBio === 'Foodie, photography enthusiast & architect.') {
          parsed.photos.groomBio = 'Foodie, photography enthusiast, and the architect of their happiest memories.';
        }
        if (parsed.logistics && parsed.logistics.contact && parsed.logistics.contact.includes('Event Concierge')) {
          parsed.logistics.contact = '';
        }
        if (!parsed.atmosphere) {
          parsed.atmosphere = { style: parsed.effect || 'petals', intensity: 'medium' };
        }
        if (!parsed.typography) {
          parsed.typography = {
            preset: 'heritage',
            headingFont: 'Cinzel',
            bodyFont: 'Cormorant Garamond',
            scriptFont: 'Great Vibes',
          };
        }
        return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_INVITATION_DATA;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('wishlys_free_saved_data', JSON.stringify(invitationData));
  }, [invitationData]);

  // Sync hash with view
  useEffect(() => {
    window.location.hash = view;
  }, [view]);

  const handleOpenStudio = (occasionId = 'wedding') => {
    const occ = OCCASIONS.find(o => o.id === occasionId);
    if (occ) {
      setInvitationData(prev => ({
        ...prev,
        occasion: occ.id,
        template: occ.defaultTemplate || prev.template,
        revealStyle: occ.defaultReveal || prev.revealStyle,
      }));
    }
    setView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#FDFBF7]">
        {view === 'landing' && (
          <LandingPage 
            onOpenStudio={handleOpenStudio}
            onOpenDashboard={() => setView('dashboard')}
          />
        )}

        {view === 'studio' && (
          <StudioWizard 
            initialData={invitationData}
            onSave={data => setInvitationData(data)}
            onExitToHome={() => setView('landing')}
            onOpenDashboard={() => setView('dashboard')}
            onOpenLivePreview={() => setView('live')}
          />
        )}

        {view === 'dashboard' && (
          <HostDashboard 
            onBackToStudio={() => setView('studio')}
            onOpenLivePreview={() => setView('live')}
          />
        )}

        {view === 'live' && (
          <div className="relative">
            {/* Top Return bar */}
            <div className="fixed top-4 left-4 z-50">
              <button
                type="button"
                onClick={() => setView('studio')}
                className="bg-black/70 hover:bg-black/90 text-white text-xs font-semibold px-4 py-2 rounded-full backdrop-blur-md border border-white/20 shadow-lg cursor-pointer"
              >
                ← Back to Studio
              </button>
            </div>
            <InvitationExperience data={invitationData} isPreview={false} />
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
