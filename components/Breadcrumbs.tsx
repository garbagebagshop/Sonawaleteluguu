
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbProps {
  items: { label: string; href?: string; active?: boolean }[];
}

export const Breadcrumbs: React.FC<BreadcrumbProps> = ({ items }) => {
  const handleHomeClick = () => {
    // Standardize return to root
    window.location.hash = '';
  };

  return (
    <nav className="flex items-center space-x-2 text-[10px] font-black uppercase tracking-widest utility-font mb-6 overflow-x-auto no-scrollbar whitespace-nowrap" aria-label="Breadcrumb">
      <div className="flex items-center group cursor-pointer" onClick={handleHomeClick}>
        <Home size={10} className="mr-1 group-hover:text-[#A52A2A]" />
        <span className="group-hover:text-[#A52A2A]">హోమ్</span>
      </div>
      
      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight size={10} className="opacity-30" />
          {item.active ? (
            <span className="text-[#A52A2A]" aria-current="page">{item.label}</span>
          ) : (
            <button 
              onClick={() => item.href && (window.location.hash = item.href)}
              className="hover:text-[#A52A2A] transition-colors"
            >
              {item.label}
            </button>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
