import React, { useState, useEffect } from 'react';
import LandingPage from './components/landing/LandingPage';
import StudioWizard from './components/studio/StudioWizard';
import HostDashboard from './components/dashboard/HostDashboard';
import ErrorBoundary from './components/common/ErrorBoundary';
import { DEFAULT_INVITATION_DATA, OCCASIONS } from './data/presets';

export default function App() {
  const [view, setView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'live') {
      window.location.replace('./published/preeti-and-ashish.html');
      return 'studio';
    }
    if (['studio', 'dashboard', 'landing'].includes(hash)) return hash;
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'live') {
      window.location.replace('./published/preeti-and-ashish.html');
      return 'studio';
    }
    if (['studio', 'dashboard', 'landing'].includes(v)) return v;
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
        if (!parsed.template) {
          parsed.template = 'caricature';
        }
        if (!parsed.revealStyle) {
          parsed.revealStyle = parsed.template === 'caricature' ? 'folding-doors' : 'scratch-date';
        }
        if (!parsed.photos) parsed.photos = {};
        if (!parsed.photos.cover || parsed.photos.cover.includes('caricature.webp') || parsed.photos.cover.includes('scooter_couple.webp') || parsed.photos.cover.includes('zardozi') || parsed.photos.cover.includes('truck') || parsed.photos.cover.includes('04-pheras.webp')) {
          parsed.photos.cover = './images/themes/Luxe-Pastel-Caricature/03-sangeet.webp';
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
    try {
      localStorage.setItem('wishlys_free_saved_data', JSON.stringify(invitationData));
      localStorage.setItem('wishlys_published_data', JSON.stringify(invitationData));
      localStorage.setItem('wishlys_published_data_preeti-and-ashish', JSON.stringify(invitationData));
    } catch (e) {
      console.warn('localStorage save notice:', e);
    }
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
            onOpenLivePreview={() => {
              const b = (invitationData?.hosts?.bride || 'preeti').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const g = (invitationData?.hosts?.groom || 'ashish').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const slug = (b && g) ? `${b}-and-${g}` : 'preeti-and-ashish';
              window.open(`./published/${slug}.html`, '_blank');
            }}
          />
        )}

        {view === 'dashboard' && (
          <HostDashboard 
            onBackToStudio={() => setView('studio')}
            onOpenLivePreview={() => {
              const b = (invitationData?.hosts?.bride || 'preeti').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const g = (invitationData?.hosts?.groom || 'ashish').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
              const slug = (b && g) ? `${b}-and-${g}` : 'preeti-and-ashish';
              window.open(`./published/${slug}.html`, '_blank');
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
