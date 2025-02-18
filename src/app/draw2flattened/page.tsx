"use client";

import { useState, useRef, useEffect } from "react";

// Pen Icon Component
const PenIcon = ({ selected }: { selected: boolean }) => (
  <svg
    className={`w-6 h-6 ${selected ? "text-blue-500" : "text-gray-600"}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

// Eraser Icon Component
const EraserIcon = ({ selected }: { selected: boolean }) => (
  <svg
    className={`w-6 h-6 ${selected ? "text-blue-500" : "text-gray-600"}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

// Palette Icon Component
const PaletteIcon = () => (
  <svg
    className="w-6 h-6 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12h4a4 4 0 01-4 4H7zM15 5a2 2 0 012-2h4a2 2 0 012 2v12h-4M7 7h.01M11 7h.01"
    />
  </svg>
);

// Save Icon Component
const SaveIcon = () => (
  <svg
    className="w-6 h-6 text-gray-600"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
);

/**
 * Flattening the Canvas
 * @description: Captures the current drawing, redraws the background color, and flattens all drawing layers into one single canvas
 */
const flattenCanvas = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  canvasColor: string
) => {
  if (!canvasRef.current) return;
  const canvas = canvasRef.current;
  const ctx = canvas.getContext("2d");

  // Draw background first
  ctx!.fillStyle = canvasColor;
  ctx!.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the existing image over it (flatten the image)
  const tempImg = new Image();
  tempImg.src = canvas.toDataURL("image/png"); // Capture current drawing as a PNG
  tempImg.onload = () => {
    ctx!.drawImage(tempImg, 0, 0, canvas.width, canvas.height); // Redraw it as a single layer
  };
};

/**
 * Main Drawing Page Component
 * Implements canvas drawing functionality with tools and export
 */
export default function DrawingPage() {
  // State Management
  const [selectedTool, setSelectedTool] = useState<"pen" | "eraser">("pen");
  const [canvasColor, setCanvasColor] = useState("#897ACB");
  const [penColor, setPenColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasColorInputRef = useRef<HTMLInputElement>(null);
  const penColorInputRef = useRef<HTMLInputElement>(null);

  // Canvas Setup Effect
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Configure drawing context
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        setContext(ctx);
      }
      // Set canvas dimensions to match display size
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      /*  To set the canvas size to represent a 52-inch TV screen 
     (1.32m by 0.74m) at a 96 PPI, 
     the canvas dimensions in pixels would be: */

      /*  canvas.width = 4992;
canvas.height = 2808;

*/
    }
  }, []);

  /**
   * Handles mouse/touch start events for drawing
   * @param e - Mouse or touch event
   */
  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    if (context && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      context.beginPath();
      context.moveTo(clientX - rect.left, clientY - rect.top);
      setIsDrawing(true);
    }
  };

  /**
   * Handles drawing motion events
   * @param e - Mouse or touch event
   */
  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    const rect = canvasRef.current!.getBoundingClientRect();
    // Set stroke properties based on selected tool
    context.strokeStyle = selectedTool === "eraser" ? canvasColor : penColor;
    context.lineWidth = selectedTool === "eraser" ? 20 : 5;
    // Draw line segment
    context.lineTo(clientX - rect.left, clientY - rect.top);
    context.stroke();
  };

  /**
   * Handles canvas background color change
   * @param e - Color input change event
   */
  const handleCanvasColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasColor(e.target.value);
  };

  /**
   * Handles pen color change
   * @param e - Color input change event
   */
  const handlePenColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPenColor(e.target.value);
  };

  /**
   * Save the current drawing as an SVG
   * @description: Calls flattenCanvas() to ensure the drawing is flattened before export
   */
  const saveAsSVG = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    flattenCanvas(canvasRef, canvasColor); // Pass canvasRef to flattenCanvas

    const dataURL = canvas.toDataURL("image/png");

    // Create SVG with embedded background
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" 
           xmlns:xlink="http://www.w3.org/1999/xlink"
           width="${canvas.width}" 
           height="${canvas.height}">
        <rect width="100%" height="100%" fill="${canvasColor}"/>
        <!-- Embedding the PNG image -->
        <image xlink:href="${dataURL}" width="100%" height="100%" preserveAspectRatio="none"/>
      </svg>`;

    // Universal mobile handling
    if (/(iPhone|iPad|iPod|Android)/i.test(navigator.userAgent)) {
      const mobileUrl = URL.createObjectURL(
        new Blob([svgContent], { type: "image/svg+xml" })
      );
      const newWindow = window.open(mobileUrl, "_blank");

      // Fallback if popup blocked
      if (!newWindow) {
        const link = document.createElement("a");
        link.href = mobileUrl;
        link.target = "_blank";
        link.style.display = "none";
        document.body.appendChild(link);

        if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
          alert(
            '1. Tap the share icon\n2. Select "Save to Files"\n3. Choose location'
          );
        }
        link.click();
        document.body.removeChild(link);
      }

      // Cleanup after delay
      setTimeout(() => URL.revokeObjectURL(mobileUrl), 30000);
    } else {
      // Desktop download
      const link = document.createElement("a");
      link.download = "drawing.svg";
      link.href = URL.createObjectURL(
        new Blob([svgContent], { type: "image/svg+xml" })
      );
      link.click();
      URL.revokeObjectURL(link.href);
    }
  };

  /**
   * Saves the canvas as a PNG image, including the background and the drawing.
   */
  const saveAsPNG = () => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Create a new temporary canvas to combine background and drawing
    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");

    if (tempCtx) {
      // Set the dimensions of the temporary canvas to match the original
      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;

      // First, fill the temporary canvas with the background color (or the ground)
      tempCtx.fillStyle = canvasColor; // Use the selected background color
      tempCtx.fillRect(0, 0, canvas.width, canvas.height);

      // Now, draw the current canvas content (the drawing) over the background
      const dataURL = canvas.toDataURL("image/png");
      const tempImg = new Image();
      tempImg.src = dataURL;
      tempImg.onload = () => {
        tempCtx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);

        // Now we can download the image as PNG
        const link = document.createElement("a");
        link.href = tempCanvas.toDataURL("image/png");
        link.download = "drawing.png"; // Name the downloaded file
        link.click();
      };
    }
  };

  // Function to save canvas as JPEG
  const saveAsJPEG = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    // Create a data URL of the canvas in JPEG format
    const dataURL = canvas.toDataURL("image/jpeg", 0.9); // Quality set to 0.9 for better quality (range: 0-1)

    // Create a temporary link to download the image
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "drawing.jpg"; // Name of the file being saved
    link.click();
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Canvas Area */}
      <div
        className="flex-1 relative pb-[84px]"
        style={{
          backgroundColor: canvasColor,
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseUp={() => setIsDrawing(false)}
          onMouseMove={handleDraw}
          onTouchStart={startDrawing}
          onTouchEnd={() => setIsDrawing(false)}
          onTouchMove={handleDraw}
        />
      </div>

      {/* Bottom Toolbar */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 border-t flex gap-4 items-center justify-center"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          height: "84px",
        }}
      >
        <label className="relative cursor-pointer">
          <input
            type="color"
            ref={penColorInputRef}
            className="absolute opacity-0 w-0 h-0"
            value={penColor}
            onChange={handlePenColorChange}
          />
          <div
            onClick={() => setSelectedTool("pen")}
            className={`p-2 rounded-lg ${
              selectedTool === "pen" ? "bg-blue-100" : "bg-white"
            }`}
          >
            <PenIcon selected={selectedTool === "pen"} />
          </div>
        </label>
        <label className="relative cursor-pointer">
          <input
            type="color"
            ref={canvasColorInputRef}
            className="absolute opacity-0 w-0 h-0"
            value={canvasColor}
            onChange={handleCanvasColorChange}
          />
          <div className="p-2 rounded-lg bg-white hover:bg-gray-50">
            <PaletteIcon />
          </div>
        </label>
        <button
          onClick={() => setSelectedTool("eraser")}
          className={`p-2 rounded-lg ${
            selectedTool === "eraser" ? "bg-blue-100" : "bg-white"
          }`}
        >
          <EraserIcon selected={selectedTool === "eraser"} />
        </button>
        <button
          onClick={saveAsSVG}
          onTouchEnd={saveAsSVG} // Mobile touch support
          className="p-2 rounded-lg bg-white hover:bg-gray-50"
        >
          <SaveIcon />
        </button>
        <button
          onClick={saveAsPNG} // Trigger saveAsPNG function
          className="p-2 rounded-lg bg-blue-500 text-white hover:bg-blue-600"
        >
          💾PNG
        </button>

        <button
          onClick={saveAsJPEG} // Trigger saveAsJPEG when clicked
          className="p-2 rounded-lg bg-green-500  hover:bg-gray-50"
        >
          💾JPEG
        </button>
      </div>
    </div>
  );
}
