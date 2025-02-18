"use client";
import { useState } from "react";

export default function DrawingPage() {
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  const saveCanvasState = () => {
    
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const snapshot = canvas.toDataURL(); // Capture current state
    setHistory((prevHistory) => {
      const newHistory = [...prevHistory.slice(0, historyIndex + 1), snapshot]; // Avoid storing in the middle
      if (newHistory.length > 50) newHistory.shift(); // Keep history size manageable
      return newHistory;
    });
    setHistoryIndex(historyIndex + 1); // Move forward in history
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

  return (
    <div className="h-screen flex flex-col">
      {/* Canvas area */}
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

      {/* Toolbar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gray-100 border-t flex gap-4 items-center justify-center">
        {/* Save/Export Buttons */}
        <button onClick={saveAsPNG}>Save PNG</button>
        <button onClick={saveAsSVG}>Save SVG</button>

        {/* Undo/Redo */}
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
      </div>
    </div>
  );
}
