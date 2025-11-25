import React, { useEffect, useMemo, useRef, useState } from "react";


export type GalleryItem = { image: string; alt?: string };

export type CircularGalleryProps = {
  items: GalleryItem[];
  cardWidth?: number;
  cardHeight?: number;
  borderRadius?: string;
  gap?: number;
  radius?: number;
  visibleCount?: number;
  dragSpeed?: number;
  wheelSpeed?: number;
  ease?: number;
  autoplayDps?: number;
  pauseOnHover?: boolean;
  onItemClick?: (index: number) => void;
  className?: string;
  wheelBehavior?: "none" | "hover" | "always";
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
  wheelBehavior = "hover",
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [hovered, setHovered] = useState(false);

  const step = useMemo(() => {
    const arcLen = cardWidth + gap;
    return arcLen / radius;
  }, [cardWidth, gap, radius]);

  const half = Math.floor(clamp(visibleCount, 3, 51) / 2);

  const [centerIdx, setCenterIdx] = useState(0);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const velRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const isPointerDownRef = useRef(false);
  const pointerXRef = useRef(0);

  const mod = (n: number, m: number) => ((n % m) + m) % m;

  const indices = useMemo(() => Array.from({ length: 2 * half + 1 }, (_, i) => i - half), [half]);


  useEffect(() => {
    const tick = (time: number) => {
      if (autoplayDps !== 0 && !(pauseOnHover && hovered) && !isPointerDownRef.current) {
        targetAngleRef.current += (autoplayDps * Math.PI / 180) / 60;
      }

      const next = lerp(currentAngleRef.current, targetAngleRef.current, ease);
      const delta = next - currentAngleRef.current;
      currentAngleRef.current = next;

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

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const shouldHandle = (e: WheelEvent) => {
      if (wheelBehavior === "none") return false;
      if (wheelBehavior === "always") return true;
      return hovered;
    };

    const onWheel = (e: WheelEvent) => {
      if (!shouldHandle(e)) return; 
      e.preventDefault(); 
      const deltaAngle = e.deltaY * wheelSpeed * step;
      targetAngleRef.current += deltaAngle;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel as any);
  }, [step, wheelSpeed, wheelBehavior, hovered]);


  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      isPointerDownRef.current = true;
      pointerXRef.current = e.clientX;
      velRef.current = 0;
      ; (e.target as Element).setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      const dx = e.clientX - pointerXRef.current;
      pointerXRef.current = e.clientX;
      const deltaAngle = -dx * dragSpeed * (step / (cardWidth + gap));
      targetAngleRef.current += deltaAngle;
      velRef.current = deltaAngle;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      isPointerDownRef.current = false;
      targetAngleRef.current += velRef.current * 8;
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

  const hoverBind = pauseOnHover
    ? {
      onPointerEnter: () => setHovered(true),
      onPointerLeave: () => setHovered(false),
    }
    : undefined;

  const rendered = useMemo(() => {
    const n = items.length;
    if (n === 0) return [] as Array<{
      key: string; index: number; style: React.CSSProperties; z: number
    }>;

    const c = centerIdx;

    return indices.map((offset) => {
      const slotIndex = Math.round(c) + offset;
      const itemIndex = mod(slotIndex, n);

      const stepDelta = slotIndex - c;
      const theta = stepDelta * step;

      const x = Math.sin(theta) * radius;
      const y = (1 - Math.cos(theta)) * radius * 0.45;
      const depth = Math.cos(theta);
      const scale = 0.9 + 0.1 * (depth + 1) / 2;
      const zIndex = Math.round(1000 + depth * 100);

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
        perspective: 1000,
        background: "transparent",
      }}
      {...hoverBind}
      role="region"
      aria-label="Circular image gallery"
    >
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
    </div>
  );
}
