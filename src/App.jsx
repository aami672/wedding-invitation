import React, { useState, useEffect } from 'react';
import LandingPage from './components/landing/LandingPage';
import StudioWizard from './components/studio/StudioWizard';
import HostDashboard from './components/dashboard/HostDashboard';
import ErrorBoundary from './components/common/ErrorBoundary';
import { OCCASIONS } from './data/presets';
import {
  getInitialClientData,
  saveClientLocal,
  computeCoupleSlug,
  getSavedClient,
  getSavedClientAsync,
  setActiveClientSlug,
} from './utils/clientStore';

export default function App() {
  const [view, setView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'live') {
      const slug = computeCoupleSlug(getInitialClientData()?.hosts);
      window.location.replace(`./published/${slug}.html`);
      return 'studio';
    }
    if (['studio', 'dashboard', 'landing'].includes(hash)) return hash;
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'live') {
      const slug = computeCoupleSlug(getInitialClientData()?.hosts);
      window.location.replace(`./published/${slug}.html`);
      return 'studio';
    }
    if (['studio', 'dashboard', 'landing'].includes(v)) return v;
    return 'studio'; // Default directly to studio so user immediately sees studio & phone simulator
  });

  const [invitationData, setInvitationData] = useState(() => getInitialClientData());

  // Hydrate client asynchronously from IndexedDB / local /api/clients if ?client=<slug> wasn't cached
  useEffect(() => {
    const urlSlug = new URLSearchParams(window.location.search).get('client');
    if (urlSlug && !getSavedClient(urlSlug)) {
      getSavedClientAsync(urlSlug).then((loaded) => {
        if (loaded) {
          setActiveClientSlug(urlSlug);
          setInvitationData(loaded);
        }
      });
    }
  }, []);

  // Auto-save full active client state under its own couple slug without overwriting other clients
  useEffect(() => {
    saveClientLocal(invitationData);
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
              const slug = computeCoupleSlug(invitationData?.hosts);
              window.open(`./published/${slug}.html`, '_blank');
            }}
          />
        )}

        {view === 'dashboard' && (
          <HostDashboard 
            onBackToStudio={() => setView('studio')}
            onOpenLivePreview={() => {
              const slug = computeCoupleSlug(invitationData?.hosts);
              window.open(`./published/${slug}.html`, '_blank');
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
