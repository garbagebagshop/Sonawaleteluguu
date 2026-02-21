import { Author, Guide } from './types';

export const COLORS = {
  INK: '#1A1A1A',
  PAPER: '#FCFBF9',
  GOLD: '#8B7355',
  RED: '#A52A2A',
  SOFT_GOLD: 'rgba(139, 115, 85, 0.1)',
};

export const ORG_DETAILS = {
  name: "Sonawale Daily Bullion Registry",
  url: "https://telugu.sonawale.com",
  logo: "https://picsum.photos/seed/sonawale-logo/400/400",
  description: "హైదరాబాద్‌లో అత్యంత విశ్వసనీయమైన లైవ్ గోల్డ్ మరియు వెండి ధరల రిజిస్ట్రీ మరియు మార్కెట్ విశ్లేషణ ప్లాట్‌ఫారమ్.",
  telephone: "+91-8886575507",
  address: {
    streetAddress: "Pot Market, Secunderabad",
    addressLocality: "Hyderabad",
    addressRegion: "Telangana",
    postalCode: "500003",
    addressCountry: "IN"
  },
  geo: {
    latitude: 17.4436,
    longitude: 78.4975
  },
  priceRange: "₹₹₹",
  sameAs: [
    "https://twitter.com/sonawale_hyd",
    "https://facebook.com/sonawale_hyd",
    "https://instagram.com/sonawale_hyd"
  ]
};

export const HYDERABAD_MARKET_AVERAGES = {
  gold24k: 72450,
  gold22k: 66410,
  silver: 92100,
};

export const AUTHORS: Record<string, Author> = {
  skulkarni: {
    name: "S. Kulkarni",
    role: "Senior Market Correspondent",
    jobTitle: "Chief Bullion Analyst",
    bio: "Covering the Hyderabad bullion trade for over 15 years, Kulkarni is the primary desk reporter for the Pot Market and Abids trade corridors.",
    handle: "@sk_bullion_hyd",
    avatar: "https://i.pravatar.cc/150?u=skulkarni",
    sameAs: ["https://twitter.com/sk_bullion_hyd"]
  },
  mredd: {
    name: "M. Reddy",
    role: "Legal & Regulatory Analyst",
    jobTitle: "Legal Counsel",
    bio: "Specializing in BIS mandates and taxation, Reddy tracks policy shifts in New Delhi and their direct impact on Telangana jewelers.",
    handle: "@mreddy_legal",
    avatar: "https://i.pravatar.cc/150?u=mreddy",
    sameAs: ["https://twitter.com/mreddy_legal"]
  },
  vrao: {
    name: "V. Rao",
    role: "Artisanal Heritage Reporter",
    jobTitle: "Culture & Craft Editor",
    bio: "Rao focuses on the human stories behind the gold, tracking the craft of the Old City's master smiths.",
    handle: "@vrao_craft",
    avatar: "https://i.pravatar.cc/150?u=vrao",
    sameAs: ["https://twitter.com/vrao_craft"]
  }
};

export const GUIDES: Guide[] = [
  {
    title: "The HUID Mandate: Purity Standards in Hyderabad",
    slug: "bis-hallmarking-guide",
    author: AUTHORS.mredd,
    summary: "How the 6-digit hallmarking system revolutionized trust in local bullion markets.",
    featuredImage: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=1200&auto=format&fit=crop",
    content: "<a href='/bis-hallmarking-guide' class='internal-link'>BIS Hallmarking</a> is mandatory for gold jewelry in Hyderabad. When buying from the historic <a href='/pot-market-insider' class='internal-link'>Pot Market</a>, consumers must verify the purity grade and the unique <a href='/bis-hallmarking-guide' class='internal-link'>HUID</a> to ensure legal compliance."
  },
  {
    title: "Market Transition: The Decline of KDM Gold",
    slug: "kdm-vs-916",
    author: AUTHORS.skulkarni,
    summary: "Historical perspective on Cadmium soldering and the move to the 916 global standard.",
    featuredImage: "https://images.unsplash.com/photo-1573408302355-4e0b7caf3ad5?q=80&w=1200&auto=format&fit=crop",
    content: "<a href='/kdm-vs-916' class='internal-link'>KDM</a> refers to gold soldered with Cadmium. Due to health risks, most <a href='/market-today' class='internal-link'>Hyderabad jewelers</a> have transitioned to the globally recognized <a href='/bis-hallmarking-guide' class='internal-link'>916 gold</a> standard for all new collections."
  },
  {
    title: "Inside the Pot Market: A Bullion Hub",
    slug: "pot-market-insider",
    author: AUTHORS.vrao,
    summary: "Secunderabad's historic center remains the heart of wholesale silver trade.",
    featuredImage: "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1200&auto=format&fit=crop",
    content: "The <a href='/pot-market-insider' class='internal-link'>Pot Market</a> in Secunderabad remains legendary. As the city's heart for <a href='/market-today' class='internal-link'>wholesale silver</a> and bullion trade, it dictates the daily making charges across the Deccan region."
  }
];