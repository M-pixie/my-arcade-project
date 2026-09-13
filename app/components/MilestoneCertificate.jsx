"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Props = {
  userName: string;
  milestoneName: string;
};

export default function MilestoneCertificate({
  userName,
  milestoneName,
}: Props) {
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadCertificate = async () => {
    if (isDownloading) return;

    setIsDownloading(true);

    try {
      const element = certRef.current;

      if (!element) {
        throw new Error("Certificate element not found");
      }

      await new Promise((resolve) => setTimeout(resolve, 300));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        pdfHeight,
        undefined,
        "FAST"
      );

      const safeUserName = userName
        ? userName.trim().replace(/\s+/g, "_")
        : "Player";

      const safeMilestoneName = milestoneName
        ? milestoneName.trim().replace(/\s+/g, "_")
        : "Milestone";

      pdf.save(
        `${safeUserName}_${safeMilestoneName}_Certificate.pdf`
      );
    } catch (error) {
      console.error("Certificate PDF error:", error);

      alert(
        "Certificate download nahi ho paya. Please ek baar refresh karke try karein."
      );
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-4">

      {/* =================================
          DOWNLOAD BUTTON
      ================================= */}
      <button
        onClick={downloadCertificate}
        disabled={isDownloading}
        className={`
          px-6 py-2.5
          rounded-full
          font-semibold
          shadow-md
          transition-all
          flex items-center justify-center gap-2
          ${
            isDownloading
              ? "bg-gray-400 text-gray-800 cursor-not-allowed"
              : "bg-[#1a73e8] text-white hover:bg-blue-700 hover:shadow-lg"
          }
        `}
      >
        {isDownloading ? (
          <>
            <svg
              className="w-5 h-5 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />

              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>

            Generating PDF...
          </>
        ) : (
          <>Download {milestoneName} Certificate</>
        )}
      </button>

      {/* =================================
          HIDDEN CERTIFICATE
      ================================= */}
      <div
        className="
          fixed
          left-[-10000px]
          top-[-10000px]
          pointer-events-none
        "
      >
        <div
          ref={certRef}
          data-certificate
          className="
            relative
            w-[1123px]
            h-[794px]
            overflow-hidden
            bg-white
          "
        >

          {/* =================================
              CERTIFICATE BACKGROUND
          ================================= */}
          <img
            src="/certificates.pdf.png"
            alt="Google Cloud Arcade Facilitator Certificate"
            className="
              absolute
              inset-0
              w-full
              h-full
              object-cover
            "
            crossOrigin="anonymous"
          />

          {/* =================================
              USER NAME (Ab kaafi bada kar diya hai aur perfect line par set kiya hai)
          ================================= */}
          <div
            className="
              absolute
              left-0
              top-[36.5%]
              w-full
              text-center
              font-serif
              font-bold
              text-[96px]
              leading-none
              tracking-wide
              whitespace-nowrap
            "
            style={{
              color: "#F2994A",
            }}
          >
            {userName || "Arcade Player"}
          </div>

          {/* =================================
              MILESTONE (Ab ekdum first line me "achieving the" ke aage aayega)
          ================================= */}
          <div
            className="
              absolute
              top-[45.4%]
              left-[64.2%]
              text-left
              font-serif
              font-bold
              text-[26px]
              leading-none
              whitespace-nowrap
            "
            style={{
              color: "#0F9D58",
            }}
          >
            {milestoneName || "Milestone 1"}
          </div>

        </div>
      </div>
    </div>
  );
}