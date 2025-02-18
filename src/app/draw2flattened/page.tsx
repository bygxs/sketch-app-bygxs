// src/app/draw2/page.tsx

"use client";

import { useState, useRef, useEffect } from "react";

/**
 * Pen Icon Component
 * @param selected - Boolean indicating if the pen tool is currently selected
 * @returns SVG pen icon with conditional coloring
 */
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

/**
 * Eraser Icon Component
 * @param selected - Boolean indicating if the eraser tool is currently selected
 * @returns SVG eraser icon with conditional coloring
 */
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

/**
 * Palette Icon Component
 * @returns SVG palette icon for canvas color selection
 */
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

/**
 * Save Icon Component
 * @returns SVG save icon for export functionality
 */
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
   * Flattens the canvas by drawing the background first and then the content
   * @returns void
   * This function captures the current drawing and adds it to the background
   */
  const flattenCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Draw background first
    ctx.fillStyle = canvasColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the existing image over it
    const tempImg = new Image();
    tempImg.src = canvas.toDataURL("image/png"); // Capture current drawing
    tempImg.onload = () => {
      ctx.drawImage(tempImg, 0, 0, canvas.width, canvas.height);
    };
  };

  /**
   * Save the current drawing as an SVG containing the PNG image
   */
  const saveAsSVG = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png"); // Capture current drawing as PNG

    // Create SVG with embedded background and PNG image
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" 
           xmlns:xlink="http://www.w3.org/1999/xlink"
           width="${canvas.width}" 
           height="${canvas.height}">
        <rect width="100%" height="100%" fill="${canvasColor}"/>

        <!-- Embedding the PNG image -->
        <image xlink:href="${dataURL}" width="100%" height="100%" preserveAspectRatio="none"/>
      </svg>`;

    // Mobile handling for SVG download
    if (/(iPhone|iPad|iPod|Android)/i.test(navigator.userAgent)) {
      const mobileUrl = URL.createObjectURL(
        new Blob([svgContent], { type: "image/svg+xml" })
      );
      const newWindow = window.open(mobileUrl, "_blank");

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

      setTimeout(() => URL.revokeObjectURL(mobileUrl), 30000);
    } else {
      // Desktop download for SVG
      const link = document.createElement("a");
      link.download = "drawing.svg";
      link.href = URL.createObjectURL(
        new Blob([svgContent], { type: "image/svg+xml" })
      );
      link.click();
      URL.revokeObjectURL(link.href);
    }
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

      {/* Fixed Bottom Toolbar */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 border-t flex gap-4 items-center justify-center"
        style={{
          paddingBottom: "env(safe-area-inset-bottom)",
          height: "84px",
        }}
      >
        {/* Pen Tool */}
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

        {/* Canvas Color Picker */}
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

        {/* Eraser Tool */}
        <button
          onClick={() => setSelectedTool("eraser")}
          className={`p-2 rounded-lg ${
            selectedTool === "eraser" ? "bg-blue-100" : "bg-white"
          }`}
        >
          <EraserIcon selected={selectedTool === "eraser"} />
        </button>

        {/* Save Button */}
        <button
          onClick={saveAsSVG}
          onTouchEnd={saveAsSVG}
          className="p-2 rounded-lg bg-white hover:bg-gray-50"
        >
          <SaveIcon />
        </button>
      </div>
    </div>
  );
}
