
import React, { useState, useEffect, useMemo } from 'react';
import { PriceTicker } from './components/PriceTicker';
import { PriceDashboard } from './components/PriceDashboard';
import { TrendVisualizer } from './components/TrendVisualizer';
import { DeepDiveGuides } from './components/DeepDiveGuides';
import { AuthorProfile } from './components/AuthorProfile';
import { AuthorPortal } from './components/AuthorPortal';
import { InfoPage } from './components/InfoPage';
import { Calculator } from './components/Calculator';
import { FAQSection } from './components/FAQSection';
import { PriceData, Guide } from './types';
import { HYDERABAD_MARKET_AVERAGES, AUTHORS, GUIDES as INITIAL_GUIDES, ORG_DETAILS } from './constants';
import { initDb, fetchArticles, fetchLatestPrices, savePriceUpdate, fetchPriceHistory } from './lib/db';
import { generateRssFeed } from './lib/rss';
import { generateSitemap } from './lib/sitemap';
import { Twitter, Instagram, Linkedin, Mail, MapPin, Phone, Rss, Globe, ShieldCheck, Newspaper, Home, Menu, Search, Tv, Activity } from 'lucide-react';

const App: React.FC = () => {
  const [prices, setPrices] = useState<PriceData>({
    gold24k: HYDERABAD_MARKET_AVERAGES.gold24k,
    gold22k: HYDERABAD_MARKET_AVERAGES.gold22k,
    silver: HYDERABAD_MARKET_AVERAGES.silver,
    lastUpdated: new Date().toLocaleTimeString('te-IN'),
  });

  const [priceHistory, setPriceHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuthorPortal, setShowAuthorPortal] = useState(false);
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [dynamicGuides, setDynamicGuides] = useState<Guide[]>(INITIAL_GUIDES);
  const [showRss, setShowRss] = useState(false);
  const [showSitemap, setShowSitemap] = useState(false);

  const sortedGuides = useMemo(() => {
    return [...dynamicGuides].sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA; // Ensure latest published is always first
    });
  }, [dynamicGuides]);

  const featuredStory = sortedGuides[0];
  const streamStories = sortedGuides.slice(1);

  const handleBack = () => {
    try {
      window.history.pushState(null, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (e) {
      window.location.hash = '';
    }
    setCurrentPage(null);
    setShowRss(false);
    setShowSitemap(false);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const parseRoute = () => {
      const path = window.location.pathname.replace(/^\/+|\/+$/g, '');
      const hash = window.location.hash.replace(/^#\/?|\/?$/g, '');
      const route = decodeURIComponent(path || hash || '');

      if (route === 'rss.xml') {
        setShowRss(true);
        setShowSitemap(false);
        setCurrentPage(null);
      } else if (route === 'sitemap.xml') {
        setShowSitemap(true);
        setShowRss(false);
        setCurrentPage(null);
      } else if (route) {
        setShowRss(false);
        setShowSitemap(false);
        setCurrentPage(route);
      } else {
        setCurrentPage(null);
        setShowRss(false);
        setShowSitemap(false);
      }
    };

    window.addEventListener('hashchange', parseRoute);
    window.addEventListener('popstate', parseRoute);
    parseRoute();

    const loadData = async () => {
      setLoading(true);
      try {
        await initDb();
        const [dbArticles, latestPrices, history] = await Promise.all([
          fetchArticles(),
          fetchLatestPrices(),
          fetchPriceHistory(7)
        ]);
        setDynamicGuides([...dbArticles, ...INITIAL_GUIDES]);
        if (latestPrices) setPrices(latestPrices);
        if (history && history.length > 0) setPriceHistory(history);
      } catch (err) {
        console.error("Data Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    return () => {
      window.removeEventListener('hashchange', parseRoute);
      window.removeEventListener('popstate', parseRoute);
    };
  }, []);

  const handleUpdatePrices = async (newPrices: PriceData) => {
    try {
      await savePriceUpdate({
        gold24k: newPrices.gold24k,
        gold22k: newPrices.gold22k,
        silver: newPrices.silver
      });
      setPrices(newPrices);
      const history = await fetchPriceHistory(7);
      setPriceHistory(history);
    } catch (err) {
      console.error("Failed to sync prices:", err);
    }
  };

  const handleNavigate = (slug: string) => {
    const cleanSlug = encodeURIComponent(slug.replace(/^\/+|\/+$/g, ''));
    window.history.pushState(null, '', `/${cleanSlug}`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.scrollTo(0, 0);
  };

  if (showRss || showSitemap) {
    const content = showRss ? generateRssFeed(dynamicGuides) : generateSitemap(dynamicGuides);
    return (
      <div className="p-8 font-mono text-sm whitespace-pre-wrap bg-white text-black min-h-screen">
        <button onClick={handleBack} className="mb-4 underline">Back to Main Site</button>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col max-w-[1400px] mx-auto bg-white overflow-x-hidden text-black">
      {/* High Density Header */}
      <nav className="bg-[#B90000] text-white sticky top-0 z-[60] shadow-md w-full">
        <div className="flex items-center justify-between px-3 py-2.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl xs:text-3xl font-black italic tracking-tighter cursor-pointer leading-none" onClick={handleBack}>
              SONAWALE <span className="text-[10px] not-italic opacity-70 align-middle">తెలుగు</span>
            </h1>
          </div>
          <div className="flex items-center gap-3.5">
            <Search size={18} className="cursor-pointer" />
            <Tv size={18} className="cursor-pointer" />
            <Menu size={22} className="cursor-pointer" />
          </div>
        </div>
        <div className="bg-[#A00000] overflow-x-auto no-scrollbar flex items-center gap-5 px-3 py-1.5 text-[12px] font-bold whitespace-nowrap telugu-headline border-t border-white/5">
          <button onClick={handleBack} className="text-yellow-400 flex items-center gap-1 shrink-0">
            <Home size={14} /> హోమ్
          </button>
          <button onClick={() => handleNavigate('today-gold')} className="hover:text-yellow-400 shrink-0">నేటి ధరలు</button>
          <button onClick={() => handleNavigate('pot-market')} className="hover:text-yellow-400 shrink-0">మార్కెట్</button>
          <button onClick={() => handleNavigate('investment-analysis')} className="hover:text-yellow-400 shrink-0">పెట్టుబడి</button>
          <button onClick={() => handleNavigate('tax-compliance')} className="hover:text-yellow-400 shrink-0">GST</button>
          <button onClick={() => handleNavigate('hallmarking-directory')} className="hover:text-yellow-400 shrink-0">హాల్‌మార్క్</button>
        </div>
      </nav>

      <PriceTicker prices={prices} loading={loading} />

      <main className="flex-grow w-full overflow-x-hidden">
        {currentPage ? (
          <div className="px-0 sm:px-4">
            <InfoPage
              slug={currentPage}
              onBack={handleBack}
              guides={dynamicGuides}
              onRead={handleNavigate}
              prices={prices}
              priceHistory={priceHistory}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 w-full">
            <div className="lg:col-span-8 border-r border-black/5">
              {/* Featured Story - Optimized for Density */}
              {featuredStory && (
                <article
                  className="cursor-pointer group border-b border-black/10 w-full"
                  onClick={() => handleNavigate(featuredStory.slug)}
                >
                  <div className="aspect-[16/9] w-full overflow-hidden relative">
                    <img
                      src={featuredStory.featuredImage || `https://picsum.photos/seed/${featuredStory.slug}/1200/675`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                      alt={featuredStory.imageAlt || featuredStory.title}
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2 bg-[#B90000] text-white text-[9px] font-black uppercase px-2 py-0.5 shadow-sm">LATEST DISPATCH</div>
                  </div>
                  <div className="p-4 md:p-6 bg-white">
                    <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold telugu-headline leading-[1.2] mb-2.5 group-hover:text-[#B90000] transition-colors">
                      {featuredStory.title}
                    </h2>
                    <p className="text-[14px] md:text-base text-gray-700 telugu-text line-clamp-3 md:line-clamp-2">
                      {featuredStory.summary}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 utility-font">
                      <span className="text-[#B90000]">BREAKING</span>
                      <span className="opacity-20">•</span>
                      <span>{new Date(featuredStory.date || Date.now()).toLocaleDateString('te-IN', { day: '2-digit', month: 'short' })}</span>
                    </div>
                  </div>
                </article>
              )}

              {/* Updates Section - Edge to Edge on Mobile */}
              <div className="bg-white">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-black/5 bg-gray-50/50">
                  <div className="h-4 w-1 bg-[#B90000]"></div>
                  <h3 className="text-[11px] font-black uppercase tracking-widest italic opacity-70">తాజా వార్తలు / LATEST UPDATES</h3>
                </div>
                <div className="px-0">
                  {loading ? (
                    <div className="divide-y divide-gray-100 px-4">
                      {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="py-4 flex gap-4 animate-pulse">
                          <div className="flex-grow space-y-2"><div className="h-4 bg-gray-100 w-3/4" /><div className="h-4 bg-gray-100 w-1/2" /></div>
                          <div className="w-20 h-20 bg-gray-100 rounded" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <DeepDiveGuides guides={streamStories} onRead={handleNavigate} />
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <aside className="lg:col-span-4 bg-[#F4F1EA]/20 px-4 py-8 md:p-6 space-y-8">
              <section>
                <div className="flex items-center justify-between mb-4 border-b border-black/10 pb-1">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-[#B90000]">Bullion Terminal</h3>
                  <span className="text-[8px] font-bold opacity-40 uppercase">Update: {prices.lastUpdated}</span>
                </div>
                <PriceDashboard prices={prices} loading={loading} />
              </section>

              <section className="bg-white border border-black/5 p-4 shadow-sm">
                <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Activity size={14} className="text-[#B90000]" /> 7-Day Performance
                </h3>
                <div className="h-[150px]">
                  <TrendVisualizer history={priceHistory} />
                </div>
              </section>

              <Calculator prices={prices} />
              <FAQSection />

              <div className="p-4 border border-black/10 text-center bg-white shadow-sm">
                <h4 className="text-[10px] font-black uppercase mb-3 opacity-60">ADMIN PORTAL</h4>
                <button
                  onClick={() => setShowAuthorPortal(true)}
                  className="w-full text-[10px] font-black uppercase bg-black text-white py-4 hover:bg-[#B90000] transition-all active:scale-[0.98]"
                >
                  లాగిన్ / REPORTER ACCESS
                </button>
              </div>
            </aside>
          </div>
        )}
      </main>

      {showAuthorPortal && (
        <AuthorPortal
          onPublish={(art) => setDynamicGuides([art, ...dynamicGuides])}
          onUpdatePrices={handleUpdatePrices}
          currentPrices={prices}
          onClose={() => setShowAuthorPortal(false)}
        />
      )}

      {/* Footer - Restored Missing Links */}
      <footer className="bg-[#111111] text-white pt-12 pb-6 px-4 md:px-8 mt-12 border-t-4 border-[#B90000]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h2 className="text-3xl font-black italic tracking-tighter">SONAWALE</h2>
            <p className="telugu-text opacity-50 text-[14px] leading-relaxed max-w-sm">
              హైదరాబాదు బులియన్ మార్కెట్‌లో అత్యంత విశ్వసనీయమైన ధరల రిజిస్ట్రీ మరియు స్వతంత్ర వార్తా వేదిక. ప్రతి ధర మా నిపుణుల బృందం చేత ధృవీకరించబడింది.
            </p>
            <div className="flex gap-4">
              <Twitter size={20} className="opacity-40 hover:opacity-100 cursor-pointer" />
              <Instagram size={20} className="opacity-40 hover:opacity-100 cursor-pointer" />
              <Mail size={20} className="opacity-40 hover:opacity-100 cursor-pointer" />
            </div>
          </div>

          <div>
            <h4 className="font-black uppercase text-[11px] mb-6 tracking-widest border-l-2 border-[#B90000] pl-3">ముఖ్యమైన లింకులు</h4>
            <ul className="space-y-4 text-[14px] font-bold telugu-headline opacity-60">
              <li><button onClick={() => handleNavigate('today-gold')} className="hover:text-yellow-400">నేటి బంగారం ధరలు (Today Prices)</button></li>
              <li><button onClick={() => handleNavigate('pot-market')} className="hover:text-yellow-400">పొట్ మార్కెట్ రిపోర్ట్</button></li>
              <li><button onClick={() => handleNavigate('investment-analysis')} className="hover:text-yellow-400">పెట్టుబడి విశ్లేషణ</button></li>
              <li><button onClick={() => handleNavigate('hallmarking-directory')} className="hover:text-yellow-400">హాల్‌మార్క్ కేంద్రాలు</button></li>
              <li><button onClick={() => handleNavigate('about')} className="hover:text-yellow-400">మా గురించి (About Us)</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-black uppercase text-[11px] mb-6 tracking-widest border-l-2 border-[#B90000] pl-3">సంప్రదించండి</h4>
            <div className="space-y-5 text-[13px] opacity-60 font-bold utility-font">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-1 shrink-0 text-[#B90000]" />
                <span>Pot Market, Secunderabad, Hyderabad, TS 500003</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-[#B90000]" />
                <span>+91 88865 75507</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-[#B90000]" />
                <span>desk@sonawale.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.2em] opacity-30 text-center">
          <div>© {new Date().getFullYear()} Sonawale Digital News Registry</div>
          <div className="flex gap-8">
            <button onClick={() => handleNavigate('privacy')} className="hover:text-white">Privacy</button>
            <button onClick={() => handleNavigate('terms')} className="hover:text-white">Terms</button>
            <button onClick={() => handleNavigate('disclaimer')} className="hover:text-white">Disclaimer</button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
