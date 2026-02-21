
import React, { useState, useRef, useEffect } from 'react';
import { AUTHORS, ORG_DETAILS } from '../constants';
import { PriceData, Guide } from '../types';
import { SEOPlugin } from './SEOPlugin';
import { saveArticleToDb, getDbStatus } from '../lib/db';
import { uploadToR2, convertToWebP } from '../lib/storage';
import { Loader2, AlertCircle, CheckCircle2, X, RefreshCw, Database, Cloud, ShieldAlert } from 'lucide-react';

interface AuthorPortalProps {
  onPublish: (article: Guide) => void;
  onUpdatePrices: (prices: PriceData) => void;
  currentPrices: PriceData;
  onClose: () => void;
}

const CATEGORIES = ["Market Analysis", "Legal & Policy", "Heritage & Craft", "Investment Advice", "Daily Updates"];

export const AuthorPortal: React.FC<AuthorPortalProps> = ({
  onPublish,
  onUpdatePrices,
  currentPrices,
  onClose
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [view, setView] = useState<'dashboard' | 'editor' | 'prices'>('dashboard');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auth logic: strict in production, developer fallback in local/dev only.
  const DEFAULT_ADMIN_ID = '8886575507';
  const DEV_BOOTSTRAP_PASSWORD = 'Harsh@123';
  const isDev = (import.meta as any).env?.DEV;
  // @ts-ignore
  const ADMIN_ID = process.env.ADMIN_ID || (import.meta as any).env?.VITE_ADMIN_ID || DEFAULT_ADMIN_ID;
  // @ts-ignore
  const ADMIN_PASS = process.env.ADMIN_PASSWORD || (import.meta as any).env?.VITE_ADMIN_PASSWORD || (isDev ? DEV_BOOTSTRAP_PASSWORD : '');

  const dbStatus = getDbStatus();

  const [localGold24k, setLocalGold24k] = useState(currentPrices.gold24k.toString());
  const [localGold22k, setLocalGold22k] = useState(currentPrices.gold22k.toString());
  const [localSilver, setLocalSilver] = useState(currentPrices.silver.toString());

  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [focusKeywords, setFocusKeywords] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  }, [content, view]);

  /**
   * Inserts formatting tags into the content textarea at current cursor position
   */
  const insertText = (before: string, after: string) => {
    if (!contentRef.current) return;
    const textarea = contentRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;
    const selected = text.substring(start, end);
    const newText = text.substring(0, start) + before + selected + after + text.substring(end);
    setContent(newText);

    // Focus back and set selection
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  /**
   * Handles local image selection and preview
   */
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFeaturedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!ADMIN_PASS) {
      setErrorMessage("Admin password is not configured. Set ADMIN_PASSWORD / VITE_ADMIN_PASSWORD in environment.");
      return;
    }

    if (loginId === ADMIN_ID && password === ADMIN_PASS) {
      setIsLoggedIn(true);
      setErrorMessage(null);
    } else {
      setErrorMessage("Invalid Press Credentials. Access Denied.");
    }
  };

  const handlePriceUpdate = async () => {
    const next24k = Number(localGold24k);
    const next22k = Number(localGold22k);
    const nextSilver = Number(localSilver);

    if (![next24k, next22k, nextSilver].every((n) => Number.isFinite(n) && n > 0)) {
      setErrorMessage('Enter valid positive values for all price fields before updating.');
      return;
    }

    setIsUpdatingPrices(true);
    setErrorMessage(null);
    try {
      await onUpdatePrices({
        gold24k: Math.round(next24k),
        gold22k: Math.round(next22k),
        silver: Math.round(nextSilver),
        lastUpdated: new Date().toLocaleTimeString('te-IN')
      });
      setSuccessMessage("Live Market Prices Commited to Turso DB.");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to sync price registry.");
    } finally {
      setIsUpdatingPrices(false);
    }
  };

  const handlePublish = async (skipR2 = false) => {
    if (!title || !content) {
      setErrorMessage("Headline and content are mandatory.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    let slug = title
      .trim()
      .replace(/[^\u0C00-\u0C7F\w\s-]+/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .toLowerCase();

    if (!slug || slug === '-') {
      slug = 'dispatch-' + Date.now();
    }

    try {
      let finalImageUrl: string | undefined = featuredImage;

      if (imageFile && !skipR2) {
        try {
          setUploadProgress('TRANSCODING...');
          const webpBlob = await convertToWebP(imageFile);
          setUploadProgress('UPLOADING...');
          const uploadedUrl = await uploadToR2(webpBlob, slug);
          finalImageUrl = uploadedUrl;
        } catch (imgErr: any) {
          console.warn("Storage Error, offering fallback:", imgErr);
          setErrorMessage(`R2 Storage Offline: ${imgErr.message}. You can still publish using the "Direct DB Upload" button below.`);
          setIsSubmitting(false);
          setUploadProgress('');
          return;
        }
      }

      setUploadProgress('SYNCING DB...');
      const newArticle: Guide = {
        title,
        summary,
        content,
        featuredImage: finalImageUrl,
        imageAlt: title, // Auto-generate alt text from title for SEO
        slug,
        author: AUTHORS.skulkarni,
        date: new Date().toISOString(),
        focusKeywords,
        category
      };

      await saveArticleToDb(newArticle);
      onPublish(newArticle);
      setSuccessMessage("Dispatch Published Successfully.");

      setTimeout(() => {
        setSuccessMessage(null);
        setView('dashboard');
        setTitle(''); setSummary(''); setContent(''); setFocusKeywords(''); setFeaturedImage(undefined); setImageFile(null);
      }, 2000);

    } catch (err: any) {
      console.error("Publication Error:", err);
      setErrorMessage(err.message || "Database connection error. Try again.");
    } finally {
      setIsSubmitting(false);
      setUploadProgress('');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[100] bg-[#F4F1EA] flex items-center justify-center p-4 text-black">
        <div className="w-full max-w-md border-4 border-black p-6 md:p-8 bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-2xl font-black italic mb-6 text-center underline decoration-dotted uppercase">Press Access</h2>
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 border border-red-500 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle size={14} /> {errorMessage}
            </div>
          )}
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="text" placeholder="Reporter ID" value={loginId} onChange={e => setLoginId(e.target.value)} required className="w-full border-2 border-black p-4 outline-none focus:bg-yellow-50 bg-white" />
            <input type="password" placeholder="Passkey" value={password} onChange={e => setPassword(e.target.value)} required className="w-full border-2 border-black p-4 outline-none focus:bg-yellow-50 bg-white" />
            <button type="submit" className="w-full bg-black text-white p-5 font-black uppercase tracking-widest hover:bg-[#A52A2A]">Authenticate</button>
            <button type="button" onClick={onClose} className="w-full text-[10px] font-bold uppercase opacity-40 underline mt-4 text-center block">Cancel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] bg-[#F4F1EA] flex flex-col text-black">
      <header className="border-b-2 border-black p-3 md:p-4 flex justify-between items-center bg-white sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-black italic uppercase">Editorial Desk</h2>
          {isSubmitting && (
            <div className="flex items-center gap-2 bg-yellow-100 px-3 py-1 text-[10px] font-black uppercase border border-yellow-300 animate-pulse">
              <RefreshCw className="animate-spin" size={12} /> {uploadProgress}
            </div>
          )}
        </div>
        <div className="flex gap-1">
          {['dashboard', 'editor', 'prices'].map((v) => (
            <button key={v} onClick={() => { setView(v as any); setErrorMessage(null); }} className={`px-3 py-2 border-2 border-black text-[9px] font-black uppercase transition-all ${view === v ? 'bg-black text-white' : 'bg-white'}`}>
              {v.slice(0, 4)}
            </button>
          ))}
          <button onClick={onClose} className="px-3 py-2 border-2 border-black text-[9px] font-black uppercase bg-red-50">Exit</button>
        </div>
      </header>

      {/* Connectivity Status Overlay */}
      <div className="fixed bottom-4 left-4 z-[120] flex flex-col gap-2">
        <div className={`flex items-center gap-2 px-3 py-1.5 border border-black text-[8px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${dbStatus.isConnected ? 'bg-green-500 text-white' : 'bg-red-500 text-white animate-pulse'}`}>
          <Database size={10} /> DB: {dbStatus.isConnected ? 'CONNECTED' : 'OFFLINE'}
        </div>
      </div>

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[110] w-full max-w-md px-4 pointer-events-none">
        {errorMessage && (
          <div className="bg-red-600 text-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex flex-col pointer-events-auto">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <div>
                  <h4 className="font-black uppercase text-[10px] tracking-widest mb-1">Transmission Error</h4>
                  <p className="text-xs leading-relaxed">{errorMessage}</p>
                </div>
              </div>
              <button onClick={() => setErrorMessage(null)} className="p-1 hover:bg-white/20"><X size={16} /></button>
            </div>
            {errorMessage.includes("connection missing") && (
              <p className="mt-2 text-[8px] font-bold opacity-70 uppercase">Ensure TURSO_DATABASE_URL (or TURSO_URL) and TURSO_AUTH_TOKEN are set in Vercel settings. For Vite builds, also expose VITE_TURSO_URL and VITE_TURSO_AUTH_TOKEN.</p>
            )}
            {errorMessage.includes("R2 Storage Offline") && (
              <button
                onClick={() => handlePublish(true)}
                className="mt-3 bg-white text-black py-2 text-[10px] font-black uppercase tracking-widest hover:bg-yellow-100 border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-[1px]"
              >
                Publish using Direct DB Upload
              </button>
            )}
          </div>
        )}
        {successMessage && (
          <div className="bg-green-600 text-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-2 border-black flex items-center gap-3 animate-in slide-in-from-bottom-2 pointer-events-auto">
            <CheckCircle2 size={20} />
            <span className="text-sm font-black italic">{successMessage}</span>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto pb-20">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {view === 'prices' && (
            <div className="bg-white border-2 border-black p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="text-2xl font-black mb-6 italic uppercase">Price Registry Update</h3>
              <div className="space-y-6 mb-8">
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 mb-1 block">Gold 24K (Per 10g)</label>
                  <input type="number" value={localGold24k} onChange={e => setLocalGold24k(e.target.value)} className="w-full border-2 border-black p-4 text-xl font-black bg-white" placeholder="24K Price" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 mb-1 block">Gold 22K (Per 10g)</label>
                  <input type="number" value={localGold22k} onChange={e => setLocalGold22k(e.target.value)} className="w-full border-2 border-black p-4 text-xl font-black bg-white" placeholder="22K Price" />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase opacity-40 mb-1 block">Silver (Per 1kg)</label>
                  <input type="number" value={localSilver} onChange={e => setLocalSilver(e.target.value)} className="w-full border-2 border-black p-4 text-xl font-black bg-white" placeholder="Silver Price" />
                </div>
              </div>
              <button
                onClick={handlePriceUpdate}
                disabled={isUpdatingPrices || !dbStatus.isConnected}
                className={`px-8 py-5 font-black uppercase tracking-widest w-full flex items-center justify-center gap-2 ${!dbStatus.isConnected ? 'bg-gray-400 cursor-not-allowed' : 'bg-black text-white hover:bg-[#A52A2A]'}`}
              >
                {isUpdatingPrices ? <><Loader2 className="animate-spin" size={18} /> Syncing...</> : !dbStatus.isConnected ? "DB Offline - Update Disabled" : "Commit to Live Feed"}
              </button>
            </div>
          )}

          {view === 'editor' && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-black p-6 md:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                {!dbStatus.isConnected && (
                  <div className="mb-6 p-4 bg-red-50 border-2 border-red-500 flex items-center gap-3">
                    <ShieldAlert className="text-red-600" />
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-red-600">Connectivity Alert</h4>
                      <p className="text-[11px] font-bold">Turso DB is not connected. Articles will NOT be saved to the registry.</p>
                    </div>
                  </div>
                )}
                <div className="space-y-6">
                  <div className="flex gap-2 border-b border-black/10 pb-4 overflow-x-auto no-scrollbar">
                    <button onClick={() => insertText('<b>', '</b>')} className="px-4 py-2 border border-black text-[10px] font-black uppercase">Bold</button>
                    <button onClick={() => insertText('<i>', '</i>')} className="px-4 py-2 border border-black text-[10px] font-black italic uppercase">Italic</button>
                    <button onClick={() => insertText('<h2>', '</h2>')} className="px-4 py-2 border border-black text-[10px] font-black uppercase">Headline</button>
                  </div>

                  <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Headline..." className="w-full text-3xl font-black border-none outline-none font-serif telugu-headline bg-white text-black" />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black uppercase opacity-40 block mb-1">Category</label>
                      <select value={category} onChange={e => setCategory(e.target.value)} className="w-full border-2 border-black p-3 text-[11px] font-black uppercase utility-font bg-white">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-[9px] font-black uppercase opacity-40 block mb-1">SEO Keywords</label>
                      <input value={focusKeywords} onChange={e => setFocusKeywords(e.target.value)} placeholder="tags, hyderabad, gold" className="w-full border-2 border-black p-3 text-[11px] bg-white" />
                    </div>
                  </div>

                  <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Short Abstract..." className="w-full h-24 text-base italic border-l-4 border-black/20 pl-4 outline-none bg-white text-black" />

                  <div className="border-2 border-dashed border-black p-8 text-center relative hover:bg-gray-50 bg-white">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                    {featuredImage ? (
                      <div className="relative inline-block">
                        <img src={featuredImage} className="max-h-48 mx-auto" alt="Preview" />
                        <button onClick={(e) => { e.stopPropagation(); setFeaturedImage(undefined); setImageFile(null); }} className="absolute -top-2 -right-2 bg-black text-white rounded-full p-1 shadow-md"><X size={14} /></button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-[10px] font-black uppercase">Lead Image Dispatch</span>
                        <span className="text-[8px] opacity-40 uppercase">(WEBP/JPG)</span>
                      </div>
                    )}
                  </div>

                  <textarea ref={contentRef} value={content} onChange={e => setContent(e.target.value)} placeholder="Full article body..." className="w-full min-h-[400px] text-lg font-serif leading-relaxed outline-none bg-white text-black" />
                </div>
              </div>

              <div className="sticky bottom-4 z-30">
                <button
                  onClick={() => handlePublish()}
                  disabled={!title || !content || isSubmitting || !dbStatus.isConnected}
                  className={`w-full py-5 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all ${!dbStatus.isConnected ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-accentRed text-white hover:bg-[#8B0000]'}`}
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <RefreshCw className="animate-spin" size={18} /> {uploadProgress}
                    </span>
                  ) : !dbStatus.isConnected ? "DB Disconnected - Publish Blocked" : "Confirm Publication"}
                </button>
              </div>

              <div className="mt-8">
                <SEOPlugin title={title} content={content} focusKeywords={focusKeywords} />
              </div>
            </div>
          )}

          {view === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-black">
                <h3 className="text-xl font-black italic mb-4 uppercase">Newsroom Terminal</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className={`p-4 border-2 border-black text-center ${dbStatus.isConnected ? 'bg-green-50' : 'bg-red-50'}`}>
                    <Database size={20} className={`mx-auto mb-2 ${dbStatus.isConnected ? 'text-green-600' : 'text-red-600'}`} />
                    <span className="text-[9px] font-black uppercase opacity-40 block">Market Sync</span>
                    <span className={`text-sm font-black ${dbStatus.isConnected ? 'text-green-600' : 'text-red-600'}`}>
                      {dbStatus.isConnected ? 'ACTIVE' : 'OFFLINE'}
                    </span>
                  </div>
                  <div className="p-4 border border-black/10 text-center">
                    <ShieldAlert size={20} className="mx-auto mb-2 text-blue-600" />
                    <span className="text-[9px] font-black uppercase opacity-40 block">Identity</span>
                    <span className="text-sm font-black uppercase">{(ADMIN_ID || '0000').slice(-4)}..REPORTER</span>
                  </div>
                  <div className="p-4 border border-black/10 text-center">
                    <RefreshCw size={20} className="mx-auto mb-2 text-yellow-600" />
                    <span className="text-[9px] font-black uppercase opacity-40 block">Latency</span>
                    <span className="text-sm font-black">{dbStatus.isConnected ? '84MS' : 'N/A'}</span>
                  </div>
                  <div className="p-4 border border-black/10 text-center">
                    <Cloud size={20} className="mx-auto mb-2 text-purple-600" />
                    <span className="text-[9px] font-black uppercase opacity-40 block">Storage</span>
                    <span className="text-sm font-black">HYBRID</span>
                  </div>
                </div>

                {!dbStatus.isConnected && (
                  <div className="mt-8 p-4 bg-gray-50 border border-black/10">
                    <h4 className="text-[10px] font-black uppercase mb-2">Technical Guidance:</h4>
                    <p className="text-[11px] leading-relaxed opacity-70 mb-4">
                      The database is currently inaccessible. To enable publishing, you must add these keys to your hosting environment (e.g., Vercel Project Settings → Environment Variables):
                    </p>
                    <ul className="text-[10px] font-mono space-y-2 opacity-60">
                      <li className="flex justify-between"><span>TURSO_DATABASE_URL / TURSO_URL:</span> <span className={dbStatus.urlDetected ? 'text-green-600' : 'text-red-600'}>{dbStatus.urlDetected ? 'PRESENT' : 'MISSING'}</span></li>
                      <li className="flex justify-between"><span>TURSO_AUTH_TOKEN:</span> <span className={dbStatus.tokenDetected ? 'text-green-600' : 'text-red-600'}>{dbStatus.tokenDetected ? 'PRESENT' : 'MISSING'}</span></li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
