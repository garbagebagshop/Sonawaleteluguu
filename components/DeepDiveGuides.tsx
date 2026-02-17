
import React from 'react';
import { Guide } from '../types';

interface DeepDiveGuidesProps {
  guides: Guide[];
  onRead: (slug: string) => void;
}

export const DeepDiveGuides: React.FC<DeepDiveGuidesProps> = ({ guides, onRead }) => {
  return (
    <div className="divide-y divide-gray-100">
      {guides.map((guide) => (
        <article 
          key={guide.slug} 
          onClick={() => onRead(guide.slug)}
          className="py-3.5 px-3.5 flex items-start gap-3 md:gap-4 cursor-pointer group hover:bg-gray-50/80 transition-all active:bg-gray-100"
          itemScope 
          itemType="https://schema.org/NewsArticle"
        >
          {/* Text content on the Left */}
          <div className="flex-grow">
            {guide.category && (
              <span className="text-[9px] font-black uppercase text-[#B90000] mb-1 block opacity-70 utility-font tracking-widest">
                {guide.category}
              </span>
            )}
            <h3 className="text-[16px] xs:text-[18px] md:text-xl font-bold leading-[1.25] telugu-headline text-black group-hover:text-[#B90000] transition-colors line-clamp-3" itemProp="headline">
              {guide.title}
            </h3>
            
            <div className="mt-2.5 flex items-center gap-3 text-[9px] font-bold text-gray-400 utility-font uppercase">
               <span className="flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-[#B90000] inline-block"></span>
                 HYD NEWS
               </span>
               <span className="opacity-30">|</span>
               <span>{new Date(guide.date || Date.now()).toLocaleDateString('te-IN', { day: '2-digit', month: 'short' })}</span>
            </div>
          </div>

          {/* Thumbnail on the Right - High quality crop */}
          <div className="shrink-0 w-24 h-24 md:w-32 md:h-32 rounded bg-gray-100 overflow-hidden border border-black/5 shadow-sm">
            <img 
              src={guide.featuredImage || `https://picsum.photos/seed/${guide.slug}/300/300`} 
              alt={guide.imageAlt || guide.title}
              itemProp="image"
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              loading="lazy"
            />
          </div>
        </article>
      ))}
    </div>
  );
};
