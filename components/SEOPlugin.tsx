
import React, { useMemo } from 'react';

interface SEOScorecardProps {
  title: string;
  content: string;
  focusKeywords?: string;
  compact?: boolean;
}

export const SEOPlugin: React.FC<SEOScorecardProps> = ({ title, content, focusKeywords = '', compact = false }) => {
  const analysis = useMemo(() => {
    const wordCount = content.split(/\s+/).filter(w => w.length > 0).length;
    const keywordsList = focusKeywords.split(',').map(k => k.trim().toLowerCase()).filter(k => k.length > 0);
    
    const keywordDensityCheck = keywordsList.length > 0 
      ? keywordsList.some(k => content.toLowerCase().includes(k))
      : false;

    const checks = [
      { name: 'Headline Strength', pass: title.length > 40, tip: 'Aim for 40-70 characters for Discover cards.' },
      { name: 'Content Depth', pass: wordCount > 300, tip: 'Minimum 300 words recommended for topical authority.' },
      { name: 'Semantic Links', pass: content.includes('href='), tip: 'Add internal links to boost semantic connectivity.' },
      { name: 'Geo-Targeting', pass: title.toLowerCase().includes('hyderabad'), tip: 'Include "Hyderabad" in the H1 for local ranking.' },
      { name: 'Keyword Presence', pass: keywordDensityCheck, tip: 'Ensure focus keywords appear in the body text.' },
      { name: 'Readability', pass: content.length > 0 && content.split('.').length > wordCount / 15, tip: 'Use shorter sentences for mobile clarity.' }
    ];

    const score = Math.round((checks.filter(c => c.pass).length / checks.length) * 100);
    
    return { score, checks };
  }, [title, content, focusKeywords]);

  const getScoreColor = (s: number) => {
    if (s > 80) return '#166534'; // Green
    if (s > 50) return '#854d0e'; // Yellow
    return '#991b1b'; // Red
  };

  if (compact) {
    return (
      <div className="flex items-center gap-3 px-3 py-2 bg-white border-2 border-black rounded-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        <span className="text-[10px] font-black uppercase tracking-widest">SEO:</span>
        <div className="text-sm font-black" style={{ color: getScoreColor(analysis.score) }}>{analysis.score}%</div>
        <div className="flex gap-1">
          {analysis.checks.slice(0, 3).map((c, i) => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${c.pass ? 'bg-green-600' : 'bg-red-400'}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border-l border-black p-6 w-full lg:w-80 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-[10px] font-black uppercase tracking-widest">SEO Scorecard</h3>
        <div 
          className="text-2xl font-black p-2 border-2 border-black" 
          style={{ color: getScoreColor(analysis.score), borderColor: getScoreColor(analysis.score) }}
        >
          {analysis.score}
        </div>
      </div>

      <div className="space-y-6">
        {analysis.checks.map((check, idx) => (
          <div key={idx} className="group">
            <div className="flex items-center gap-2 mb-1">
              <div className={`w-2 h-2 rounded-full ${check.pass ? 'bg-green-600' : 'bg-red-600 animate-pulse'}`} />
              <span className="text-[11px] font-black uppercase tracking-tight">{check.name}</span>
            </div>
            {!check.pass && (
              <p className="text-[10px] italic opacity-60 leading-tight pl-4 border-l border-black/10">
                {check.tip}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-dotted border-black">
        <h4 className="text-[9px] font-black uppercase mb-2 opacity-40">AEO Metadata Preview</h4>
        <div className="p-2 bg-gray-50 border border-black/5 text-[9px] font-mono break-all line-clamp-2">
          {`<meta name="keywords" content="${focusKeywords}">`}
        </div>
      </div>
    </div>
  );
};
