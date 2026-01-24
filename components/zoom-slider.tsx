"use client";

import { useEffect, useState } from "react";
import { ZoomIn, ZoomOut } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "ui-zoom-level";
const DEFAULT_ZOOM = 125;
const MIN_ZOOM = 100;
const MAX_ZOOM = 200;
const STEP = 5;

export function ZoomSlider() {
  const [zoom, setZoom] = useState(DEFAULT_ZOOM);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage and apply initial zoom
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    const initialZoom = stored ? parseInt(stored, 10) : DEFAULT_ZOOM;

    // The code is not doing anything that is not safe to do in an effect, so we can disable the rule
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setZoom(initialZoom);
    document.documentElement.style.zoom = `${initialZoom}%`;
    setMounted(true);
  }, []);

  // Apply zoom and persist to localStorage
  const applyZoom = (newZoom: number) => {
    const clamped = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, newZoom));
    setZoom(clamped);
    document.documentElement.style.zoom = `${clamped}%`;
    localStorage.setItem(STORAGE_KEY, String(clamped));
  };

  const handleZoomChange = (value: number[]) => {
    applyZoom(value[0]);
  };

  // Prevent hydration mismatch
  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => applyZoom(zoom - STEP)}
        disabled={zoom <= MIN_ZOOM}
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Slider
        value={[zoom]}
        onValueChange={handleZoomChange}
        min={MIN_ZOOM}
        max={MAX_ZOOM}
        step={STEP}
        className="w-24"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7"
        onClick={() => applyZoom(zoom + STEP)}
        disabled={zoom >= MAX_ZOOM}
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <span className="bg-muted min-w-12 rounded-md px-2 py-0.5 text-center text-xs font-medium">
        {zoom}%
      </span>
    </div>
  );
}
