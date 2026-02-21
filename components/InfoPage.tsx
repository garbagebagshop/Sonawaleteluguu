
import React, { useMemo, useEffect, useRef, useState } from 'react';
import { PAGE_CONTENT } from '../constants/pageContent';
import { ORG_DETAILS } from '../constants';
import { Twitter, Facebook, Share2, ArrowRight, Loader2, Bookmark, Activity, Info, AlertTriangle } from 'lucide-react';
import { Guide, PriceData } from '../types';
import { Breadcrumbs } from './Breadcrumbs';
import { PriceDashboard } from './PriceDashboard';
import { TrendVisualizer } from './TrendVisualizer';

interface InfoPageProps {
  slug: string;
  onBack: () => void;
  guides?: Guide[];
  onRead?: (slug: string) => void;
  prices: PriceData;
  priceHistory: any[];
}

interface PageData {
  title: string;
  subtitle?: string;
  content: string;
  summary: string;
  author: any;
  featuredImage: string | null;
  imageAlt?: string;
  category?: string;
  focusKeywords?: string;
}

interface RelatedArticle extends Guide {
  score: number;
}

export const InfoPage: React.FC<InfoPageProps> = ({ slug, onBack, guides = [], onRead, prices, priceHistory }) => {
  const [displayedCount, setDisplayedCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const currentGuide = guides.find((g: Guide) => g.slug === slug);
  const staticPage = PAGE_CONTENT[slug];

  const page = useMemo<PageData | null>(() => {
    if (staticPage) {
      return {
        ...staticPage,
        featuredImage: (staticPage as any).featuredImage || null,
        imageAlt: staticPage.title,
        author: null,
        summary: staticPage.title,
        category: "Market Updates",
        focusKeywords: staticPage.focusKeywords
      };
    }
    if (currentGuide) {
      return {
        title: currentGuide.title,
        subtitle: `${currentGuide.author.name} • ${currentGuide.author.role}`,
        content: currentGuide.content,
        summary: currentGuide.summary,
        author: currentGuide.author,
        featuredImage: currentGuide.featuredImage || `https://picsum.photos/seed/${currentGuide.slug}/1200/675`,
        imageAlt: currentGuide.imageAlt || currentGuide.title,
        category: currentGuide.category || "Market Analysis",
        focusKeywords: currentGuide.focusKeywords
      };
    }
    return null;
  }, [staticPage, currentGuide]);

  const isArticle = !!currentGuide;
  const isTodayGoldPage = slug === 'today-gold-rates-in-hyderabad' || slug === 'today-gold';

  useEffect(() => {
    if (!page) return;

    document.title = `${page.title} | సోనావాలే హైదరాబాద్`;

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute('content', page.summary || page.title);

    const metaKeywords = document.querySelector('meta[name="keywords"]');
    const keywords = page.focusKeywords || currentGuide?.focusKeywords;
    if (metaKeywords && keywords) {
      metaKeywords.setAttribute('content', keywords);
    }

    const schemaId = 'dynamic-seo-schema';
    let script = document.getElementById(schemaId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const datePublished = currentGuide?.date || new Date().toISOString();
    const canonicalUrl = `${ORG_DETAILS.url}/${encodeURIComponent(slug)}`;

    let canonicalTag = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', canonicalUrl);

    const primarySchema: any = {
      "@context": "https://schema.org",
      "@type": isArticle ? "NewsArticle" : "WebPage",
      "@id": `${ORG_DETAILS.url}/article/${encodeURIComponent(slug)}`,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": canonicalUrl
      },
      "headline": page.title,
      "description": page.summary,
      "image": {
        "@type": "ImageObject",
        "url": page.featuredImage || ORG_DETAILS.logo,
        "width": 1200,
        "height": 675
      },
      "datePublished": datePublished,
      "dateModified": datePublished,
      "author": (isArticle && page.author) ? {
        "@type": "Person",
        "name": page.author.name,
        "jobTitle": page.author.jobTitle,
        "url": `${ORG_DETAILS.url}/author/${page.author.handle.replace('@', '')}`,
        "sameAs": page.author.sameAs || []
      } : {
        "@id": `${ORG_DETAILS.url}/#organization`
      },
      "publisher": { "@id": `${ORG_DETAILS.url}/#organization` },
      "articleBody": page.content.replace(/<[^>]*>?/gm, ''),
      "articleSection": page.category,
      "inLanguage": "te-IN"
    };

    if (isTodayGoldPage) {
      primarySchema.mainEntity = {
        "@type": "PriceSpecification",
        "price": prices.gold24k,
        "priceCurrency": "INR",
        "validFrom": new Date().toISOString().split('T')[0]
      };
      // Add LocalBusiness Schema details
      primarySchema.publisher = {
        "@type": "JewelryStore",
        "name": ORG_DETAILS.name,
        "image": ORG_DETAILS.logo,
        "telephone": ORG_DETAILS.telephone,
        "address": {
          "@type": "PostalAddress",
          ...ORG_DETAILS.address
        },
        "geo": {
          "@type": "GeoCoordinates",
          ...ORG_DETAILS.geo
        },
        "priceRange": ORG_DETAILS.priceRange,
        "url": ORG_DETAILS.url
      };
    }

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "హోమ్", "item": ORG_DETAILS.url },
        { "@type": "ListItem", "position": 2, "name": page.category, "item": `${ORG_DETAILS.url}/category/${page.category?.toLowerCase().replace(/\s+/g, '-')}` },
        { "@type": "ListItem", "position": 3, "name": page.title, "item": canonicalUrl }
      ]
    };

    script.text = JSON.stringify([primarySchema, breadcrumbSchema]);
    window.scrollTo(0, 0);

    return () => {
      document.title = 'Sonawale | Hyderabad Live Gold & Silver Registry';
    };
  }, [page, slug, isArticle, currentGuide, prices, isTodayGoldPage]);

  const allRelated = useMemo<RelatedArticle[]>(() => {
    if (!isArticle || !currentGuide) return [];

    const currentKeywords = (currentGuide.focusKeywords || currentGuide.title)
      .toLowerCase()
      .split(/[\s,]+/)
      .filter(k => k.length > 3);

    return guides
      .filter((g: Guide) => g.slug !== slug)
      .map((g: Guide) => {
        const targetText = (g.title + ' ' + (g.focusKeywords || '')).toLowerCase();
        let score = currentKeywords.filter(k => targetText.includes(k)).length;
        if (g.category && currentGuide.category && g.category === currentGuide.category) {
          score += 5;
        }
        return { ...g, score };
      })
      .sort((a, b) => b.score - a.score || new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
  }, [slug, guides, isArticle, currentGuide]);

  const displayedRelated = allRelated.slice(0, displayedCount);

  useEffect(() => {
    if (!isArticle || displayedCount >= allRelated.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoadingMore) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedCount((prev) => Math.min(prev + 6, allRelated.length));
            setIsLoadingMore(false);
          }, 600);
        }
      },
      { threshold: 0.1, rootMargin: '400px' }
    );
    if (loadMoreRef.current) observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [allRelated.length, displayedCount, isArticle, isLoadingMore]);

  const safeContentHtml = (page?.content || '').replace(/href=(['"])#([^'"]+)\1/g, 'href="/$2"');

  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp', title: string, itemSlug: string) => {
    const url = encodeURIComponent(`${window.location.origin}/${itemSlug}`);
    const text = encodeURIComponent(`Market Update: ${title}`);
    let shareUrl = '';
    switch (platform) {
      case 'twitter': shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`; break;
      case 'facebook': shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'whatsapp': shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`; break;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  if (!page) {
    return (
      <div className="max-w-xl mx-auto py-24 px-4 text-center">
        <div className="flex justify-center mb-6">
          <AlertTriangle size={64} className="text-accentRed opacity-20" />
        </div>
        <h2 className="text-2xl font-black italic mb-4 telugu-headline uppercase">కథనం కనుగొనబడలేదు</h2>
        <p className="telugu-text opacity-70 mb-8">క్షమించండి, మీరు అభ్యర్థించిన వార్తా నివేదిక ప్రస్తుతం అందుబాటులో లేదు లేదా సర్వర్‌లో అప్‌డేట్ అవుతోంది.</p>
        <button
          onClick={onBack}
          className="px-8 py-4 border-2 border-black font-black uppercase tracking-widest utility-font hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
        >
          తిరిగి వెళ్ళు (BACK HOME)
        </button>
      </div>
    );
  }

  // Final return statement with corrected JSX structure and balanced tags.
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Breadcrumbs items={[
        { label: page.category || "నివేదికలు" },
        { label: page.title, active: true }
      ]} />

      <article itemScope itemType="https://schema.org/NewsArticle">
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-4 text-[#A52A2A] text-[10px] font-black uppercase tracking-widest utility-font">
            <span className="bg-[#A52A2A] text-white px-2 py-0.5 telugu-text font-bold">
              {isTodayGoldPage ? "LIVE MARKET DATA" : "ప్రత్యేక కథనం"}
            </span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold telugu-headline leading-[1.1] tracking-tighter text-black mb-6" itemProp="headline">
            {page.title}
          </h1>

          <div className="flex flex-col md:flex-row md:items-center justify-between border-y-2 border-black py-6 mb-8">
            <div className="flex items-center gap-3">
              {isArticle && page.author ? (
                <>
                  <img src={page.author.avatar} alt={page.author.name} className="w-10 h-10 rounded-full border-2 border-black/5" />
                  <div className="flex flex-col">
                    <span className="text-[12px] font-black uppercase utility-font tracking-tight">{page.author.name}</span>
                    <span className="text-[9px] opacity-60 uppercase font-bold utility-font">{page.author.jobTitle}</span>
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 opacity-60">
                  <Activity size={16} className="text-accentRed" />
                  <span className="text-[10px] font-black uppercase tracking-widest utility-font">Verified Bullion Registry Desk</span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-4 mt-6 md:mt-0">
              <span className="text-[10px] font-black uppercase opacity-40 utility-font tracking-widest">Share Dispatch</span>
              <button onClick={() => handleShare('twitter', page.title, slug)} className="hover:text-[#1DA1F2] transition-colors"><Twitter size={16} /></button>
              <button onClick={() => handleShare('facebook', page.title, slug)} className="hover:text-[#1877F2] transition-colors"><Facebook size={16} /></button>
              <button onClick={() => handleShare('whatsapp', page.title, slug)} className="hover:text-[#25D366] transition-colors"><Share2 size={16} /></button>
            </div>
          </div>

          {isTodayGoldPage && (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
              <div className="md:col-span-4">
                <PriceDashboard prices={prices} loading={false} />
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 text-[10px] font-bold utility-font flex items-start gap-2">
                  <Info size={14} className="shrink-0 text-yellow-600" />
                  <span>Rates shown are indicative for 999 Purity Gold (24K) and 916 Purity Jewelry (22K) at Hyderabad Markets.</span>
                </div>
              </div>
              <div className="md:col-span-8 bg-white border border-black p-4">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[9px] font-black uppercase tracking-widest utility-font">7-Day Price History (24K)</span>
                  <span className="text-[8px] opacity-40 utility-font font-bold">LIVE SYNC ACTIVE</span>
                </div>
                <div className="h-[250px] mb-8">
                  <TrendVisualizer history={priceHistory} />
                </div>

                {/* Historical Data Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black text-white text-[10px] uppercase font-black tracking-widest">
                        <th className="p-3">Date</th>
                        <th className="p-3">Gold 24K (10g)</th>
                        <th className="p-3">Trend</th>
                      </tr>
                    </thead>
                    <tbody className="text-xs font-bold utility-font">
                      {priceHistory.map((day, idx) => (
                        <tr key={idx} className="border-b border-black/10 hover:bg-gray-50">
                          <td className="p-3">{day.fullDate ? new Date(day.fullDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : day.time}</td>
                          <td className="p-3">₹{day.price.toLocaleString()}</td>
                          <td className="p-3 text-[10px] opacity-60">
                            {idx < priceHistory.length - 1 ? (
                              day.price > priceHistory[idx + 1].price ? <span className="text-green-600">▲</span> : <span className="text-red-600">▼</span>
                            ) : '-'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {page.featuredImage && !isTodayGoldPage && (
            <figure className="mb-12 border-2 border-black overflow-hidden relative shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)]">
              <img
                src={page.featuredImage}
                alt={page.imageAlt || page.title}
                className="w-full h-full object-cover aspect-video md:aspect-[21/9]"
                loading="eager"
              />
              <figcaption className="bg-black text-white text-[9px] font-black uppercase tracking-[0.2em] py-2 px-4 italic flex justify-between utility-font">
                <span>HYDERABAD DESK: {slug.toUpperCase()}</span>
                <span>© SONAWALE REGISTRY</span>
              </figcaption>
            </figure>
          )}
        </header>

        <div
          className="telugu-text prose prose-lg md:prose-xl prose-black max-w-none mb-24 drop-cap selection:bg-yellow-200"
          itemProp="articleBody"
          dangerouslySetInnerHTML={{ __html: safeContentHtml }}
        />
      </article>
    </div>
  );
};
