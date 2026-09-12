"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Props = {
  name: string;
  arcadePoints: number;
  prizeTier: string;
  onClose?: () => void;
};

const WIDTH = 1200;
const HEIGHT = 675;

/* =========================================================
   POSTER IMAGE
   ========================================================= */

const BACKGROUND =
  "https://raw.githubusercontent.com/M-pixie/poster-image/main/arcade-poster.png";

const WEBSITE = "https://arcade-calculator.vercel.app";

const FONT =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

/* =========================================================
   DRAW TEXT
   ========================================================= */

function drawText(
  ctx: CanvasRenderingContext2D,
  text: string,
  options: {
    x: number;
    y: number;
    maxWidth?: number;
    fontSize: number;
    minFontSize?: number;
    weight?: string;
    color?: string;
  }
) {
  const {
    x,
    y,
    maxWidth,
    fontSize,
    minFontSize = 20,
    weight = "400",
    color = "#172B4D",
  } = options;

  const value = String(text ?? "").trim();

  if (!value) return;

  let size = fontSize;

  ctx.save();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = color;

  while (
    maxWidth &&
    size > minFontSize &&
    (() => {
      ctx.font = `${weight} ${size}px ${FONT}`;
      return ctx.measureText(value).width > maxWidth;
    })()
  ) {
    size -= 1;
  }

  ctx.font = `${weight} ${size}px ${FONT}`;

  let finalText = value;

  if (maxWidth && ctx.measureText(finalText).width > maxWidth) {
    while (
      finalText.length > 1 &&
      ctx.measureText(`${finalText}…`).width > maxWidth
    ) {
      finalText = finalText.slice(0, -1);
    }

    finalText += "…";
  }

  ctx.fillText(finalText, x, y);

  ctx.restore();
}

/* =========================================================
   CANVAS TO PNG
   ========================================================= */

async function canvasToBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas failed to create PNG."));
          return;
        }

        resolve(blob);
      },
      "image/png",
      1
    );
  });
}

/* =========================================================
   COMPONENT
   ========================================================= */

export default function ArcadeSharePoster({
  name,
  arcadePoints,
  prizeTier,
  onClose,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [ready, setReady] = useState(false);
  const [error, setError] = useState("");
  const [sharing, setSharing] = useState(false);

  /* =======================================================
     GENERATE POSTER
     ======================================================= */

  const generatePoster = useCallback(async () => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    setReady(false);
    setError("");

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      setError("Canvas is not supported in this browser.");
      return;
    }

    canvas.width = WIDTH;
    canvas.height = HEIGHT;

    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    try {
      const image = new Image();

      image.crossOrigin = "anonymous";

      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();

        image.onerror = () =>
          reject(new Error("Failed to load poster background."));

        image.src = BACKGROUND;
      });

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      /* ===================================================
         BACKGROUND
         =================================================== */

      ctx.drawImage(image, 0, 0, WIDTH, HEIGHT);

      /* ===================================================
         EXACT CENTER
         =================================================== */

      const CENTER_X = WIDTH / 2;

      /* ===================================================
         1. NAME
         
         NAME GOES INSIDE THE LONG ROUNDED BAR
         AT THE TOP.
         =================================================== */

      if (name?.trim()) {
        drawText(ctx, name.trim(), {
          x: CENTER_X,
          y: 198,
          maxWidth: 500,
          fontSize: 34,
          minFontSize: 22,
          weight: "800",
          color: "#172B4D",
        });
      }

      /* ===================================================
         2. ARCADE POINTS
         
         POINTS GO INSIDE THE FIRST RECTANGULAR BOX
         BELOW THE NAME BAR.
         =================================================== */

      if (Number.isFinite(arcadePoints)) {
        drawText(ctx, String(arcadePoints), {
          x: CENTER_X,
          y: 281,
          maxWidth: 300,
          fontSize: 42,
          minFontSize: 26,
          weight: "800",
          color: "#172B4D",
        });
      }

      /* ===================================================
         3. PRIZE TIER
         
         PRIZE TIER GOES INSIDE THE SECOND
         RECTANGULAR BOX BELOW ARCADE POINTS.
         =================================================== */

      if (prizeTier?.trim()) {
        const displayTier = prizeTier
          .trim()
          .replace(/^arcade\s+/i, "")
          .toUpperCase();

        drawText(ctx, displayTier, {
          x: CENTER_X,
          y: 414,
          maxWidth: 300,
          fontSize: 32,
          minFontSize: 20,
          weight: "800",
          color: "#172B4D",
        });
      }

      setReady(true);
    } catch (err) {
      console.error("ArcadeSharePoster:", err);
      setError("We couldn't generate your poster.");
    }
  }, [name, arcadePoints, prizeTier]);

  /* =======================================================
     REGENERATE WHEN DATA CHANGES
     ======================================================= */

  useEffect(() => {
    generatePoster();
  }, [generatePoster]);

  /* =======================================================
     ESC CLOSE
     ======================================================= */

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  /* =======================================================
     DOWNLOAD
     ======================================================= */

  const downloadPoster = async () => {
    if (!canvasRef.current || !ready) return;

    try {
      const blob = await canvasToBlob(canvasRef.current);

      const url = URL.createObjectURL(blob);

      const safeName =
        name
          ?.trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 60) || "user";

      const link = document.createElement("a");

      link.href = url;

      link.download = `arcade-nexus-${safeName}-${arcadePoints}-points.png`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      setError("Download failed. Please try again.");
    }
  };

  /* =======================================================
     SHARE
     ======================================================= */

  const sharePoster = async () => {
    if (!canvasRef.current || !ready) return;

    if (!navigator.share || !navigator.canShare) {
      await downloadPoster();
      return;
    }

    setSharing(true);

    try {
      const blob = await canvasToBlob(canvasRef.current);

      const file = new File(
        [blob],
        "arcade-nexus-progress.png",
        {
          type: "image/png",
        }
      );

      const shareText =
        `My Google Cloud Arcade progress on Arcade Nexus.\n\n` +
        `Arcade Points: ${
          Number.isFinite(arcadePoints) ? arcadePoints : 0
        }` +
        (prizeTier ? `\nPrize Tier: ${prizeTier}` : "") +
        `\n\nTrack your progress:\n${WEBSITE}`;

      if (!navigator.canShare({ files: [file] })) {
        await downloadPoster();
        return;
      }

      await navigator.share({
        files: [file],
        title: "My Arcade Nexus Progress",
        text: shareText,
      });
    } catch (err: unknown) {
      const shareError = err as { name?: string };

      if (shareError?.name === "AbortError") {
        return;
      }

      console.error("Sharing failed:", err);

      setError(
        "Sharing failed. You can still download the poster."
      );
    } finally {
      setSharing(false);
    }
  };

  /* =======================================================
     UI
     ======================================================= */

  return (
    <div
      className="
        fixed inset-0 z-[100]
        flex items-center justify-center
        bg-black/60
        backdrop-blur-sm
        p-3
        sm:p-4
      "
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-xl
          max-h-[90vh]
          overflow-y-auto
          overflow-x-hidden
          rounded-2xl
          border
          border-gray-200
          bg-white
          shadow-[0_25px_80px_rgba(0,0,0,0.28)]
        "
      >
        {/* HEADER */}

        <div
          className="
            flex
            items-center
            justify-between
            border-b
            border-gray-100
            px-4
            py-3
            sm:px-5
            sm:py-3.5
          "
        >
          <div className="min-w-0">
            <h2
              className="
                truncate
                text-base
                font-bold
                text-gray-900
                sm:text-lg
              "
            >
              Share Your Progress
            </h2>

            <p className="mt-0.5 hidden text-xs text-gray-500 sm:block">
              Journey, Points, Milestone.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close poster"
            className="
              ml-3
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-full
              text-lg
              text-gray-500
              transition
              hover:bg-gray-100
              hover:text-gray-900
            "
          >
            ×
          </button>
        </div>

        {/* BODY */}

        <div className="p-3 sm:p-4">

          {/* POSTER */}

          <div
            className="
              overflow-hidden
              rounded-xl
              border
              border-gray-200
              bg-white
              shadow-sm
            "
          >
            <div className="relative aspect-[16/9] w-full">

              <canvas
                ref={canvasRef}
                width={WIDTH}
                height={HEIGHT}
                className="block h-full w-full object-contain"
                role="img"
                aria-label={`Arcade progress poster for ${
                  name || "participant"
                }`}
              />

              {/* LOADING */}

              {!ready && !error && (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-white/90
                    backdrop-blur-sm
                  "
                >
                  <div
                    className="
                      rounded-full
                      border
                      border-gray-200
                      bg-white
                      px-4
                      py-2
                      text-xs
                      font-medium
                      text-gray-700
                      shadow-sm
                    "
                  >
                    Generating your poster…
                  </div>
                </div>
              )}

              {/* ERROR */}

              {error && (
                <div
                  className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-white/95
                    p-4
                  "
                >
                  <div className="text-center">

                    <p className="text-xs font-medium text-gray-800 sm:text-sm">
                      {error}
                    </p>

                    <button
                      type="button"
                      onClick={generatePoster}
                      className="
                        mt-2
                        rounded-lg
                        bg-gray-900
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-gray-800
                      "
                    >
                      Try Again
                    </button>

                  </div>
                </div>
              )}

            </div>
          </div>

          {/* BUTTONS */}

          <div className="mt-3 grid grid-cols-1 gap-2.5 sm:grid-cols-2">

            <button
              type="button"
              onClick={downloadPoster}
              disabled={!ready}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-gradient-to-r
                from-indigo-600
                via-purple-600
                to-pink-600
                px-4
                py-2.5
                text-sm
                font-bold
                text-white
                shadow-md
                shadow-indigo-500/20
                transition
                hover:-translate-y-0.5
                hover:shadow-lg
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              ↓&nbsp; Download Poster
            </button>

            <button
              type="button"
              onClick={sharePoster}
              disabled={!ready || sharing}
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-4
                py-2.5
                text-sm
                font-bold
                text-gray-900
                transition
                hover:-translate-y-0.5
                hover:bg-gray-100
                hover:shadow-sm
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {sharing ? "Sharing…" : "↗ Share Poster"}
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}