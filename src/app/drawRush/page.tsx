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

export default function DrawingPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<"pen" | "eraser">("pen");
  const [canvasColor, setCanvasColor] = useState("#897ACB");
  const [penColor, setPenColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // Canvas setup effect
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        setContext(ctx);
      }
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    if (context && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      context.beginPath();
      context.moveTo(clientX - rect.left, clientY - rect.top);
      setIsDrawing(true);
    }
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !context) return;
    const { clientX, clientY } = "touches" in e ? e.touches[0] : e;
    const rect = canvasRef.current!.getBoundingClientRect();
    context.strokeStyle = selectedTool === "eraser" ? canvasColor : penColor;
    context.lineWidth = selectedTool === "eraser" ? 20 : 5;
    context.lineTo(clientX - rect.left, clientY - rect.top);
    context.stroke();
  };

  const handleCanvasColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCanvasColor(e.target.value);
  };

  const handlePenColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPenColor(e.target.value);
  };

  const saveCanvasState = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const snapshot = canvas.toDataURL();
    setHistory((prevHistory) => {
      const newHistory = [
        ...prevHistory.slice(0, historyIndex + 1),
        snapshot,
      ];
      if (newHistory.length > 50) newHistory.shift();
      return newHistory;
    });
    setHistoryIndex(historyIndex + 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      const previousState = history[historyIndex - 1];
      loadCanvasState(previousState);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      const nextState = history[historyIndex + 1];
      loadCanvasState(nextState);
    }
  };

  const loadCanvasState = (state: string) => {
    const img = new Image();
    img.src = state;
    img.onload = () => {
      const ctx = canvasRef.current?.getContext("2d");
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx?.drawImage(img, 0, 0);
    };
  };

  const saveAsPNG = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = "drawing.png";
    link.href = dataURL;
    link.click();
  };

  const saveAsSVG = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataURL = canvas.toDataURL("image/png");
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
      <svg xmlns="http://www.w3.org/2000/svg" 
           xmlns:xlink="http://www.w3.org/1999/xlink"
           width="${canvas.width}" 
           height="${canvas.height}">
        <rect width="100%" height="100%" fill="${canvasColor}"/>
        <image xlink:href="${dataURL}" width="100%" height="100%" preserveAspectRatio="none"/>
      </svg>`;
    const link = document.createElement("a");
    link.download = "drawing.svg";
    link.href = URL.createObjectURL(
      new Blob([svgContent], { type: "image/svg+xml" })
    );
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
        {/* Pen Tool */}
        <label className="relative cursor-pointer">
          <input
            type="color"
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
        <button onClick={saveAsPNG} className="p-2 rounded-lg bg-white hover:bg-gray-50">
          <SaveIcon />
        </button>

        {/* Undo/Redo Buttons */}
        <button onClick={undo} className="p-2 rounded-lg bg-white hover:bg-gray-50">
          Undo
        </button>
        <button onClick={redo} className="p-2 rounded-lg bg-white hover:bg-gray-50">
          Redo
        </button>
      </div>
    </div>
  );
}
