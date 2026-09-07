"use client";

import { useEffect, useState, useMemo } from "react";
import { GoogleEvent, EventStatus } from "../api/google-events/route";

const CATEGORIES = [
  "All Categories",
  "GDG Events",
  "Google Cloud events",
  "Google Developer events",
  "Google Arcade Events",
  "Google I/O related events",
  "Google hackathons / workshops",
  "Google webinars / meetups",
  "Hack2Skill Events",
  "Other publicly listed Google community events"
];

export default function GoogleEventsPage() {
  const [apiEvents, setApiEvents] = useState<GoogleEvent[]>([]);
  const [manualEvents, setManualEvents] = useState<GoogleEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Filters
  const [activeCountry, setActiveCountry] = useState("India"); 
  const [activeCategory, setActiveCategory] = useState("All Categories");
  const [activeStatus, setActiveStatus] = useState("All");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    mode: "Online",
    cost: "Free",
    startDate: "",
    endDate: "",
    url: "",
    category: "Other publicly listed Google community events"
  });

  // Load API Events & Local Manual Events
  useEffect(() => {
    async function loadEvents() {
      try {
        const response = await fetch("/api/google-events");
        if (!response.ok) throw new Error("Failed to fetch events");
        const data = await response.json();
        if (data.success) setApiEvents(data.events || []);
      } catch (err) {
        setError("Unable to load events.");
      } finally {
        setLoading(false);
      }
    }
    loadEvents();

    const savedManual = localStorage.getItem("manualGoogleEvents");
    if (savedManual) {
      setManualEvents(JSON.parse(savedManual));
    }
  }, []);

  // Dynamic Status Calculator with Start & End Date
  const getDynamicStatus = (startDate: string, endDate: string): EventStatus => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).setHours(23, 59, 59, 999);
    const now = Date.now();

    if (now < start) return "Upcoming";
    if (now >= start && now <= end) return "Ongoing";
    return "Past";
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format Date for UI 
    const startStr = new Date(formData.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const endStr = new Date(formData.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const displayDate = formData.startDate === formData.endDate ? startStr : `${startStr} - ${endStr}`;

    const newEvent: GoogleEvent = {
      id: `manual-${Date.now()}`,
      title: formData.title,
      description: `${formData.category} (${formData.cost}) - ${formData.mode}`,
      date: displayDate,
      location: formData.mode === "Online" ? "Online / Virtual" : formData.location,
      country: formData.mode === "Online" ? "Online" : "India", 
      type: formData.category,
      url: formData.url,
      source: "Manual Entry",
      status: getDynamicStatus(formData.startDate, formData.endDate)
    };

    (newEvent as any)._rawStart = formData.startDate;
    (newEvent as any)._rawEnd = formData.endDate;

    // By placing newEvent first in the array, it stays at the top of the list
    const updatedManualEvents = [newEvent, ...manualEvents];
    setManualEvents(updatedManualEvents);
    localStorage.setItem("manualGoogleEvents", JSON.stringify(updatedManualEvents));
    
    setShowModal(false);
    setFormData({ title: "", location: "", mode: "Online", cost: "Free", startDate: "", endDate: "", url: "", category: "Other publicly listed Google community events" });
  };

  const allEvents = useMemo(() => {
    const refreshedManualEvents = manualEvents.map(ev => {
      if ((ev as any)._rawStart && (ev as any)._rawEnd) {
        return { ...ev, status: getDynamicStatus((ev as any)._rawStart, (ev as any)._rawEnd) };
      }
      return ev;
    });
    // refreshedManualEvents comes first, ensuring manual entries stay at the top
    return [...refreshedManualEvents, ...apiEvents];
  }, [apiEvents, manualEvents]);

  const availableCountries = useMemo(() => {
    const countries = new Set(allEvents.map((e) => e.country));
    countries.delete("Online"); 
    return ["All Countries", "India", "Online", ...Array.from(countries).filter(c => c !== "India")];
  }, [allEvents]);

  const filteredEvents = allEvents.filter((event) => {
    const matchCountry = activeCountry === "All Countries" || event.country === activeCountry;
    const matchCategory = activeCategory === "All Categories" || event.type === activeCategory;
    const matchStatus = activeStatus === "All" || event.status === activeStatus;
    
    return matchCountry && matchCategory && matchStatus;
  });

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="mx-auto w-full max-w-7xl px-6">
        
        {/* Header & Add Button */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Google Events</h1>
            <p className="mt-1.5 text-base text-gray-600">Discover developer events, meetups, and workshops globally.</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 shadow-sm"
          >
            + Add Event
          </button>
        </div>

        {/* Filters */}
        <div className="mb-10 grid gap-6 md:grid-cols-3">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Location</label>
            <select value={activeCountry} onChange={(e) => setActiveCountry(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm font-medium text-gray-800 outline-none focus:border-blue-500">
              {availableCountries.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Event Category</label>
            <select value={activeCategory} onChange={(e) => setActiveCategory(e.target.value)} className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm font-medium text-gray-800 outline-none focus:border-blue-500">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Timeline</label>
            <div className="flex w-full overflow-hidden rounded-lg border border-gray-300 bg-white">
              {/* Ongoing added here */}
              {["All", "Upcoming", "Ongoing", "Past"].map((status) => (
                <button key={status} onClick={() => setActiveStatus(status)} className={`flex-1 px-3 py-2.5 text-sm font-medium transition-colors ${activeStatus === status ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}`}>
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && <div className="py-20 text-center text-gray-500 font-medium">Fetching global events...</div>}
        {!loading && error && <div className="mb-6 rounded-2xl bg-red-50 p-6 text-red-600 font-medium">{error}</div>}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => (
              <article key={event.id} className="group relative flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md hover:-translate-y-1">
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className="rounded bg-blue-50 border border-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700 max-w-[65%] truncate">
                      {event.type}
                    </span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${event.status === "Upcoming" ? "bg-green-100 text-green-700" : event.status === "Ongoing" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-500"}`}>
                      {event.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-snug">{event.title}</h3>
                  {event.source === "Manual Entry" && (
                    <p className="text-xs font-medium text-gray-500 mb-2">{event.description}</p>
                  )}
                </div>

                <div className="mt-6 border-t border-gray-100 pt-4">
                  <div className="mb-4 space-y-2 text-sm font-medium text-gray-500">
                    <div className="flex items-center gap-2">📅 {event.date || "TBA"}</div>
                    <div className="flex items-center gap-2">📍 {event.location}</div> 
                  </div>
                  <a href={event.url} target="_blank" rel="noopener noreferrer" className="inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700">
                    View Details →
                  </a>
                </div>
              </article>
            ))}
          </div>
        ) : (
          !loading && (
            <div className="py-20 text-center rounded-2xl border border-dashed border-gray-300 bg-white">
              <h3 className="text-lg font-semibold text-gray-900">No events found</h3>
              <p className="text-gray-500 mt-1">No {activeStatus.toLowerCase()} {activeCategory !== "All Categories" ? activeCategory : "events"} found.</p>
            </div>
          )
        )}
      </div>

      {/* Add Event Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Add Custom Event</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase">Event Name</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. Gemini Hackathon" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Mode</label>
                  <select value={formData.mode} onChange={e => setFormData({...formData, mode: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500">
                    <option value="Online">Online</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Type</label>
                  <select value={formData.cost} onChange={e => setFormData({...formData, cost: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500">
                    <option value="Free">Free</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
              </div>

              {formData.mode === "In-Person" && (
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">City / Location</label>
                  <input required type="text" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" placeholder="e.g. Noida, India" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Start Date</label>
                  <input required type="date" value={formData.startDate} onChange={e => setFormData({...formData, startDate: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase">End Date</label>
                  <input required type="date" min={formData.startDate} value={formData.endDate} onChange={e => setFormData({...formData, endDate: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500">
                  {CATEGORIES.filter(c => c !== "All Categories").map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase">Event Link</label>
                <input required type="url" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})} className="mt-1 w-full rounded-lg border border-gray-300 p-2.5 text-sm outline-none focus:border-blue-500" placeholder="https://..." />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100">Cancel</button>
                <button type="submit" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Add Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}