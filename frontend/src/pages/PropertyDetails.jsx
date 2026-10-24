import { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getPropertyById,
  getPropertyImages,
  getSimilarProperties,
  addFavorite,
  removeFavorite,
  checkFavorite,
  sendInquiry,
  getOwnerContact,
} from "../services/propertyService";
import {
  MapPin,
  BedDouble,
  Bath,
  Maximize2,
  Home,
  User,
  Phone,
  Heart,
  Share2,
  Send,
  Calculator,
  MessageCircle,
  X,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Clock,
  Video,
  Printer,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { getImageUrl } from "../utils/imageUrl";
import { useAuth } from "../context/AuthContext";
import { PropertyDetailsSkeleton } from "../components/Skeleton";
import PropertyCard from "../components/PropertyCard";

const API_URL = import.meta.env.VITE_API_URL;

function PropertyDetails() {
  const { id } = useParams();
  const { isAuthenticated, user } = useAuth();

  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  // Gallery & Media Tabs
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [activeMediaTab, setActiveMediaTab] = useState("photos"); // 'photos' | 'video'
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [similarProperties, setSimilarProperties] = useState([]);

  // Inquiry form
  const [inquiryText, setInquiryText] = useState("");
  const [sendingInquiry, setSendingInquiry] = useState(false);
  const [ownerContact, setOwnerContact] = useState(null);
  const [contactLoading, setContactLoading] = useState(false);

  // Tour Booking state
  const [tourType, setTourType] = useState("in-person"); // 'in-person' | 'video-call'
  const [tourDate, setTourDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split("T")[0];
  });
  const [tourTimeSlot, setTourTimeSlot] = useState("11:00 AM - 12:00 PM");
  const [tourBooked, setTourBooked] = useState(false);

  // Mortgage Calculator state
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [loanTenureYears, setLoanTenureYears] = useState(20);
  const [interestRate, setInterestRate] = useState(10.5);

  useEffect(() => {
    let active = true;

    async function loadPropertyData() {
      try {
        setLoading(true);
        setNotFound(false);

        const data = await getPropertyById(id);
        if (!active) return;
        setProperty(data);
        setSelectedImage(data.image);

        // Fetch gallery images
        try {
          const gallery = await getPropertyImages(id);
          if (active) {
            setImages(gallery || []);
          }
        } catch {
          // non-critical
        }

        // Fetch similar properties
        try {
          const similar = await getSimilarProperties(id);
          if (active) setSimilarProperties(similar || []);
        } catch {
          // non-critical
        }

        // Check favorite if user is authenticated
        if (isAuthenticated) {
          try {
            const fav = await checkFavorite(id);
            if (active) setIsFavorite(fav);
          } catch {
            // guest view
          }
        }
      } catch (err) {
        console.error(err);
        if (active) setNotFound(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPropertyData();
    return () => {
      active = false;
    };
  }, [id, isAuthenticated]);

  const allGalleryImages = useMemo(() => {
    if (!property) return [];
    const list = [];
    if (property.image) {
      list.push(property.image);
    }
    images.forEach((img) => {
      if (img.image && !list.includes(img.image)) {
        list.push(img.image);
      }
    });
    return list;
  }, [property, images]);

  // Mortgage calculation (EMI)
  const mortgageCalculation = useMemo(() => {
    if (!property?.price) return { emi: 0, loanAmount: 0, downPayment: 0 };
    const price = Number(property.price);
    const downPayment = (price * downPaymentPercent) / 100;
    const loanAmount = price - downPayment;

    const monthlyInterestRate = interestRate / 12 / 100;
    const numberOfMonths = loanTenureYears * 12;

    if (monthlyInterestRate === 0) {
      return {
        emi: Math.round(loanAmount / numberOfMonths),
        loanAmount,
        downPayment,
      };
    }

    const emi =
      (loanAmount *
        monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, numberOfMonths)) /
      (Math.pow(1 + monthlyInterestRate, numberOfMonths) - 1);

    return {
      emi: Math.round(emi),
      loanAmount: Math.round(loanAmount),
      downPayment: Math.round(downPayment),
    };
  }, [property, downPaymentPercent, loanTenureYears, interestRate]);

  async function handleToggleFavorite() {
    if (!isAuthenticated) {
      toast.info("Please login first to save this property.");
      return;
    }

    setFavLoading(true);
    try {
      if (isFavorite) {
        await removeFavorite(property.id);
        setIsFavorite(false);
        toast.info("Removed from favorites");
      } else {
        await addFavorite(property.id);
        setIsFavorite(true);
        toast.success("Added to favorites ❤️");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update favorite status");
    } finally {
      setFavLoading(false);
    }
  }

  async function handleSendInquiry(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please log in to send an inquiry to the owner.");
      return;
    }

    if (inquiryText.trim().length < 10) {
      toast.error("Message must be at least 10 characters.");
      return;
    }

    setSendingInquiry(true);
    try {
      const data = await sendInquiry(property.id, inquiryText.trim());
      toast.success(data.message || "Inquiry sent successfully!");
      setInquiryText("");
    } catch (err) {
      const detail = err.response?.data?.detail;
      toast.error(detail || "Could not send inquiry. Please try again.");
    } finally {
      setSendingInquiry(false);
    }
  }

  async function handleBookTour(e) {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.info("Please log in to schedule a property tour.");
      return;
    }

    setTourBooked(true);
    toast.success(`Visit booked for ${tourDate} (${tourTimeSlot})! Landlord notified.`);
  }

  async function handleRevealContact() {
    if (!isAuthenticated) {
      toast.info("Please login to view verified owner contact numbers.");
      return;
    }

    setContactLoading(true);
    try {
      const data = await getOwnerContact(property.id);
      setOwnerContact(data);
      toast.success("Owner contact details retrieved!");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Could not load owner contact.");
    } finally {
      setContactLoading(false);
    }
  }

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Check out this property in ${property.city} on NestHub:`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Listing link copied to clipboard!");
    }
  }

  function handlePrintBrochure() {
    window.print();
  }

  if (loading) {
    return <PropertyDetailsSkeleton />;
  }

  if (notFound || !property) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
        <h2 className="text-3xl font-black text-slate-800 dark:text-white">Property Not Found</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 max-w-md">
          This listing may have been unlisted, sold, or the link is invalid.
        </p>
        <Link
          to="/properties"
          className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          Browse Other Properties
        </Link>
      </div>
    );
  }

  const whatsappMessage = encodeURIComponent(
    `Hello! I am interested in your listing "${property.title}" in ${property.city} on NestHub: ${window.location.href}`
  );

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 pb-24 transition-colors">
      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <X size={24} />
          </button>

          <button
            onClick={() =>
              setLightboxIndex(
                (prev) => (prev - 1 + allGalleryImages.length) % allGalleryImages.length
              )
            }
            className="absolute left-6 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ChevronLeft size={28} />
          </button>

          <img
            src={getImageUrl(API_URL, allGalleryImages[lightboxIndex])}
            alt="Property Fullscreen"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl shadow-2xl"
          />

          <button
            onClick={() =>
              setLightboxIndex((prev) => (prev + 1) % allGalleryImages.length)
            }
            className="absolute right-6 p-3 text-white/80 hover:text-white rounded-full bg-white/10 hover:bg-white/20 transition"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Navigation & Action Bar */}
        <div className="flex items-center justify-between py-4">
          <Link
            to="/properties"
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white flex items-center gap-1 transition"
          >
            <ChevronLeft size={16} />
            Back to Explore
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintBrochure}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs"
              title="Print or Save PDF Flyer"
            >
              <Printer size={15} />
              <span>Brochure</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs"
            >
              <Share2 size={15} />
              Share
            </button>

            <button
              onClick={handleToggleFavorite}
              disabled={favLoading}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition shadow-xs ${
                isFavorite
                  ? "bg-rose-500 text-white"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-rose-500 hover:bg-slate-50"
              }`}
            >
              <Heart size={15} className={isFavorite ? "fill-white" : ""} />
              {isFavorite ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        {/* Media Showcase: Photos vs Virtual Tour Tabs */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 p-3 transition-colors">
          {/* Tab Headers */}
          <div className="flex items-center gap-2 px-3 pt-2 pb-3">
            <button
              onClick={() => setActiveMediaTab("photos")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeMediaTab === "photos"
                  ? "bg-slate-900 dark:bg-white text-white dark:text-slate-950 shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Photo Gallery ({allGalleryImages.length})
            </button>
            <button
              onClick={() => setActiveMediaTab("video")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                activeMediaTab === "video"
                  ? "bg-blue-600 text-white shadow-xs"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Video size={14} />
              <span>Virtual Tour (360° Walkthrough)</span>
            </button>
          </div>

          {activeMediaTab === "photos" ? (
            <>
              {/* Main Selected Image */}
              <div
                onClick={() => {
                  setLightboxIndex(allGalleryImages.indexOf(selectedImage));
                  setLightboxOpen(true);
                }}
                className="relative h-[360px] sm:h-[480px] md:h-[540px] rounded-2xl overflow-hidden cursor-zoom-in bg-slate-900 group"
              >
                <img
                  src={getImageUrl(API_URL, selectedImage)}
                  alt={property.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider bg-black/60 text-white backdrop-blur-md border border-white/20">
                    {property.status || "Available"}
                  </span>
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-white text-xs font-semibold">
                  Click to Enlarge ({allGalleryImages.length} Photos)
                </div>
              </div>

              {/* Thumbnails Row */}
              {allGalleryImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto p-3 mt-1 scrollbar-none">
                  {allGalleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`w-24 h-18 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${
                        selectedImage === img
                          ? "border-blue-600 shadow-md scale-98"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={getImageUrl(API_URL, img)}
                        alt={`Thumbnail ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Virtual Video Walkthrough Player */
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 flex items-center justify-center">
              <iframe
                className="w-full h-full"
                src="https://www.youtube-nocookie.com/embed/9No-FiEInLA?autoplay=0&rel=0"
                title="Virtual Real Estate Walkthrough"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="grid lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column: Property Info, Specs, Tour Booking, Mortgage */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-lg">
                    {property.property_type}
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-2">
                    {property.title}
                  </h1>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 flex items-center gap-1.5">
                    <MapPin size={17} className="text-blue-500" />
                    <span>{property.city}, Nepal</span>
                  </p>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-xs uppercase font-semibold text-slate-400">
                    Listing Price
                  </p>
                  <p className="text-3xl font-black text-blue-600 dark:text-blue-400">
                    Rs. {Number(property.price).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Key Specs Grid */}
              <div className="grid grid-cols-3 gap-4 mt-8 p-5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 text-center">
                <div>
                  <BedDouble size={22} className="mx-auto text-blue-600 dark:text-blue-400 mb-1" />
                  <p className="text-xs text-slate-400">Bedrooms</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">
                    {property.bedrooms} Beds
                  </p>
                </div>
                <div className="border-x border-slate-200 dark:border-slate-700">
                  <Bath size={22} className="mx-auto text-blue-600 dark:text-blue-400 mb-1" />
                  <p className="text-xs text-slate-400">Bathrooms</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">
                    {property.bathrooms} Baths
                  </p>
                </div>
                <div>
                  <Maximize2 size={22} className="mx-auto text-blue-600 dark:text-blue-400 mb-1" />
                  <p className="text-xs text-slate-400">Floor Area</p>
                  <p className="text-base font-bold text-slate-800 dark:text-white">
                    {property.area} sq.ft
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                  About This Property
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Schedule a Visit Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center">
                  <Calendar size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Schedule a Private Tour
                  </h2>
                  <p className="text-xs text-slate-400">
                    Book an in-person viewing or live video walkthrough with the owner.
                  </p>
                </div>
              </div>

              {tourBooked ? (
                <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <CheckCircle2 size={36} className="text-emerald-600 mx-auto mb-2" />
                  <h3 className="text-base font-bold text-emerald-900 dark:text-emerald-200">
                    Viewing Scheduled!
                  </h3>
                  <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                    Your appointment for {tourDate} ({tourTimeSlot}) has been requested. The landlord will confirm via email and SMS.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleBookTour} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setTourType("in-person")}
                      className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                        tourType === "in-person"
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Home size={15} />
                      In-Person Walkthrough
                    </button>
                    <button
                      type="button"
                      onClick={() => setTourType("video-call")}
                      className={`p-3 rounded-2xl border text-xs font-bold transition flex items-center justify-center gap-2 ${
                        tourType === "video-call"
                          ? "border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-600"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      <Video size={15} />
                      Live Video Call Tour
                    </button>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Select Preferred Date
                      </label>
                      <input
                        type="date"
                        required
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5">
                        Select Time Slot
                      </label>
                      <select
                        value={tourTimeSlot}
                        onChange={(e) => setTourTimeSlot(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="10:00 AM - 11:00 AM">Morning (10:00 AM - 11:00 AM)</option>
                        <option value="01:00 PM - 02:00 PM">Afternoon (1:00 PM - 2:00 PM)</option>
                        <option value="04:30 PM - 05:30 PM">Evening (4:30 PM - 5:30 PM)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider transition shadow-sm cursor-pointer"
                  >
                    Request Viewing Appointment
                  </button>
                </form>
              )}
            </div>

            {/* Mortgage / EMI Calculator Widget */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 shadow-xs transition-colors">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 flex items-center justify-center">
                  <Calculator size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Mortgage & EMI Estimator
                  </h2>
                  <p className="text-xs text-slate-400">
                    Estimate your monthly payments for this property.
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Down Payment: {downPaymentPercent}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="60"
                    step="5"
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    Rs. {mortgageCalculation.downPayment.toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Tenure: {loanTenureYears} Years
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">
                    {loanTenureYears * 12} Months
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2">
                    Interest Rate: {interestRate}%
                  </label>
                  <input
                    type="range"
                    min="6"
                    max="16"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <p className="text-xs text-slate-400 mt-1">Typical Nepal Bank APR</p>
                </div>
              </div>

              <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-800/60 border border-blue-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Estimated Monthly Payment (EMI)
                  </span>
                  <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    Rs. {mortgageCalculation.emi.toLocaleString()}{" "}
                    <span className="text-xs font-normal text-slate-500">/ month</span>
                  </p>
                </div>
                <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                  <p>Loan: Rs. {mortgageCalculation.loanAmount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & Owner Box */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-100 dark:border-slate-800 shadow-xs space-y-6 transition-colors">
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center font-bold text-base">
                  {property.owner_name ? property.owner_name[0] : <User size={22} />}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white leading-tight">
                    {property.owner_name || "Verified Landlord"}
                  </h3>
                  <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-1">
                    <ShieldCheck size={14} />
                    <span>Verified NestHub Partner</span>
                  </div>
                </div>
              </div>

              {/* Reveal Phone Number Button */}
              {ownerContact ? (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center">
                  <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-300">
                    Owner Direct Phone:
                  </p>
                  <p className="text-xl font-bold text-emerald-900 dark:text-emerald-100 mt-1">
                    📞 {ownerContact.owner_phone || "Not provided"}
                  </p>
                </div>
              ) : (
                <button
                  onClick={handleRevealContact}
                  disabled={contactLoading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition shadow-xs"
                >
                  <Phone size={16} />
                  <span>
                    {contactLoading ? "Retrieving..." : "Show Owner Phone"}
                  </span>
                </button>
              )}

              {/* Instant WhatsApp Button */}
              <a
                href={`https://wa.me/?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition shadow-sm"
              >
                <MessageCircle size={18} />
                <span>Chat via WhatsApp</span>
              </a>

              {/* Inquiry Email Form */}
              <form onSubmit={handleSendInquiry} className="space-y-4 pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Send Direct Inquiry
                </label>
                <textarea
                  rows="4"
                  placeholder="Hello, I am interested in this listing and would like to schedule a tour..."
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  className="w-full p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100 transition resize-none"
                />
                <button
                  type="submit"
                  disabled={sendingInquiry}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-slate-900 dark:bg-white hover:bg-blue-600 dark:hover:bg-blue-400 text-white dark:text-slate-950 font-semibold text-sm transition shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  <Send size={15} />
                  <span>{sendingInquiry ? "Sending Message..." : "Send Inquiry"}</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
              Similar Properties Nearby
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {similarProperties.map((simProp) => (
                <PropertyCard key={simProp.id} property={simProp} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PropertyDetails;
