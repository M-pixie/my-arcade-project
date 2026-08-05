"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ExternalLink, Clock, Layers, ChevronDown, CheckCircle2, Circle, Check, ArrowUp, ArrowDown } from "lucide-react";
import Navbar from "@/app/components/Navbar";
import { useRouter } from "next/navigation"; 

// ======================================================================
// FINAL & COMPLETE 93 SKILL BADGES DATA ARRAY
// ======================================================================
const initialBadgesData = [
  // PAGE 1
  { id: "01", title: "Manage Kubernetes in Google Cloud", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/783" },
  { id: "02", title: "[Deprecated] Classify Images with TensorFlow on Google Cloud", duration: "75", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/646" },
  { id: "03", title: "Derive Insights from BigQuery Data", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/623" },
  { id: "04", title: "Share Data Using Google Data Cloud", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/657" },
  { id: "05", title: "Implement Cloud Collaboration and Productivity Workflows", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/676" },
  { id: "06", title: "Migrate MySQL Data to Cloud SQL Using Database Migration Service", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/629" },
  { id: "07", title: "Use Machine Learning APIs on Google Cloud", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/630" },
  { id: "08", title: "Mitigate Threats and Vulnerabilities with Security Command Center", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/759" },

  // PAGE 2
  { id: "09", title: "Monitor Environments with Google Cloud Managed Service for Prometheus", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/761" },
  { id: "10", title: "Organize and Govern Data with Knowledge Catalog", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/726" },
  { id: "11", title: "Prompt Design in Agent Platform", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/976" },
  { id: "12", title: "Configure Service Accounts and IAM Roles for Google Cloud", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/702" },
  { id: "13", title: "Integrate BigQuery Data and Google Workspace using Apps Script", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/737" },
  { id: "14", title: "Implement Speech and Language Solutions with Pre-trained APIs", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/700" },
  { id: "15", title: "Build a Data Mesh with Knowledge Catalog", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/681" },
  { id: "16", title: "Analyze Sentiment with Natural Language API", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/667" },

  // PAGE 3
  { id: "17", title: "Develop with Apps Script and AppSheet", duration: "45", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/715" },
  { id: "18", title: "Using the Google Cloud Speech API", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/756" },
  { id: "19", title: "Use APIs to Work with Cloud Storage", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/755" },
  { id: "20", title: "The Basics of Google Cloud Compute", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/754" },
  { id: "21", title: "Implement Sensitive Data Protection on Google Cloud", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/750" },
  { id: "22", title: "Analyze Images with the Cloud Vision API", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/633" },
  { id: "23", title: "Secure Lakehouse Data", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/751" },
  { id: "24", title: "Enrich Metadata and Discovery of Lakehouse Data", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/753" },

  // PAGE 4
  { id: "25", title: "Create a Secure Data Lake on Cloud Storage", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/704" },
  { id: "26", title: "Analyze Speech and Language with Google APIs", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/634" },
  { id: "27", title: "Monitoring in Google Cloud", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/747" },
  { id: "28", title: "Build Event-Driven Applications with Eventarc", duration: "15", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/727" },
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
  { id: "44", title: "Implement Event-Driven Messaging and Automation Workflows", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/728" },
  { id: "45", title: "Secure Software Delivery", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/1164" },
  { id: "46", title: "Set Up a Google Cloud Network", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/641" },
  { id: "47", title: "Create and Manage AlloyDB Instances", duration: "45", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/642" },
  { id: "48", title: "Build Real World AI Applications with Gemini and Imagen", duration: "75", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/1076" },

  // PAGE 7
  { id: "49", title: "Inspect Rich Documents with Gemini Multimodality and Multimodal RAG", duration: "45", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/981" },
  { id: "50", title: "Develop Gen AI Apps with Gemini and Streamlit", duration: "105", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/978" },
  { id: "51", title: "Explore Generative AI in Agent Platform", duration: "30", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/959" },
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
  { id: "73", title: "Deploy and Manage Applications on Google App Engine", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/671" },
  { id: "74", title: "Implement Cloud Storage and Data Protection Solutions", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/725" },
  { id: "75", title: "Create a Streaming Data Lake on Cloud Storage", duration: "90", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/705" },
  { id: "76", title: "Build Serverless Applications with Cloud Run Functions", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/696" },
  { id: "77", title: "Streaming Analytics into BigQuery", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/752" },
  { id: "78", title: "Deploy and Secure Serverless APIs with API Gateway", duration: "30", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/662" },
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
  { id: "93", title: "Develop and Secure APIs with Apigee X", duration: "45", labs: "Skill Badge", level: "Intermediate", link: "https://www.skills.google/course_templates/714" },
  { id: "94", title: "Orchestrate Multi-agent Workflows with Gemini Enterprise", duration: "60", labs: "Skill Badge", level: "Introductory", link: "https://www.skills.google/course_templates/1682" },

  { id: "95", title: "[DEPRECATED] Designing Network Security in Google Cloud", duration: "165", labs: "Skill Badge", level: "Advance", link: "https://www.skills.google/course_templates/1421" }, // not confirem ..

  { id: "96", title: "DEPRECATED Build Google Cloud Infrastructure for Azure Professionals", duration: "165", labs: "Skill Badge", level: "Advance", link: "https://www.skills.google/course_templates/xxx" } // not confirm yet..
  
];

export default function ResourcesPage() {
  const router = useRouter(); // Router Setup
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortBy, setSortBy] = useState("ID");
  
  const [autoCompletedIds, setAutoCompletedIds] = useState<string[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false); 

  // 🔥 DARK MODE STATE 🔥
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Check Local Storage for Dark Mode
    const savedTheme = localStorage.getItem("arcade_theme");
    if (savedTheme === "dark") {
      setIsDark(true);
    }
    
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
    
    // 🔥 FIX FOR CROSS-PAGE AUTO-SCROLL
    setTimeout(() => {
      if (window.location.hash === "#completed-section") {
        const element = document.getElementById("completed-section");
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }, 300);
    
  }, []);

  // Toggle Function for Dark Mode
  const toggleDarkMode = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem("arcade_theme", newTheme ? "dark" : "light");
  };

  // ================= SCROLL LOGIC =================
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollAction = () => {
    if (isScrolled) {
      window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to Top
    } else {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }); // Scroll to Bottom
    }
  };
  // ================================================

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

 // Splitting data into Pending and Completed for separate sections
  const pendingBadges = processedData.filter(badge => !autoCompletedIds.includes(badge.id));
  const completedBadges = processedData.filter(badge => autoCompletedIds.includes(badge.id));

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-[#e8f0fe] selection:text-[#1a73e8] pt-16 relative transition-colors duration-300 ${isDark ? 'bg-[#0a0a0b] text-gray-200' : 'bg-[#f8f9fa] text-[#202124]'}`}> 
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes premiumFastBlink {
          0%   { background-color: ${isDark ? '#0a2e1b' : '#d1e7dd'}; border-color: ${isDark ? '#0f5132' : '#a3cfbb'}; }
          50%  { background-color: ${isDark ? '#0f5132' : '#a3cfbb'}; border-color: ${isDark ? '#137333' : '#75b798'}; }
          100% { background-color: ${isDark ? '#0a2e1b' : '#d1e7dd'}; border-color: ${isDark ? '#0f5132' : '#a3cfbb'}; }
        }
        .completed-blink-card {
          animation: premiumFastBlink 1.5s infinite ease-in-out;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <Navbar />

      {/* Dynamic Scroll Top/Bottom Button (Fixed at Bottom Right) */}
      <button
        onClick={handleScrollAction}
        className={`fixed bottom-8 right-8 z-50 w-12 h-12 flex items-center justify-center border rounded-full transition-all shadow-md hover:shadow-lg ${isDark ? 'bg-[#15171b] border-[#3c4043] text-[#9aa0a6] hover:text-[#8ab4f8] hover:border-[#8ab4f8] hover:bg-[#1a1b1e]' : 'bg-white border-[#dadce0] text-[#5f6368] hover:text-[#1a73e8] hover:border-[#1a73e8] hover:bg-[#f8f9fa]'}`}
        title={isScrolled ? "Scroll to Top" : "Scroll to Bottom"}
      >
        {isScrolled ? (
          <ArrowUp className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <ArrowDown className="w-6 h-6 transition-transform duration-300" />
        )}
      </button>

      {/* ================= SEARCH & ADVANCED FILTERS (FULL WIDTH, SINGLE LINE) ================= */}
      <section className={`z-30 transition-colors duration-300 ${isDark ? 'bg-[#15171b]' : 'bg-white'}`}>
        <div className="w-full max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col xl:flex-row items-center justify-between gap-4 pt-4 pb-2">
          
          {/* Filters (No flex-wrap to prevent splitting onto two lines, enables horizontal scroll on tiny screens) */}
          <div className="flex items-center justify-start gap-2 sm:gap-3 w-full xl:w-auto overflow-x-auto no-scrollbar shrink-0">
            {["All", "Introductory", "Intermediate", "Advanced"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-4 py-2 text-[13px] md:text-sm font-bold rounded-full transition-all shadow-sm whitespace-nowrap ${
                  activeFilter === f 
                    ? "bg-[#1a73e8] text-white border border-[#1a73e8]" 
                    : (isDark ? "bg-[#1a1b1e] text-[#9aa0a6] border-[#3c4043] hover:bg-[#2a2d32] hover:text-[#8ab4f8] hover:border-[#8ab4f8]" : "bg-white text-[#5f6368] border-[#dadce0] hover:bg-[#f8f9fa] hover:text-[#1a73e8] hover:border-[#1a73e8]")
                }`}
              >
                {f === "All" ? "All Labs" : f}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto overflow-x-auto no-scrollbar">
            
            {/* LIVE TRACKER BOX */}
            {isMounted && (
              <div className="relative group/tracker shrink-0">
                <div className={`flex border rounded-md overflow-hidden text-sm w-full shadow-sm transition-colors ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}>
                  {/* Completed Tracker Box */}
                  <div 
                    onClick={() => scrollToSection('completed-section')}
                    className={`px-3 py-2.5 font-bold border-r flex items-center gap-1.5 justify-center cursor-pointer transition-colors ${isDark ? 'bg-[#0f5132]/30 text-[#81c995] border-[#81c995]/20 hover:bg-[#0f5132]/50' : 'bg-[#d1e7dd] text-[#0f5132] border-[#0f5132]/20 hover:bg-[#c3e0cf]'}`}
                  >
                    <CheckCircle2 size={16} /> 
                    <span className="hidden sm:inline">Completed:</span> 
                    {autoCompletedIds.length}
                  </div>
                  {/* Pending Tracker Box */}
                  <div 
                    onClick={() => scrollToSection('pending-section')}
                    className={`px-3 py-2.5 font-bold flex items-center gap-1.5 justify-center cursor-pointer transition-colors ${isDark ? 'bg-[#d93025]/20 text-[#f28b82] hover:bg-[#d93025]/30' : 'bg-[#fce8e6] text-[#d93025] hover:bg-[#f6d7d5]'}`}
                  >
                    <Circle size={16} /> 
                    <span className="hidden sm:inline">Pending:</span> 
                    {initialBadgesData.length - autoCompletedIds.length}
                  </div>
                </div>
              </div>
            )}

            {/* Search Box */}
            <div className="relative w-full sm:w-56 shrink-0">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-400' : 'text-[#9aa0a6]'}`} />
              <input 
                type="text" 
                placeholder="Search catalog..." 
                value={searchTerm} 
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2.5 border rounded-md text-sm transition-all outline-none ${isDark ? 'bg-[#1a1b1e] border-[#3c4043] text-white focus:bg-[#202124] focus:border-[#1a73e8]' : 'bg-[#f8f9fa] border-[#dadce0] focus:bg-white focus:border-[#1a73e8]'}`}
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-44 shrink-0">
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`w-full appearance-none pl-4 pr-10 py-2.5 border rounded-md text-sm font-medium focus:border-[#1a73e8] outline-none cursor-pointer ${isDark ? 'bg-[#1a1b1e] border-[#3c4043] text-gray-200' : 'bg-white border-[#dadce0] text-[#202124]'}`}
              >
                <option value="ID">Sort: Default</option>
                <option value="LabCountAsc">Lab Count (Low to High)</option>
                <option value="LabCountDesc">Lab Count (High to Low)</option>
                <option value="DurationAsc">Duration (Short to Long)</option>
                <option value="DurationDesc">Duration (Long to Short)</option>
              </select>
              <ChevronDown className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${isDark ? 'text-gray-400' : 'text-[#5f6368]'}`} />
            </div>

            {/* 🔥 DARK MODE TOGGLE 🔥 */}
            <button
              onClick={toggleDarkMode}
              className={`relative shrink-0 inline-flex h-8 w-14 items-center rounded-full transition-colors duration-300 focus:outline-none shadow-inner border ${isDark ? 'bg-[#131416] border-[#3c4043]' : 'bg-[#e8eaed] border-[#dadce0]'}`}
              title="Toggle Dark Mode"
            >
              <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-300 shadow-md flex items-center justify-center ${isDark ? 'translate-x-[26px]' : 'translate-x-1'}`}>
                {isDark ? (
                  <svg className="w-3.5 h-3.5 text-[#1a73e8]" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>
                ) : (
                  <svg className="w-3.5 h-3.5 text-[#f9ab00]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 4.22a1 1 0 011.415 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM14.22 15.636a1 1 0 010 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm-4.22-1.414a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414-1.414l.707-.707zM2 10a1 1 0 011-1h1a1 1 0 110 2H3a1 1 0 01-1-1zm1.414-4.95a1 1 0 010-1.414l.707-.707a1 1 0 011.414 1.414l-.707.707a1 1 0 01-1.414 0zM10 5a5 5 0 100 10 5 5 0 000-10z" clipRule="evenodd"></path></svg>
                )}
              </span>
            </button>

            {/* 🔥 NEW CURVED CALCULATOR BUTTON 🔥 */}
            <button 
              onClick={() => router.push('/calculator')} 
              className={`relative shrink-0 inline-flex h-9 items-center justify-center px-5 rounded-full font-bold text-[13px] shadow-sm transition-all ${isDark ? 'bg-[#8ab4f8] text-[#15171b] hover:bg-[#aecbfa]' : 'bg-[#1a73e8] text-white hover:bg-[#1557b0]'}`}
            >
              Calculator
            </button>
          </div>
        </div>
      </section>

      {/* ================= CARDS GRID SECTION ================= */}
      <section className={`pt-8 pb-10 px-4 lg:px-8 min-h-[600px] transition-colors duration-300 ${isDark ? 'bg-[#0a0a0b]' : 'bg-[#f8f9fa]'}`}>
        <div className="w-full max-w-[1440px] mx-auto">
          
          {/* Header row with Title and Pending Centered */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 relative w-full md:min-h-[30px]">
            {/* Left Side: Count */}
            <div className="flex items-center gap-4 border-l-4 border-[#1a73e8] pl-4 md:absolute md:left-0 md:top-1/2 md:-translate-y-1/2">
              <h2 className={`text-xl font-bold ${isDark ? 'text-white' : 'text-[#202124]'}`}>
                {processedData.length} <span className={`font-normal ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>Skill Badges Available</span>
              </h2>
            </div>

            {/* Center Side: Pending Header (aligned with the left title) */}
            {pendingBadges.length > 0 && (
              <div className="w-full flex md:justify-center justify-start mt-4 md:mt-0">
                <h5 className={`text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ea4335]"></span>
                  Pending Skill Badges ({pendingBadges.length})
                </h5>
              </div>
            )}
          </div>

          {/* ================= SECTION 1: PENDING BADGES ================= */}
          {pendingBadges.length > 0 && (
            <div id="pending-section" className="mb-10 scroll-mt-32">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pendingBadges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className={`group rounded-xl p-5 flex flex-col hover:shadow-[0_12px_32px_rgba(26,115,232,0.08)] transition-all duration-400 relative border bg-gradient-to-br ${isDark ? 'from-[#1a1b1e] to-[#15171b] border-[#3c4043] hover:border-[#8ab4f8]' : 'from-[#f8f9fa] to-[#e8eaed] border-[#dadce0] hover:border-[#1a73e8]'}`}
                  >
                    {/* Small Icon & Tiny Text */}
                    <div className="flex flex-col items-start mb-3">
                      <img 
                        src="https://i.postimg.cc/bwX3MCMF/1775250377511.png" 
                        alt="Badge Icon" 
                        className="w-8 h-8 object-contain drop-shadow-sm transition-transform duration-300 group-hover:scale-105"
                      />
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest mt-1.5 ml-0.5 ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>
                        Skill Badge
                      </span>
                    </div>

                    {/* Header Meta (REMOVED BDG-) */}
                    <div className="flex items-center gap-3 mb-3 pr-24">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        badge.level === "Introductory" ? (isDark ? "text-[#81c995]" : "text-[#1e8e3e]") : 
                        badge.level === "Intermediate" ? (isDark ? "text-[#8ab4f8]" : "text-[#1a73e8]") : (isDark ? "text-[#f28b82]" : "text-[#d93025]")
                      }`}>
                        {badge.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-[16px] font-bold leading-snug mb-3 min-h-[40px] line-clamp-2 transition-colors pr-2 group-hover:text-[#1a73e8] ${isDark ? 'text-gray-200 group-hover:text-[#8ab4f8]' : 'text-[#202124]'}`}>
                      {badge.title}
                    </h3>
                    
                    {/* Specs (ADDED Badge ID with Labs) */}
                    <div className={`mt-auto pt-3 border-t space-y-2 mb-4 ${isDark ? 'border-[#3c4043]/50' : 'border-[#dadce0]/50'}`}>
                      <div className="flex items-center text-sm font-medium group/info">
                        <Clock className={`w-3.5 h-3.5 mr-3 transition-colors group-hover/info:text-[#1a73e8] ${isDark ? 'text-gray-500 group-hover/info:text-[#8ab4f8]' : 'text-[#9aa0a6]'}`} />
                        <span className={isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}>Duration: {badge.duration} mins</span>
                      </div>
                      <div className="flex items-center text-sm font-medium group/info">
                        <Layers className={`w-3.5 h-3.5 mr-3 transition-colors group-hover/info:text-[#34a853] ${isDark ? 'text-gray-500 group-hover/info:text-[#81c995]' : 'text-[#9aa0a6]'}`} />
                        <span className={isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}>{badge.labs} {parseInt(badge.id, 10)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <a 
                      href={badge.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[13px] font-bold rounded-lg transition-all duration-300 shadow-sm uppercase tracking-widest border bg-[#1a73e8] text-white border-[#1a73e8] hover:bg-[#1557b0]"
                    >
                      Start Learning <ExternalLink className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SECTION 2: COMPLETED BADGES ================= */}
          {completedBadges.length > 0 && (
            <div id="completed-section" className="scroll-mt-32">
              <div className="flex justify-center mb-8">
                <h5 className={`text-sm font-black uppercase tracking-widest flex items-center justify-center gap-2 pt-6 w-full border-t ${isDark ? 'text-[#81c995] border-[#2a2d32]' : 'text-[#137333] border-[#dadce0]'}`}>
                  <span className="w-2.5 h-2.5 rounded-full bg-[#34a853]"></span>
                  Completed Skill Badges ({completedBadges.length})
                </h5>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {completedBadges.map((badge) => (
                  <div 
                    key={badge.id} 
                    className="group rounded-xl p-5 flex flex-col hover:shadow-[0_4px_12px_rgba(52,168,83,0.12)] transition-all duration-400 relative border completed-blink-card shadow-sm opacity-95"
                  >
                    
                    {/* Small Icon & Tiny Text */}
                    <div className="flex flex-col items-start mb-3 opacity-80">
                      <img 
                        src="https://i.postimg.cc/bwX3MCMF/1775250377511.png" 
                        alt="Badge Icon" 
                        className="w-8 h-8 object-contain drop-shadow-sm"
                      />
                      <span className={`text-[9px] font-extrabold uppercase tracking-widest mt-1.5 ml-0.5 ${isDark ? 'text-[#81c995]/80' : 'text-[#0f5132]/80'}`}>
                        Skill Badge
                      </span>
                    </div>

                    {/* Header Meta (REMOVED BDG-) */}
                    <div className="flex items-center gap-3 mb-3 pr-24 opacity-80">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-[#81c995]' : 'text-[#0f5132]'}`}>
                        {badge.level}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className={`text-[16px] font-bold leading-snug mb-3 min-h-[40px] line-clamp-2 pr-2 ${isDark ? 'text-[#a8dab5]' : 'text-[#0f5132]'}`}>
                      {badge.title}
                    </h3>
                    
                    {/* Specs (ADDED Badge ID with Labs) */}
                    <div className={`mt-auto pt-3 border-t space-y-2 mb-4 opacity-90 ${isDark ? 'border-[#0f5132]/50' : 'border-[#a3cfbb]/50'}`}>
                      <div className="flex items-center text-sm font-medium">
                        <Clock className={`w-3.5 h-3.5 mr-3 ${isDark ? 'text-[#81c995]/70' : 'text-[#0f5132]/70'}`} />
                        <span className={isDark ? 'text-[#81c995]' : 'text-[#0f5132]'}>Duration: {badge.duration} mins</span>
                      </div>
                      <div className="flex items-center text-sm font-medium">
                        <Layers className={`w-3.5 h-3.5 mr-3 ${isDark ? 'text-[#81c995]/70' : 'text-[#0f5132]/70'}`} />
                        <span className={isDark ? 'text-[#81c995]' : 'text-[#0f5132]'}>{badge.labs} {parseInt(badge.id, 10)}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <a 
                      href={badge.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 text-[13px] font-bold rounded-lg transition-all duration-300 shadow-sm uppercase tracking-widest border ${isDark ? 'bg-[#1e8e3e] text-[#0a2e1b] border-[#1e8e3e] hover:bg-[#137333] hover:text-white' : 'bg-[#137333] text-white border-[#137333] hover:bg-[#0d5023]'}`}
                    >
                      <CheckCircle2 className="w-4 h-4" /> Completed
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* No Data State */}
          {processedData.length === 0 && (
            <div className={`text-center py-20 border border-dashed rounded-md mt-8 ${isDark ? 'bg-[#15171b] border-[#3c4043]' : 'bg-white border-[#dadce0]'}`}>
              <Search className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-[#3c4043]' : 'text-[#dadce0]'}`} />
              <p className={`font-medium text-lg ${isDark ? 'text-[#9aa0a6]' : 'text-[#5f6368]'}`}>No badges match your criteria.</p>
              <button onClick={() => {setSearchTerm(""); setActiveFilter("All");}} className="mt-4 text-[#1a73e8] font-bold hover:underline">Clear all filters</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}