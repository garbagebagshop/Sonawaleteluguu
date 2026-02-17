
import React from 'react';

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="pb-6">
    <h3 className="text-sm font-black uppercase mb-2 border-b border-black/10 pb-1">{question}</h3>
    <p className="text-xs leading-relaxed opacity-80">{answer}</p>
  </div>
);

export const FAQSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-xs font-black uppercase tracking-[0.2em] bg-black text-white px-2 py-1 inline-block mb-4">మార్కెట్ FAQ</h2>
        <p className="text-[10px] font-bold italic opacity-60">పాట్ మార్కెట్ డెస్క్ నుండి ధృవీకరించబడిన సమాచారం.</p>
      </div>
      
      <div className="space-y-4">
        <FAQItem 
          question="ప్రస్తుత మార్కెట్ స్థితి?" 
          answer="ప్రస్తుతం మార్కెట్ స్థిరంగా ఉంది. అబిడ్స్ ప్రాంతంలోని కొనుగోలుదారులు పండుగ సీజన్ తర్వాత 22 క్యారెట్ల ఆభరణాల వైపు మొగ్గు చూపుతున్నారు."
        />
        <FAQItem 
          question="పరిశుద్ధత తనిఖీ ఎలా?" 
          answer="హైదరాబాద్‌లోని ప్రతి వ్యాపారి తప్పనిసరిగా 6 అంకెల HUIDని అందించాలి. కొనుగోలుదారులు BIS కేర్ యాప్ ద్వారా వివరాలను సరిచూసుకోవాలి."
        />
        <FAQItem 
          question="వెండి వ్యాపార కేంద్రం?" 
          answer="హై-వాల్యూమ్ వెండి వ్యాపారానికి సికింద్రాబాద్‌లోని పాట్ మార్కెట్ ఇప్పటికీ ప్రధాన కేంద్రంగా కొనసాగుతోంది."
        />
      </div>
    </div>
  );
};
