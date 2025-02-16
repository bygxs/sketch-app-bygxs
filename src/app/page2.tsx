"use client";
import { useState, useRef, useEffect } from "react";

// Icons with proper touch targets ============================================
const PenIcon = ({ selected }: { selected: boolean }) => (
  <svg
    className={`w-12 h-12 ${selected ? "text-blue-600" : "text-gray-700"}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
);

const EraserIcon = ({ selected }: { selected: boolean }) => (
  <svg
    className={`w-12 h-12 ${selected ? "text-blue-600" : "text-gray-700"}`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M5 19h14L12 6 5 19zm7-12.27L17.27 17H6.73L12 6.73z"
    />
  </svg>
);

const ColorPaletteIcon = () => (
  <svg
    className="w-12 h-12 text-gray-700"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19.14 7.5A3.5 3.5 0 0 1 16.5 2h-9A3.5 3.5 0 0 0 4 5.5v13A3.5 3.5 0 0 0 7.5 22h9a3.5 3.5 0 0 0 3.5-3.5V11l-5.86-3.5z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16.5 17.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
    />
  </svg>
);

const SaveIcon = () => (
  <svg
    className="w-12 h-12 text-gray-700"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
    />
  </svg>
);

// Main Component ==============================================================
export default function DrawingPage() {
  // State & Refs
  const [selectedTool, setSelectedTool] = useState("pen");
  const [canvasColor, setCanvasColor] = useState("#897ACB");
  const [penColor, setPenColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);

  // Mobile-optimized color inputs
  const penColorInputRef = useRef<HTMLInputElement>(null);
  const canvasColorInputRef = useRef<HTMLInputElement>(null);

  // Canvas Setup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // High-DPI setup
    const scale = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * scale;
    canvas.height = rect.height * scale;

    ctx.scale(scale, scale);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    contextRef.current = ctx;
  }, []);

  // Unified Input Handling ====================================================
  const getCanvasPosition = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;

    return {
      x: (clientX - rect.left) * scale,
      y: (clientY - rect.top) * scale,
    };
  };

  const startDrawing = (e: TouchEvent | MouseEvent) => {
    e.preventDefault();
    const ctx = contextRef.current;
    if (!ctx) return;

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const pos = getCanvasPosition(clientX, clientY);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e: TouchEvent | MouseEvent) => {
    e.preventDefault();
    if (!isDrawing || !contextRef.current) return;

    const ctx = contextRef.current;
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const pos = getCanvasPosition(clientX, clientY);
    ctx.strokeStyle = selectedTool === "eraser" ? canvasColor : penColor;
    ctx.lineWidth = selectedTool === "eraser" ? 40 : 8;

    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  // Mobile-optimized Event Listeners ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Touch handlers
    const handleTouchStart = (e: TouchEvent) => startDrawing(e);
    const handleTouchMove = (e: TouchEvent) => draw(e);
    const handleTouchEnd = () => setIsDrawing(false);

    // Mouse handlers
    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = () => setIsDrawing(false);

    // Add event listeners
    canvas.addEventListener("touchstart", handleTouchStart, { passive: false });
    canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    canvas.addEventListener("touchend", handleTouchEnd);
    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);

    return () => {
      canvas.removeEventListener("touchstart", handleTouchStart);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDrawing, selectedTool, penColor, canvasColor]);

  // Toolbar Components ========================================================
  const ColorPicker = ({
    type,
    color,
    onChange,
  }: {
    type: "pen" | "canvas";
    color: string;
    onChange: (color: string) => void;
  }) => (
    <label className="relative block">
      <input
        type="color"
        ref={type === "pen" ? penColorInputRef : canvasColorInputRef}
        className="absolute w-1 h-1 opacity-0 overflow-hidden"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
      {type === "pen" ? (
        <div
          className={`p-2 ${
            selectedTool === "pen" ? "bg-blue-100 rounded-lg" : ""
          }`}
          onClick={() => setSelectedTool("pen")}
        >
          <PenIcon selected={selectedTool === "pen"} />
        </div>
      ) : (
        <div className="p-2">
          <ColorPaletteIcon />
        </div>
      )}
    </label>
  );

  return (
    <div className="h-screen flex flex-col touch-none select-none">
      {/* Canvas */}
      <div
        className="flex-1 relative bg-[#897ACB]"
        style={{ backgroundColor: canvasColor }}
      >
        <canvas ref={canvasRef} className="w-full h-full touch-none" />
      </div>

      {/* Mobile-first Toolbar */}
      <div className="p-2 bg-gray-100 border-t flex justify-around items-center">
        <ColorPicker type="pen" color={penColor} onChange={setPenColor} />

        <button
          className={`p-2 ${
            selectedTool === "eraser" ? "bg-blue-100 rounded-lg" : ""
          }`}
          onClick={() => setSelectedTool("eraser")}
        >
          <EraserIcon selected={selectedTool === "eraser"} />
        </button>

        <ColorPicker
          type="canvas"
          color={canvasColor}
          onChange={setCanvasColor}
        />

        <button
          className="p-2 active:opacity-70 transition-opacity"
          onClick={() => {
            if (!canvasRef.current) return;
            // SVG save implementation from previous version
          }}
        >
          <SaveIcon />
        </button>
      </div>
    </div>
  );
}
