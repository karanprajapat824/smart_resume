import React, { useEffect, useMemo, useRef, useState } from "react";


export type GalleryItem = { image: string; alt?: string };

export type CircularGalleryProps = {
  items: GalleryItem[];
  /** Horizontal size of each card (px). */
  cardWidth?: number;
  /** Vertical size of each card (px). */
  cardHeight?: number;
  /** Corner radius in CSS units. */
  borderRadius?: string;
  /** Gap between cards (px) along the arc. */
  gap?: number;
  /** Radius of the arc (px). */
  radius?: number;
  /** How many items to render around the center (for perf). */
  visibleCount?: number;
  /** Drag speed multiplier. */
  dragSpeed?: number;
  /** Wheel sensitivity. */
  wheelSpeed?: number;
  /** Lerp factor for easing (0..1). Lower is smoother. */
  ease?: number;
  /** Autoplay degrees per second (can be negative for reverse). */
  autoplayDps?: number;
  /** Pause autoplay on pointer hover. */
  pauseOnHover?: boolean;
  /** Optional click handler */
  onItemClick?: (index: number) => void;
  className?: string;
};

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export default function CircularGallery({
  items,
  cardWidth = 260,
  cardHeight = 180,
  borderRadius = "12px",
  gap = 24,
  radius = 320,
  visibleCount = 11,
  dragSpeed = 0.35,
  wheelSpeed = 0.02,
  ease = 0.12,
  autoplayDps = 0,
  pauseOnHover = true,
  onItemClick,
  className,
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);

  // Angle between adjacent cards along the arc (radians)
  const step = useMemo(() => {
    // Approximate angular width of a card + gap along the circle
    const arcLen = cardWidth + gap; // px along circumference
    return arcLen / radius; // radians per item
  }, [cardWidth, gap, radius]);

  // Total visible on each side of the center
  const half = Math.floor(clamp(visibleCount, 3, 51) / 2);

  // Center index in logical space
  const [centerIdx, setCenterIdx] = useState(0);
  const targetAngleRef = useRef(0); // radians
  const currentAngleRef = useRef(0); // radians
  const velRef = useRef(0); // for fling/inertia
  const rafRef = useRef<number | null>(null);
  const isPointerDownRef = useRef(false);
  const pointerXRef = useRef(0);

  // Normalize index to [0, n)
  const mod = (n: number, m: number) => ((n % m) + m) % m;

  // Compute world positions for -half..+half around the center
  const indices = useMemo(() => Array.from({ length: 2 * half + 1 }, (_, i) => i - half), [half]);

  // Animation loop
  useEffect(() => {
    const tick = (time: number) => {
      // Autoplay (degrees/sec -> radians/frame)
      if (autoplayDps !== 0 && !(pauseOnHover && hovered) && !isPointerDownRef.current) {
        targetAngleRef.current += (autoplayDps * Math.PI / 180) / 60;
      }

      // Ease current angle toward target
      const next = lerp(currentAngleRef.current, targetAngleRef.current, ease);
      const delta = next - currentAngleRef.current;
      currentAngleRef.current = next;

      // Derive a fractional shift in index space from angle change
      const indexShift = delta / step;
      if (Math.abs(indexShift) > 0.0001) {
        setCenterIdx(prev => prev + indexShift);
      }

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [autoplayDps, ease, pauseOnHover, hovered, step]);

  // Wheel (passive)
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      // convert wheel delta to angle
      const deltaAngle = e.deltaY * wheelSpeed * step;
      targetAngleRef.current += deltaAngle;
    };
    el.addEventListener("wheel", onWheel, { passive: true });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, [step, wheelSpeed]);

  // Pointer drag
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDownRef.current = true;
      pointerXRef.current = e.clientX;
      velRef.current = 0;
      ;(e.target as Element).setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      const dx = e.clientX - pointerXRef.current;
      pointerXRef.current = e.clientX;
      // Map pixels to angle roughly by relating dx to arc length
      const deltaAngle = -dx * dragSpeed * (step / (cardWidth + gap));
      targetAngleRef.current += deltaAngle;
      velRef.current = deltaAngle; // last delta for inertia
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;
      // Fling inertia: keep a bit of the last motion
      targetAngleRef.current += velRef.current * 8; // damped fling
      velRef.current = 0;
    };

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, [cardWidth, gap, dragSpeed, step]);

  // hover state for autoplay pause
  const hoverBind = pauseOnHover
    ? {
        onPointerEnter: () => setHovered(true),
        onPointerLeave: () => setHovered(false),
      }
    : undefined;

  // Precompute transforms for visible items
  const rendered = useMemo(() => {
    const n = items.length;
    if (n === 0) return [] as Array<{
      key: string; index: number; style: React.CSSProperties; z: number
    }>;

    // logical center (fractional)
    const c = centerIdx;

    return indices.map((offset) => {
      // Which real item occupies this slot?
      // Pick the integer index nearest to c + offset
      const slotIndex = Math.round(c) + offset;
      const itemIndex = mod(slotIndex, n);

      // How far (in item steps) from the exact fractional center?
      const stepDelta = slotIndex - c; // can be fractional
      const theta = stepDelta * step; // radians along arc, 0 at center

      // Arc layout: x across, y bends up/down using cosine.
      const x = Math.sin(theta) * radius;
      const y = (1 - Math.cos(theta)) * radius * 0.45; // 0.45 controls curvature strength

      // Depth and scale for a subtle parallax (cheaper than real 3D)
      const depth = Math.cos(theta); // [-1..1]
      const scale = 0.9 + 0.1 * (depth + 1) / 2; // 0.9..1.0
      const zIndex = Math.round(1000 + depth * 100); // keep centered items on top

      const style: React.CSSProperties = {
        position: "absolute",
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
        left: `50%`,
        top: `50%`,
        transform: `translate3d(${x - cardWidth / 2}px, ${y - cardHeight / 2}px, 0) scale(${scale})`,
        willChange: "transform",
        borderRadius,
        overflow: "hidden",
        boxShadow: depth > 0.6 ? "0 8px 24px rgba(0,0,0,0.25)" : "0 2px 10px rgba(0,0,0,0.15)",
        zIndex,
        background: "#111",
      };

      return { key: `${slotIndex}:${itemIndex}`, index: itemIndex, style, z: zIndex };
    });
  }, [items, indices, centerIdx, step, radius, cardWidth, cardHeight, borderRadius]);

  return (
    <div
      ref={containerRef}
      className={
        "relative w-full h-full overflow-hidden touch-pan-y select-none" +
        (className ? ` ${className}` : "")
      }
      style={{
        cursor: isPointerDownRef.current ? "grabbing" : "grab",
        // perspective can add depth feel but costs a bit; keep it subtle.
        perspective: 1000,
        background: "transparent",
      }}
      {...hoverBind}
      role="region"
      aria-label="Circular image gallery"
    >
      {/* Center guide (optional) */}
      {/* <div className="absolute left-1/2 top-1/2 w-1 h-1 -translate-x-1/2 -translate-y-1/2 bg-pink-500 rounded-full" /> */}

      {rendered.map(({ key, index, style }) => (
        <button
          key={key}
          type="button"
          onClick={() => onItemClick?.(index)}
          className="group block p-0 m-0 border-0 bg-transparent"
          style={style}
          aria-label={`Image ${index + 1}`}
        >
          <img
            src={items[index].image}
            alt={items[index].alt ?? ""}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover"
            draggable={false}
            style={{ display: "block" }}
          />
        </button>
      ))}

      {/* Accessibility hint
      <div
        className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 text-xs text-white/50"
        aria-hidden
      >
        
      </div> */}
    </div>
  );
}
