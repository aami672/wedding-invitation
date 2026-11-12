import React, { useState, useEffect } from 'react';
import LandingPage from './components/landing/LandingPage';
import StudioWizard from './components/studio/StudioWizard';
import OccasionStudioWizard from './components/occasions/OccasionStudioWizard';
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
import {
  getOccasionFromLocation,
  getOccasionUrl,
  getSiteRootUrl,
  resolvePublishedUrl,
} from './utils/appAssets';

export default function App() {
  const initialPathOccasion = getOccasionFromLocation();

  const [view, setView] = useState(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash === 'live') {
      const liveData = getInitialClientData(initialPathOccasion);
      const slug = computeCoupleSlug(liveData?.hosts, liveData?.customSlug);
      window.location.replace(resolvePublishedUrl(slug));
      return 'studio';
    }
    if (hash === 'studio' || hash === 'landing') return hash;

    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'live') {
      const liveData = getInitialClientData(initialPathOccasion);
      const slug = computeCoupleSlug(liveData?.hosts, liveData?.customSlug);
      window.location.replace(resolvePublishedUrl(slug));
      return 'studio';
    }
    if (v === 'studio' || v === 'landing') return v;

    if (params.get('client') || initialPathOccasion) {
      return 'studio';
    }
    return 'landing';
  });

  const [invitationData, setInvitationData] = useState(() =>
    getInitialClientData(initialPathOccasion || 'wedding')
  );

  // Hydrate client asynchronously from IndexedDB / local /api/clients if ?client=<slug> wasn't cached
  useEffect(() => {
    const urlSlug = new URLSearchParams(window.location.search).get('client');
    if (urlSlug && !getSavedClient(urlSlug)) {
      getSavedClientAsync(urlSlug).then((loaded) => {
        if (loaded) {
          setActiveClientSlug(urlSlug, loaded.occasion || 'wedding');
          setInvitationData(loaded);
        }
      });
    }
  }, []);

  // Auto-save full active client state under its own couple slug without overwriting other clients
  useEffect(() => {
    saveClientLocal(invitationData);
  }, [invitationData]);

  // Keep URL hash cleanly synced (#studio in studio, clean URL on landing) and support back/forward
  useEffect(() => {
    if (view === 'studio') {
      if (window.location.hash !== '#studio') {
        window.location.hash = 'studio';
      }
    } else if (window.location.hash === '#studio' || window.location.hash === '#landing') {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }, [view]);

  useEffect(() => {
    const onHashChange = () => {
      const h = window.location.hash.replace('#', '');
      if (h === 'studio') setView('studio');
      else if (h === '' || h === 'landing') {
        if (!getOccasionFromLocation()) setView('landing');
      }
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleOpenStudio = (occasionId = 'wedding') => {
    const targetUrl = getOccasionUrl(occasionId);
    const currentPath = window.location.pathname;
    let targetPath = currentPath;
    try {
      targetPath = new URL(targetUrl, window.location.href).pathname;
    } catch {
      targetPath = currentPath;
    }

    if (targetPath !== currentPath) {
      window.location.assign(targetUrl);
      return;
    }

    const occ = OCCASIONS.find(o => o.id === occasionId);
    const freshData = getInitialClientData(occasionId);
    if (occ && occasionId !== 'wedding') {
      setInvitationData({
        ...freshData,
        occasion: occ.id,
        template: freshData.template || occ.defaultTemplate,
        revealStyle: freshData.revealStyle || occ.defaultReveal,
      });
    } else {
      setInvitationData(freshData);
    }
    setView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitToHome = () => {
    if (getOccasionFromLocation()) {
      window.location.assign(getSiteRootUrl());
      return;
    }
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeOccasion = initialPathOccasion
    || (invitationData?.occasion && invitationData.occasion !== 'wedding' && new URLSearchParams(window.location.search).get('client')
      ? invitationData.occasion
      : 'wedding');

  return (
    <ErrorBoundary>
      <div className="paigaam-site min-h-screen bg-[#120C0A] text-[#FBF7F0]">
        {view === 'landing' && (
          <LandingPage
            onOpenStudio={handleOpenStudio}
          />
        )}

        {view === 'studio' && activeOccasion !== 'wedding' && (
          <OccasionStudioWizard
            occasionId={activeOccasion}
            initialData={invitationData}
            onSave={data => setInvitationData(data)}
            onExitToHome={handleExitToHome}
          />
        )}

        {view === 'studio' && activeOccasion === 'wedding' && (
          <StudioWizard
            initialData={invitationData}
            onSave={data => setInvitationData(data)}
            onExitToHome={handleExitToHome}
            onOpenLivePreview={() => {
              const slug = computeCoupleSlug(invitationData?.hosts);
              window.open(resolvePublishedUrl(slug), '_blank');
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
