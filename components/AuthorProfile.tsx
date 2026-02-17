import React from 'react';
import { Twitter, Facebook } from 'lucide-react';

interface AuthorProfileProps {
  author: {
    name: string;
    role: string;
    bio: string;
    handle: string;
  };
}

export const AuthorProfile: React.FC<AuthorProfileProps> = ({ author }) => {
  const handleShare = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
    const url = encodeURIComponent(window.location.origin);
    const text = encodeURIComponent(`Check out the latest market reports by ${author.name} on Sonawale.`);
    
    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'whatsapp':
        shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
        break;
    }
    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="mt-8 py-4 border-t-2 border-black flex flex-col md:flex-row gap-4 items-start">
      <div className="flex-grow">
        <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
          <h4 className="text-xl font-bold italic telugu-headline">{author.name}</h4>
          <span className="text-[9px] font-black uppercase tracking-widest text-[#A52A2A] utility-font">{author.role}</span>
        </div>
        <p className="text-[13px] font-serif leading-relaxed opacity-80 mb-4 max-w-xl telugu-text">
          {author.bio}
        </p>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <a href={`https://twitter.com/${author.handle.replace('@', '')}`} target="_blank" className="text-[8px] font-black uppercase tracking-widest border border-black px-2 py-1 hover:bg-black hover:text-white transition-all utility-font">
              Follow {author.handle}
            </a>
            <button className="text-[8px] font-black uppercase tracking-widest border-b border-black utility-font">Full Archive</button>
          </div>
          
          <div className="flex items-center gap-3 border-l border-black/10 pl-4 h-5">
            <span className="text-[8px] font-black uppercase tracking-tighter opacity-40 utility-font">Share Profile:</span>
            <div className="flex gap-2">
              <button 
                onClick={() => handleShare('twitter')}
                className="hover:text-[#1DA1F2] transition-colors"
                title="Share on Twitter"
              >
                <Twitter size={14} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => handleShare('facebook')}
                className="hover:text-[#1877F2] transition-colors"
                title="Share on Facebook"
              >
                <Facebook size={14} strokeWidth={2.5} />
              </button>
              <button 
                onClick={() => handleShare('whatsapp')}
                className="hover:text-[#25D366] transition-colors"
                title="Share on WhatsApp"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-whatsapp"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.8 8.5 8.5 0 0 1 5.3 1.4L22 3Z"/><path d="M17 10c-.2-.4-.5-.8-1-1.1s-1.1-.3-1.6-.1c-.4.2-.8.5-1.1 1-.2.3-.4.6-.7.8-.3.3-.6.5-1 .6-.3.1-.7.1-1-.1s-.6-.4-.8-.7c-.2-.3-.5-.5-.8-.7s-.7-.3-1-.2c-.4.1-.7.4-1 .7-.2.3-.3.7-.3 1.1s.1.8.4 1.1c.3.3.6.5 1 .6.3.1.7.1 1-.1.3-.2.6-.5.8-.8.3-.3.6-.5 1-.6.3-.1.7-.1 1 .1s.6.4.8.7c.2.3.5.5.8.7s.7.3 1 .2c.4-.1.7-.4 1-.7.2-.3.3-.7.3-1.1z"/></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};