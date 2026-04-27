"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ExternalLink, Clock, Layers, ChevronDown, CheckCircle2, Circle } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation"; 

// ======================================================================
// FINAL & COMPLETE 93 SKILL BADGES DATA ARRAY
// Pura data exact match kiya gaya hai images aur instructions ke hisaab se!
// ======================================================================
const initialBadgesData = [
  // PAGE 1
  { id: "01", title: "Manage Kubernetes in Google Cloud", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/783" },
  { id: "02", title: "Classify Images with TensorFlow on Google Cloud", duration: "75", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/646" },
  { id: "03", title: "Derive Insights from BigQuery Data", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/623" },
  { id: "04", title: "Share Data Using Google Data Cloud", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/657" },
  { id: "05", title: "Get Started with Google Workspace Tools", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/676" },
  { id: "06", title: "Migrate MySQL Data to Cloud SQL Using Database Migration...", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/629" },
  { id: "07", title: "Use Machine Learning APIs on Google Cloud", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/630" },
  { id: "08", title: "Mitigate Threats and Vulnerabilities with Security Command...", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/759" },

  // PAGE 2
  { id: "09", title: "Monitor Environments with Google Cloud Managed Service for...", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/761" },
  { id: "10", title: "Get Started with Dataplex", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/726" },
  { id: "11", title: "Prompt Design in Vertex AI", duration: "105", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/976" },
  { id: "12", title: "Configure Service Accounts and IAM Roles for Google Cloud", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/702" },
  { id: "13", title: "Integrate BigQuery Data and Google Workspace using Apps Script", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/737" },
  { id: "14", title: "Cloud Speech API: 3 Ways", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/700" },
  { id: "15", title: "Build a Data Mesh with Dataplex", duration: "105", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/681" },
  { id: "16", title: "Analyze Sentiment with Natural Language API", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/667" },

  // PAGE 3
  { id: "17", title: "Develop with Apps Script and AppSheet", duration: "45", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/715" },
  { id: "18", title: "Using the Google Cloud Speech API", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/756" },
  { id: "19", title: "Use APIs to Work with Cloud Storage", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/755" },
  { id: "20", title: "The Basics of Google Cloud Compute", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/754" },
  { id: "21", title: "Get Started with Sensitive Data Protection", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/750" },
  { id: "22", title: "Analyze Images with the Cloud Vision API", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/633" },
  { id: "23", title: "Secure BigLake Data", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/751" },
  { id: "24", title: "Enrich Metadata and Discovery of BigLake Data", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/753" },

  // PAGE 4
  { id: "25", title: "Create a Secure Data Lake on Cloud Storage", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/704" },
  { id: "26", title: "Analyze Speech and Language with Google APIs", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/634" },
  { id: "27", title: "Monitoring in Google Cloud", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/747" },
  { id: "28", title: "Get Started with Eventarc", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/727" },
  { id: "29", title: "Create Your First Gemini Enterprise Application", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/1586" },
  { id: "30", title: "Engineer AI Agents with Agent Development Kit (ADK)", duration: "105", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1596" },
  { id: "31", title: "Build Global and Regional Load Balancing Solutions", duration: "270", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1558" },
  { id: "32", title: "Google DeepMind: Train A Small Language Model", duration: "75", labs: "Skill Badge", level: "Advanced", link: "https://www.skills.google/course_templates/1453" },

  // PAGE 5
  { id: "33", title: "Build a Smart Cloud Application with Vibe Coding and MCP", duration: "105", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1459" },
  { id: "34", title: "Deploy Multi-Agent Architectures", duration: "135", labs: "Skill Badge", level: "Advanced", link: "https://www.skills.google/course_templates/1445" },
  { id: "35", title: "Develop AI-Powered Prototypes in Google AI Studio", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/1426" },
  { id: "36", title: "Kickstarting Application Development with Gemini Code Assist", duration: "75", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1399" },
  { id: "37", title: "Connecting Cloud Networks with NCC", duration: "135", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1364" },
  { id: "38", title: "Privileged Access with IAM", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1337" },
  { id: "39", title: "Enhance Gemini Model Capabilities", duration: "45", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1241" },
  { id: "40", title: "Analyze and Reason on Multimodal Data with Gemini", duration: "45", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1240" },

  // PAGE 6
  { id: "41", title: "Implement Multimodal Vector Search with BigQuery", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1232" },
  { id: "42", title: "Protect Cloud Traffic with Chrome Enterprise Premium Security", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/784" },
  { id: "43", title: "Discover and Protect Sensitive Data Across Your Ecosystem", duration: "45", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1177" },
  { id: "44", title: "Get Started with Pub/Sub", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/728" },
  { id: "45", title: "Secure Software Delivery", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1164" },
  { id: "46", title: "Set Up a Google Cloud Network", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/641" },
  { id: "47", title: "Create and Manage AlloyDB Instances", duration: "45", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/642" },
  { id: "48", title: "Build Real World AI Applications with Gemini and Imagen", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/1076" },

  // PAGE 7
  { id: "49", title: "Inspect Rich Documents with Gemini Multimodality and...", duration: "105", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/981" },
  { id: "50", title: "Develop Gen AI Apps with Gemini and Streamlit", duration: "105", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/978" },
  { id: "51", title: "Explore Generative AI with the Gemini API in Vertex AI", duration: "105", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/959" },
  { id: "52", title: "Build LookML Objects in Looker", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/639" },
  { id: "53", title: "Create and Manage Cloud SQL for PostgreSQL Instances", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/652" },
  { id: "54", title: "Deploy and Manage Apigee X", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/661" },
  { id: "55", title: "Prepare Data for Looker Dashboards and Reports", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/628" },
  { id: "56", title: "Optimize Costs for Google Kubernetes Engine", duration: "45", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/655" },

  // PAGE 8
  { id: "57", title: "Develop Serverless Apps with Firebase", duration: "75", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/649" },
  { id: "58", title: "Develop Serverless Applications on Cloud Run", duration: "75", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/741" },
  { id: "59", title: "Implement Cloud Security Fundamentals on Google Cloud", duration: "105", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/645" },
  { id: "60", title: "Build a Data Warehouse with BigQuery", duration: "75", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/624" },
  { id: "61", title: "Create ML Models with BigQuery ML", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/626" },
  { id: "62", title: "Monitor and Log with Google Cloud Observability", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/749" },
  { id: "63", title: "Implement DevOps Workflows in Google Cloud", duration: "60", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/716" },
  { id: "64", title: "Engineer Data for Predictive Modeling with BigQuery ML", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/627" },

  // PAGE 9
  { id: "65", title: "Build a Secure Google Cloud Network", duration: "75", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/654" },
  { id: "66", title: "Cloud Architecture: Design, Implement, and Manage", duration: "135", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/640" },
  { id: "67", title: "Build a Website on Google Cloud", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/638" },
  { id: "68", title: "Implementing Cloud Load Balancing for Compute Engine", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/648" },
  { id: "69", title: "Develop Your Google Cloud Network", duration: "75", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/625" },
  { id: "70", title: "Set Up an App Dev Environment on Google Cloud", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/637" },
  { id: "71", title: "Prepare Data for ML APIs on Google Cloud", duration: "90", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/631" },
  { id: "72", title: "Deploy Kubernetes Applications on Google Cloud", duration: "105", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/663" },

  // PAGE 10
  { id: "73", title: "App Engine: 3 Ways", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/671" },
  { id: "74", title: "Get Started with Cloud Storage", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/725" },
  { id: "75", title: "Create a Streaming Data Lake on Cloud Storage", duration: "90", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/705" },
  { id: "76", title: "Build Serverless Applications with Cloud Run Functions", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/696" },
  { id: "77", title: "Streaming Analytics into BigQuery", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/752" },
  { id: "78", title: "Get Started with API Gateway", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/662" },
  { id: "79", title: "App Building with AppSheet", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/635" },
  { id: "80", title: "Store, Process, and Manage Data on Google Cloud - Console", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/658" },

  // PAGE 11
  { id: "81", title: "Analyze BigQuery Data in Connected Sheets", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/632" },
  { id: "82", title: "Monitor and Manage Google Cloud Resources", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/653" },
  { id: "83", title: "Store, Process, and Manage Data on Google Cloud - Command Line", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/659" },
  { id: "84", title: "Build Google Cloud Infrastructure for AWS Professionals", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/687" },
  { id: "85", title: "Create and Manage Bigtable Instances", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/650" },
  { id: "86", title: "Implement CI/CD Pipelines on Google Cloud", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/691" },
  { id: "87", title: "Use Functions, Formulas, and Charts in Google Sheets", duration: "45", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/776" },
  { id: "88", title: "Create and Manage Cloud Spanner Instances", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/643" },

  // PAGE 12
  { id: "89", title: "Build Infrastructure with Terraform on Google Cloud", duration: "105", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/636" },
  { id: "90", title: "Perform Predictive Data Analysis in BigQuery", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/656" },
  { id: "91", title: "Automate Data Capture at Scale with Document AI", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/674" },
  { id: "92", title: "Manage Data Models in Looker", duration: "45", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/651" },
  { id: "93", title: "Develop and Secure APIs with Apigee X", duration: "45", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/714" }
];

export default function ResourcesPage() {
  const router = useRouter(); // Router Setup
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("ID");
  
  const [autoCompletedIds, setAutoCompletedIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // =========================================================
    // 🔥 PURE AUTO-SYNC LOGIC: Match calculated history from dashboard
    // =========================================================
    let autoCompleted: string[] = [];
    const arcadeData = localStorage.getItem("arcade_user_data");
    
    if (arcadeData) {
      try {
        const parsed = JSON.parse(arcadeData);
        const history = parsed.history || [];
        
        initialBadgesData.forEach(badge => {
          const isMatch = history.some((h: any) => 
            h.name.toLowerCase().includes(badge.title.toLowerCase()) || 
            badge.title.toLowerCase().includes(h.name.toLowerCase())
          );
          if (isMatch) {
            autoCompleted.push(badge.id);
          }
        });
      } catch (e) {
        console.error("Error parsing arcade_user_data", e);
      }
    }

    setAutoCompletedIds(autoCompleted);
    
  }, []);

  const processedData = useMemo(() => {
    let filtered = initialBadgesData.filter((badge) => {
      const matchesSearch = badge.title.toLowerCase().includes(searchTerm.toLowerCase());
      let matchesFilter = true;
      if (["Introductory", "Intermediate", "Advanced"].includes(activeFilter)) {
        matchesFilter = badge.level === activeFilter;
      }
      return matchesSearch && matchesFilter;
    });

    return filtered.sort((a, b) => {
      if (sortBy === "DurationAsc") return parseInt(a.duration) - parseInt(b.duration);
      if (sortBy === "DurationDesc") return parseInt(b.duration) - parseInt(a.duration);
      if (sortBy === "LabCountAsc") return (parseInt(a.labs) || 0) - (parseInt(b.labs) || 0);
      if (sortBy === "LabCountDesc") return (parseInt(b.labs) || 0) - (parseInt(a.labs) || 0);
      return parseInt(a.id) - parseInt(b.id); 
    });
  }, [searchTerm, activeFilter, sortBy]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#202124] font-sans selection:bg-[#e8f0fe] selection:text-[#1a73e8] pt-20"> 
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes premiumFastBlink {
          0%   { background-color: #d1e7dd; border-color: #a3cfbb; }
          50%  { background-color: #a3cfbb; border-color: #75b798; }
          100% { background-color: #d1e7dd; border-color: #a3cfbb; }
        }
        .completed-blink-card {
          animation: premiumFastBlink 1.5s infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <Navbar />

      {/* ================= SEARCH & ADVANCED FILTERS ================= */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#dadce0] shadow-sm pt-4">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-6 py-5">
          
          {/* Main Filter Premium Blue Buttons (Now Inline & Pushed Left) */}
          <div className="flex flex-nowrap items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar w-full lg:w-auto pb-1">
            {["All", "Introductory", "Intermediate", "Advanced"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 text-[13px] md:text-sm font-bold rounded-full transition-all shadow-sm whitespace-nowrap ${
                  activeFilter === f 
                    ? "bg-[#1a73e8] text-white border border-[#1a73e8]" 
                    : "bg-white text-[#5f6368] border border-[#dadce0] hover:bg-[#f8f9fa] hover:text-[#1a73e8] hover:border-[#1a73e8]"
                }`}
              >
                {f === "All" ? "All Labs" : f}
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            
            {/* LIVE TRACKER BOX */}
            {isMounted && (
              <div className="relative group/tracker">
                <div className="flex bg-white border border-[#dadce0] rounded-md overflow-hidden text-sm w-full sm:w-auto shadow-sm cursor-help hover:border-[#1a73e8] transition-colors">
                  <div className="px-3 py-2.5 text-[#1e8e3e] font-bold border-r border-[#dadce0] bg-[#e6f4ea]/60 flex items-center gap-1.5 justify-center sm:justify-start w-1/2 sm:w-auto">
                    <CheckCircle2 size={16} /> 
                    <span className="hidden xl:inline">Completed:</span> 
                    {autoCompletedIds.length}
                  </div>
                  <div className="px-3 py-2.5 text-[#5f6368] font-bold bg-[#f8f9fa] flex items-center gap-1.5 justify-center sm:justify-start w-1/2 sm:w-auto">
                    <Circle size={16} /> 
                    <span className="hidden xl:inline">Pending:</span> 
                    {initialBadgesData.length - autoCompletedIds.length}
                  </div>
                </div>
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 bg-[#202124] text-white text-[11px] rounded shadow-lg whitespace-nowrap opacity-0 group-hover/tracker:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
                  Track your overall progress
                </div>
              </div>
            )}

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9aa0a6]" />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#f8f9fa] border border-[#dadce0] rounded-md text-sm focus:bg-white focus:border-[#1a73e8] transition-all outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-56">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border border-[#dadce0] rounded-md text-sm font-medium text-[#202124] focus:border-[#1a73e8] outline-none cursor-pointer"
              >
                <option value="ID">Sort: Default</option>
                <option value="LabCountAsc">Lab Count (Low to High)</option>
                <option value="LabCountDesc">Lab Count (High to Low)</option>
                <option value="DurationAsc">Duration (Short to Long)</option>
                <option value="DurationDesc">Duration (Long to Short)</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5f6368] pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ================= CARDS GRID & HEADER BUTTONS ================= */}
      <section className="py-10 px-6 bg-[#f8f9fa] min-h-[600px]">
        <div className="max-w-7xl mx-auto">
          
          {/* Header & Premium Action Buttons Row */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-8 gap-4">
            <div className="flex items-center gap-3 border-l-4 border-[#1a73e8] pl-4">
              <h2 className="text-xl font-bold text-[#202124]">
                {processedData.length} <span className="font-normal text-[#5f6368]">Skill Badges Available</span>
              </h2>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 justify-start xl:justify-end">
              <button 
                onClick={() => router.push('/calculator')} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#dadce0] text-[#1a73e8] hover:bg-[#f8f9fa] hover:border-[#1a73e8] px-5 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all"
              >
                Calculate Points
              </button>
              
              {/* === NEW BUTTON ADDED HERE === */}
              <button 
                onClick={() => router.push('/home')} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#dadce0] text-[#1a73e8] hover:bg-[#f8f9fa] hover:border-[#1a73e8] px-5 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all"
              >
                Required Credits
              </button>

              <button 
                onClick={() => router.push('/leaderboard')} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#dadce0] text-[#1a73e8] hover:bg-[#f8f9fa] hover:border-[#1a73e8] px-5 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all"
              >
                Leaderboard
              </button>
              <button 
                onClick={() => router.push('/facilitator')} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-white border border-[#dadce0] text-[#1a73e8] hover:bg-[#f8f9fa] hover:border-[#1a73e8] px-5 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all"
              >
                Facilitator Program
              </button>
              <button 
                onClick={() => router.push('/dashboard')} 
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-[#1a73e8] text-white hover:bg-[#1557b0] px-5 py-2.5 rounded-md text-sm font-bold shadow-sm transition-all"
              >
                Open Dashboard
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {processedData.map((badge) => {
              const isDone = autoCompletedIds.includes(badge.id);

              return (
                <div 
                  key={badge.id} 
                  className={`group rounded-md p-5 flex flex-col hover:shadow-[0_12px_32px_rgba(26,115,232,0.08)] transition-all duration-400 relative border ${
                    isDone 
                      ? 'completed-blink-card shadow-[0_4px_12px_rgba(52,168,83,0.12)]' 
                      : 'bg-gradient-to-br from-[#f8f9fa] to-[#e8eaed] border-[#dadce0] hover:border-[#1a73e8]' 
                  }`}
                >
                  
                  {/* AUTO-SYNCED BADGE - No manual mark done toggle */}
                  {isMounted && isDone && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="flex items-center gap-1.5 text-[#137333] bg-[#e6f4ea] border border-[#ceead6] px-2.5 py-1 rounded-sm text-[10px] font-bold uppercase tracking-wider shadow-sm" title="Auto-verified from Profile">
                        <CheckCircle2 size={14} /> Completed
                      </div>
                    </div>
                  )}

                  {/* Small Icon & Tiny Text */}
                  <div className="flex flex-col items-start mb-3">
                    <img 
                      src="https://i.postimg.cc/bwX3MCMF/1775250377511.png" 
                      alt="Badge Icon" 
                      className="w-8 h-8 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                    />
                    <span className={`text-[9px] font-extrabold uppercase tracking-widest mt-1.5 ml-0.5 ${isDone ? 'text-[#0f5132]/80' : 'text-[#5f6368]'}`}>
                      Skill Badge
                    </span>
                  </div>

                  {/* Header Meta */}
                  <div className="flex items-center gap-3 mb-3 pr-24">
                    <span className="text-[10px] font-bold text-[#9aa0a6] uppercase tracking-[0.2em]">
                      BDG-{badge.id}
                    </span>
                    <span className="w-1 h-1 rounded-full bg-[#dadce0]"></span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      badge.level === "Introductory" ? "text-[#1e8e3e]" : 
                      badge.level === "Intermediate" ? "text-[#1a73e8]" : "text-[#d93025]"
                    }`}>
                      {badge.level}
                    </span>
                  </div>

                  {/* Title (Reduced Height) */}
                  <h3 className={`text-[16px] font-bold leading-snug mb-3 min-h-[40px] line-clamp-2 transition-colors pr-2 ${
                    isDone ? 'text-[#0f5132]' : 'text-[#202124] group-hover:text-[#1a73e8]'
                  }`}>
                    {badge.title}
                  </h3>
                  
                  {/* Specs */}
                  <div className="mt-auto pt-3 border-t border-[#dadce0]/50 space-y-2 mb-4">
                    <div className="flex items-center text-sm font-medium group/info">
                      <Clock className={`w-3.5 h-3.5 mr-3 transition-colors ${isDone ? 'text-[#0f5132]/70' : 'text-[#9aa0a6] group-hover/info:text-[#1a73e8]'}`} />
                      <span className={isDone ? 'text-[#0f5132]' : 'text-[#5f6368]'}>Duration: {badge.duration} mins</span>
                    </div>
                    <div className="flex items-center text-sm font-medium group/info">
                      <Layers className={`w-3.5 h-3.5 mr-3 transition-colors ${isDone ? 'text-[#0f5132]/70' : 'text-[#9aa0a6] group-hover/info:text-[#34a853]'}`} />
                      <span className={isDone ? 'text-[#0f5132]' : 'text-[#5f6368]'}>{badge.labs}</span>
                    </div>
                  </div>

                  {/* Action Button - Solid Blue for Pending, Green for Complete */}
                  <a 
                    href={badge.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[13px] font-bold rounded-sm transition-all duration-300 shadow-sm uppercase tracking-widest border ${
                      isDone 
                        ? 'bg-[#137333] text-white border-[#137333] hover:bg-[#0d5023]' 
                        : 'bg-[#1a73e8] text-white border-[#1a73e8] hover:bg-[#1557b0]'
                    }`}
                  >
                    {isDone ? (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> Completed
                      </>
                    ) : (
                      <>
                        Start Learning <ExternalLink className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </>
                    )}
                  </a>
                </div>
              );
            })}
          </div>

          {/* No Data State */}
          {processedData.length === 0 && (
            <div className="text-center py-20 bg-white border border-dashed border-[#dadce0] rounded-md mt-8">
              <Search className="w-12 h-12 text-[#dadce0] mx-auto mb-4" />
              <p className="text-[#5f6368] font-medium text-lg">No badges match your criteria.</p>
              <button onClick={() => {setSearchTerm(""); setActiveFilter("All");}} className="mt-4 text-[#1a73e8] font-bold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}