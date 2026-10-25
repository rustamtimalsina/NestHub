import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  ShieldCheck,
  Star,
  Phone,
  Mail,
  MapPin,
  Building,
  CheckCircle2,
  Search,
  MessageCircle,
  Award,
} from "lucide-react";

const AGENTS_LIST = [
  {
    id: 1,
    name: "Rustam Timalsina",
    title: "Principal Luxury Consultant",
    agency: "NestHub Premier Advisors",
    rating: 4.95,
    reviewsCount: 38,
    activeListings: 14,
    dealsClosed: 85,
    phone: "+977 9800000000",
    email: "rustamtimalsina179@gmail.com",
    city: "Kathmandu & Lalitpur",
    specialty: "Luxury Penthouses & Villas",
    languages: "Nepali, English",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    bio: "Specializing in high-value private residential estates in Budhanilkantha, Jhamsikhel, and Sanepa with 7+ years of certified experience.",
  },
  {
    id: 2,
    name: "Aayush Shrestha",
    title: "Senior Real Estate Associate",
    agency: "Himalayan Realty Partners",
    rating: 4.9,
    reviewsCount: 26,
    activeListings: 9,
    dealsClosed: 52,
    phone: "+977 9841000001",
    email: "aayush.shrestha@example.com",
    city: "Lalitpur",
    specialty: "Heritage & Modern Apartments",
    languages: "Nepali, English, Newari",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    bio: "Helping families and diaspora investors find turnkey residential properties with full legal verification and banking guidance.",
  },
  {
    id: 3,
    name: "Prerana Karki",
    title: "Commercial & Land Specialist",
    agency: "Apex Capital Properties",
    rating: 4.88,
    reviewsCount: 31,
    activeListings: 11,
    dealsClosed: 64,
    phone: "+977 9812000002",
    email: "prerana.karki@example.com",
    city: "Pokhara & Bhaktapur",
    specialty: "Scenic Villas & Commercial Plots",
    languages: "Nepali, English",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    bio: "Focused on scenic Lakeside Pokhara developments and prime road-facing commercial plots with seamless ownership transfers.",
  },
  {
    id: 4,
    name: "Rabin Thapa",
    title: "Investment Portfolio Director",
    agency: "Valley Prime Real Estate",
    rating: 4.92,
    reviewsCount: 44,
    activeListings: 18,
    dealsClosed: 110,
    phone: "+977 9851000003",
    email: "rabin.thapa@example.com",
    city: "Kathmandu & Terai Hubs",
    specialty: "High-yield Rental Properties",
    languages: "Nepali, English, Hindi",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    bio: "Advising institutional buyers and high-net-worth clients on property acquisition, valuation, and capital appreciation strategies.",
  },
];

export default function Agents() {
  const [search, setSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");

  const filteredAgents = AGENTS_LIST.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(search.toLowerCase()) ||
      agent.specialty.toLowerCase().includes(search.toLowerCase()) ||
      agent.city.toLowerCase().includes(search.toLowerCase());

    const matchesCity =
      selectedCity === "all" || agent.city.toLowerCase().includes(selectedCity.toLowerCase());

    return matchesSearch && matchesCity;
  });

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      {/* Hero Header */}
      <div className="bg-white border-b border-slate-100 py-14 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-600 mb-4">
            <Award size={14} />
            Verified Advisors
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Meet Nepal's Top Luxury Real Estate Agents
          </h1>
          <p className="text-slate-500 text-sm sm:text-base max-w-2xl mx-auto mt-3">
            Partner with licensed, verified advisors offering full legal title verification, private viewings, and transparent negotiations.
          </p>

          {/* Search & Location Bar */}
          <div className="max-w-2xl mx-auto mt-8 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by agent name, specialty, or neighborhood..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="all">All Regions</option>
              <option value="kathmandu">Kathmandu</option>
              <option value="lalitpur">Lalitpur</option>
              <option value="pokhara">Pokhara</option>
              <option value="bhaktapur">Bhaktapur</option>
            </select>
          </div>
        </div>
      </div>

      {/* Agents Directory Grid */}
      <div className="max-w-7xl mx-auto px-6 mt-12">
        <div className="grid md:grid-cols-2 gap-6">
          {filteredAgents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-100 dark:border-slate-800 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover shrink-0 shadow-sm border border-slate-100 dark:border-slate-800"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">
                        {agent.name}
                      </h3>
                      <ShieldCheck size={18} className="text-emerald-500 shrink-0" title="Verified NestHub Agent" />
                    </div>
                    <p className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {agent.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {agent.agency}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-xs">
                      <span className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200">
                        <Star size={14} className="fill-amber-400 text-amber-400" />
                        {agent.rating}
                      </span>
                      <span className="text-slate-400">({agent.reviewsCount} reviews)</span>
                      <span className="text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full text-[10px]">
                        {agent.dealsClosed}+ Closed
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2 mb-4">
                  {agent.bio}
                </p>

                {/* Agent Highlights */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] font-medium mb-6">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Region</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{agent.city}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Specialty</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold truncate block">{agent.specialty}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Listings</span>
                    <span className="text-blue-600 font-bold">{agent.activeListings} Active</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Languages</span>
                    <span className="text-slate-700 dark:text-slate-200 font-bold">{agent.languages}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={`https://wa.me/?text=Hello ${agent.name}, I am contacting you through NestHub regarding property acquisition.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                >
                  <MessageCircle size={15} />
                  <span>WhatsApp</span>
                </a>

                <a
                  href={`mailto:${agent.email}?subject=Inquiry from NestHub Client`}
                  className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition shadow-xs"
                >
                  <Mail size={15} />
                  <span>Email Agent</span>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Join as an Agent Banner */}
        <div className="mt-16 rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200">
              For Licensed Real Estate Professionals
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-1">
              List Your Luxury Inventory on NestHub
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm mt-2 leading-relaxed">
              Join Nepal’s premier digital property network. Get direct verified client inquiries, private tour requests, and marketing exposure to local and diaspora buyers.
            </p>
          </div>

          <Link
            to="/register"
            className="px-8 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-blue-50 font-black text-xs uppercase tracking-wider transition shrink-0 shadow-md"
          >
            Join as Partner Agent
          </Link>
        </div>
      </div>
    </div>
  );
}
