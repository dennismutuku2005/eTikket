const FALLBACK_EVENTS = [
  {
    slug: "nairobi-glow-festival",
    title: "Nairobi Glow Festival",
    category: "Music",
    date: "Friday, 8 August",
    shortDate: "Fri, 8 Aug",
    time: "8:00 PM",
    location: "KICC, Nairobi",
    host: "Glow Kenya",
    price: "From KSh 1,200",
    going: "2.4K going",
    status: "Selling fast",
    remainingTickets: 752,
    image: "/sideimage.png",
    mapCoordinates: { lat: -1.28333, lng: 36.81667 },
    mapLabel: "KICC Main Entrance",
    views: 42340,
    orders: 1280,
    ticketsSold: 530,
    isPast: false,
    isEditable: true,
    description:
      "A full-city night experience with headline DJs, food vendors, light shows, and fast QR entry at the gate.",
    longDescription:
      "Nairobi Glow Festival brings music, food, lights, and friends into one high-energy night at KICC. Tickets are class based, so guests can pick Advance, Normal, or VIP access and pay quickly with M-Pesa.",
    tickets: [
      { name: "Advance", description: "Early buyer ticket", price: 1200, available: 220 },
      { name: "Normal", description: "Standard entry", price: 1800, available: 460 },
      { name: "VIP", description: "Fast lane and lounge access", price: 3500, available: 72 },
    ],
    descriptionLong: "Nairobi Glow Festival brings music, food, lights, and friends into one high-energy night at KICC. Tickets are class based, so guests can pick Advance, Normal, or VIP access and pay quickly with M-Pesa.",
  },
  {
    slug: "coast-holiday-market",
    title: "Coast Holiday Market",
    category: "Holiday",
    date: "Saturday, 16 August",
    shortDate: "Sat, 16 Aug",
    time: "11:00 AM",
    location: "Nyali Beach",
    host: "Coast Creatives",
    price: "Free",
    going: "980 going",
    status: "Holiday",
    remainingTickets: 600,
    image: "/sideimage.png",
    mapLabel: "Nyali Beach Boardwalk",
    views: 18900,
    orders: 650,
    ticketsSold: 380,
    isPast: false,
    isEditable: true,
    description:
      "A relaxed beach market with food, fashion, family games, acoustic music, and holiday ticket bundles.",
    longDescription:
      "Spend the day by the coast with curated vendors, family spaces, music, and easy guest checkout. This event is built for groups, families, and holiday planners who want a simple day out.",
    tickets: [
      { name: "Free", description: "Market entry", price: 0, available: 600 },
      { name: "Family", description: "Entry for four people", price: 1600, available: 120 },
      { name: "VIP", description: "Reserved lounge access", price: 2500, available: 40 },
    ],
  },
  {
    slug: "campus-night-live",
    title: "Campus Night Live",
    category: "Nightlife",
    date: "Thursday, 21 August",
    shortDate: "Thu, 21 Aug",
    time: "9:00 PM",
    location: "Sarit Expo Centre",
    host: "Campus Nights KE",
    price: "From KSh 800",
    going: "1.1K going",
    status: "Live",
    remainingTickets: 880,
    image: "/sideimage.png",
    mapLabel: "Sarit Expo Centre Main Hall",
    views: 31500,
    orders: 1020,
    ticketsSold: 680,
    isPast: false,
    isEditable: true,
    description:
      "A clean, class-based ticket experience for campus crowds with advance, normal, and VIP entry.",
    longDescription:
      "Campus Night Live keeps the buying flow quick and mobile friendly. Choose the ticket class that fits your group, pay with M-Pesa, and bring your QR ticket to the door.",
    tickets: [
      { name: "Advance", description: "Early student entry", price: 800, available: 300 },
      { name: "Normal", description: "Standard entry", price: 1200, available: 500 },
      { name: "VIP", description: "VIP deck access", price: 2200, available: 80 },
    ],
  },
  {
    slug: "family-food-fair",
    title: "Family Food Fair",
    category: "Family",
    date: "Sunday, 24 August",
    shortDate: "Sun, 24 Aug",
    time: "12:00 PM",
    location: "Two Rivers Mall",
    host: "Foodies Kenya",
    price: "From KSh 500",
    going: "640 going",
    status: "New",
    remainingTickets: 540,
    image: "/sideimage.png",
    mapLabel: "Two Rivers Mall Plaza",
    views: 22300,
    orders: 740,
    ticketsSold: 320,
    isPast: false,
    isEditable: true,
    description:
      "Family food stalls, kids activities, live music, and simple QR entry for all ticket holders.",
    longDescription:
      "A daytime event for food lovers and families. The event includes tasting zones, kids activities, open seating, and smooth mobile ticketing for guests.",
    tickets: [
      { name: "Normal", description: "General entry", price: 500, available: 420 },
      { name: "Family", description: "Two adults and two kids", price: 1700, available: 90 },
      { name: "VIP", description: "Reserved table package", price: 3000, available: 30 },
    ],
  },
  {
    slug: "afrobeats-rooftop",
    title: "Afrobeats Rooftop Session",
    category: "Concert",
    date: "Friday, 29 August",
    shortDate: "Fri, 29 Aug",
    time: "7:30 PM",
    location: "Westlands",
    host: "Rooftop Live",
    price: "Sold out",
    going: "Sold out",
    status: "Sold out",
    remainingTickets: 0,
    image: "/sideimage.png",
    mapLabel: "Westlands Rooftop",
    views: 28100,
    orders: 980,
    ticketsSold: 1000,
    isPast: true,
    isEditable: false,
    description:
      "A premium rooftop concert experience with a sold-out ticket allocation.",
    longDescription:
      "This rooftop concert is currently sold out. You can still browse other available eTikket events with Advance, Normal, and VIP ticket options.",
    tickets: [],
  },
  {
    slug: "founders-mixer",
    title: "Founders Mixer Nairobi",
    category: "Business",
    date: "Wednesday, 3 September",
    shortDate: "Wed, 3 Sep",
    time: "6:00 PM",
    location: "Nairobi Garage",
    host: "Builders Club",
    price: "From KSh 1,200",
    going: "420 going",
    status: "VIP available",
    remainingTickets: 204,
    image: "/sideimage.png",
    mapLabel: "Nairobi Garage Hub",
    views: 15240,
    orders: 410,
    ticketsSold: 196,
    isPast: false,
    isEditable: true,
    description:
      "Networking, panels, and VIP founder tables for the Nairobi startup scene.",
    longDescription:
      "Meet operators, founders, funders, and product people in a structured evening built around practical conversations and new connections.",
    tickets: [
      { name: "Normal", description: "General access", price: 1200, available: 180 },
      { name: "VIP", description: "Founder table and priority networking", price: 4500, available: 24 },
    ],
  },
];

export function getPublicEvents() {
  if (typeof window !== 'undefined' && Array.isArray(window.__ETICKET_PUBLIC_EVENTS__)) {
    return window.__ETICKET_PUBLIC_EVENTS__;
  }
  return FALLBACK_EVENTS;
}

export function getPublicEvent(slug) {
  const events = getPublicEvents();
  return events.find((event) => event.slug === slug) ?? events[0];
}

export default FALLBACK_EVENTS;
