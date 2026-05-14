"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useInView } from "../hooks/useInView";
import { useTypewriter } from "../hooks/useTypewriter";

type Tech = {
  _id: string;
  name: string;
  logo: string;
};

type Vec2 = { x: number; y: number };

/* ─── Clean file-folder mascot (REFFY style) with idle blink ─── */
function FolderMascot({
  globalMouseX,
  globalMouseY,
  size = 64,
}: {
  globalMouseX: number;
  globalMouseY: number;
  size?: number;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const centerRef = useRef<Vec2>({ x: 0, y: 0 });

  useEffect(() => {
    const measure = () => {
      if (!svgRef.current) return;
      const r = svgRef.current.getBoundingClientRect();
      centerRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    };
    measure();
    window.addEventListener("scroll", measure, { passive: true });
    const obs = new ResizeObserver(measure);
    if (svgRef.current) obs.observe(svgRef.current);
    return () => {
      window.removeEventListener("scroll", measure);
      obs.disconnect();
    };
  }, []);

  const dx = globalMouseX - centerRef.current.x;
  const dy = globalMouseY - centerRef.current.y;
  const dist = Math.sqrt(dx * dx + dy * dy) || 1;
  const maxShift = 3;
  const px = (dx / dist) * Math.min(maxShift, dist * 0.012);
  const py = (dy / dist) * Math.min(maxShift, dist * 0.012);

  const mouseX = globalMouseX;
  const mouseY = globalMouseY;

  const [blinking, setBlinking] = useState(false);
  const lastMouse = useRef({ x: mouseX, y: mouseY });
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blinkInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  const startBlinkLoop = useCallback(() => {
    if (blinkInterval.current) return;
    const doBlink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 150);
    };
    doBlink();
    blinkInterval.current = setInterval(doBlink, 3000);
  }, []);

  const stopBlinkLoop = useCallback(() => {
    setBlinking(false);
    if (blinkInterval.current) {
      clearInterval(blinkInterval.current);
      blinkInterval.current = null;
    }
    if (idleTimer.current) {
      clearTimeout(idleTimer.current);
      idleTimer.current = null;
    }
  }, []);

  useEffect(() => {
    const movedEnough =
      Math.abs(mouseX - lastMouse.current.x) > 2 ||
      Math.abs(mouseY - lastMouse.current.y) > 2;
    lastMouse.current = { x: mouseX, y: mouseY };

    if (movedEnough) {
      stopBlinkLoop();
      idleTimer.current = setTimeout(startBlinkLoop, 1500);
    }
  }, [mouseX, mouseY, startBlinkLoop, stopBlinkLoop]);

  useEffect(() => {
    startBlinkLoop();
    return () => stopBlinkLoop();
  }, [startBlinkLoop, stopBlinkLoop]);

  const eyeH = blinking ? 1.5 : 6;
  const eyeY = blinking ? 32.25 : 30;
  const eyeRx = blinking ? 0.75 : 1.2;

  return (
    <div className="flex flex-col items-center select-none">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Folder tab (top-left) */}
        <path
          d="M4 12 L4 4 Q4 2 6 2 L22 2 Q24 2 25 4 L28 10 Q29 12 31 12 L60 12 Q62 12 62 14 L62 12 Z"
          fill="var(--color-text)"
        />
        {/* Folder body */}
        <rect
          x="2"
          y="12"
          width="60"
          height="48"
          rx="3"
          fill="var(--color-text)"
        />

        {/* Left eye */}
        <rect
          x="20"
          y={eyeY}
          width="9"
          height={eyeH}
          rx={eyeRx}
          fill="var(--color-bg-stone)"
          style={{ transition: "y 0.08s ease, height 0.08s ease" }}
        />
        {!blinking && (
          <circle
            cx={24.5 + px}
            cy={33 + py}
            r="2.2"
            fill="var(--color-text)"
          />
        )}

        {/* Right eye */}
        <rect
          x="35"
          y={eyeY}
          width="9"
          height={eyeH}
          rx={eyeRx}
          fill="var(--color-bg-stone)"
          style={{ transition: "y 0.08s ease, height 0.08s ease" }}
        />
        {!blinking && (
          <circle
            cx={39.5 + px}
            cy={33 + py}
            r="2.2"
            fill="var(--color-text)"
          />
        )}

        {/* Mouth */}
        <rect
          x="27"
          y="42"
          width="10"
          height="2.5"
          rx="1"
          fill="var(--color-bg-stone)"
        />
      </svg>
      <div className="mt-1 bg-[var(--color-text)] px-2 py-0.5">
        <span className="text-[var(--color-bg-stone)] text-[8px] font-bold tracking-[0.18em] uppercase">
          AP_BOT
        </span>
      </div>
    </div>
  );
}

/* ─── Draggable popup window ─── */
function TechModal({
  tech,
  onClose,
}: {
  tech: Tech;
  onClose: () => void;
}) {
  const [pos, setPos] = useState<Vec2>({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef<Vec2>({ x: 0, y: 0 });

  const onDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setDragging(true);
    dragStart.current = { x: e.clientX - pos.x, y: e.clientY - pos.y };
  };

  useEffect(() => {
    if (!dragging) return;
    const onMove = (e: MouseEvent) => {
      setPos({
        x: e.clientX - dragStart.current.x,
        y: e.clientY - dragStart.current.y,
      });
    };
    const onUp = () => setDragging(false);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [dragging]);

  const code = tech.name.toUpperCase().replace(/[.\s]/g, "_");

  return (
    <div className="fixed inset-0 z-50" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute top-1/2 left-1/2 w-[480px] max-w-[92vw] bg-[#4A4A4A]/95 backdrop-blur-md shadow-2xl"
        style={{
          transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
        }}
      >
        {/* Header — draggable */}
        <div
          className="flex items-center gap-3 px-4 py-3 border-b border-[#5A5A5A] select-none"
          style={{ cursor: dragging ? "grabbing" : "grab" }}
          onMouseDown={onDown}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-[#5A5A5A] text-[#bbb] hover:text-white transition-colors text-sm"
          >
            ✕
          </button>
          <svg
            width="14"
            height="12"
            viewBox="0 0 14 12"
            fill="none"
            className="shrink-0"
          >
            <path
              d="M1 3 L1 1 Q1 0.5 1.5 0.5 L5 0.5 Q5.5 0.5 5.8 1 L6.5 2.5 Q6.8 3 7.3 3 L12.5 3 Q13 3 13 3.5 L13 11 Q13 11.5 12.5 11.5 L1.5 11.5 Q1 11.5 1 11 Z"
              fill="#999"
            />
          </svg>
          <span className="text-[#EDE8E2] text-[11px] font-medium tracking-[0.12em] uppercase">
            {tech.name}
          </span>
        </div>

        {/* Content grid */}
        <div className="p-4 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="w-full aspect-square bg-[#5A5A5A] flex items-center justify-center rounded-sm">
                  <img
                    src={tech.logo}
                    alt=""
                    className="w-10 h-10 object-contain"
                    style={{
                      filter:
                        i > 0
                          ? `hue-rotate(${i * 35}deg) brightness(${0.8 + i * 0.08})`
                          : "none",
                    }}
                  />
                </div>
                <span className="text-[8px] text-[#999] tracking-[0.14em] uppercase font-medium text-center">
                  {code}_{String(i + 1).padStart(2, "0")}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Gentle repulsion (subtle push, not flee) ─── */
function getRepulsion(
  elX: number,
  elY: number,
  mouseX: number,
  mouseY: number,
  radius: number,
  strength: number
): Vec2 {
  const dx = elX - mouseX;
  const dy = elY - mouseY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < radius && dist > 1) {
    const t = 1 - dist / radius;
    const force = t * t * strength;
    return { x: (dx / dist) * force, y: (dy / dist) * force };
  }
  return { x: 0, y: 0 };
}

/* ─── Node positions generator ─── */
function generatePositions(count: number, w: number, h: number): Vec2[] {
  const cx = w / 2;
  const cy = h / 2;
  const out: Vec2[] = [];
  const inner = Math.min(count, 6);
  const outer = Math.max(0, count - 6);
  const r1 = Math.min(w, h) * 0.24;
  const r2 = Math.min(w, h) * 0.4;

  for (let i = 0; i < inner; i++) {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / inner;
    const jr = r1 * (0.92 + Math.random() * 0.16);
    const ja = a + (Math.random() * 0.12 - 0.06);
    out.push({ x: cx + Math.cos(ja) * jr, y: cy + Math.sin(ja) * jr });
  }
  for (let i = 0; i < outer; i++) {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / outer + 0.35;
    const jr = r2 * (0.9 + Math.random() * 0.2);
    const ja = a + (Math.random() * 0.1 - 0.05);
    out.push({ x: cx + Math.cos(ja) * jr, y: cy + Math.sin(ja) * jr });
  }
  return out;
}

/* ─── NODE VIEW ─── */
function NodeView({
  techStack,
  isInView,
}: {
  techStack: Tech[];
  isInView: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [basePos, setBasePos] = useState<Vec2[]>([]);
  const [offsets, setOffsets] = useState<Vec2[]>([]);
  const [dims, setDims] = useState({ width: 0, height: 0 });
  const [mouse, setMouse] = useState<Vec2>({ x: -9999, y: -9999 });
  const [globalMouse, setGlobalMouse] = useState<Vec2>({ x: -9999, y: -9999 });
  const [hovIdx, setHovIdx] = useState<number | null>(null);
  const [selected, setSelected] = useState<Tech | null>(null);
  const hovIdxRef = useRef<number | null>(null);

  const rebuild = useCallback(() => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    setDims({ width: r.width, height: r.height });
    if (techStack.length > 0) {
      const p = generatePositions(techStack.length, r.width, r.height);
      setBasePos(p);
      setOffsets(p.map(() => ({ x: 0, y: 0 })));
    }
  }, [techStack.length]);

  useEffect(() => {
    rebuild();
    window.addEventListener("resize", rebuild);
    return () => window.removeEventListener("resize", rebuild);
  }, [rebuild]);

  const handleMove = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      const mx = e.clientX - r.left;
      const my = e.clientY - r.top;
      setGlobalMouse({ x: e.clientX, y: e.clientY });
      setMouse({ x: mx, y: my });

      const newOff = basePos.map((p, i) => {
        if (hovIdxRef.current === i) return { x: 0, y: 0 };
        return getRepulsion(p.x, p.y, mx, my, 120, 10);
      });
      setOffsets(newOff);
    },
    [basePos]
  );

  const handleLeave = useCallback(() => {
    setMouse({ x: -9999, y: -9999 });
    setGlobalMouse({ x: -9999, y: -9999 });
    setOffsets(basePos.map(() => ({ x: 0, y: 0 })));
    setHovIdx(null);
    hovIdxRef.current = null;
  }, [basePos]);

  const onNodeEnter = useCallback((index: number) => {
    setHovIdx(index);
    hovIdxRef.current = index;
  }, []);

  const onNodeLeave = useCallback(() => {
    setHovIdx(null);
    hovIdxRef.current = null;
  }, []);

  const cx = dims.width / 2;
  const cy = dims.height / 2;

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-[500px] sm:h-[600px] lg:h-[700px] overflow-hidden"
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
      >
        {dims.width > 0 && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {basePos.map((p, i) => {
              const o = offsets[i] || { x: 0, y: 0 };
              return (
                <line
                  key={`l-${i}`}
                  x1={cx}
                  y1={cy}
                  x2={p.x + o.x}
                  y2={p.y + o.y}
                  stroke="var(--color-text)"
                  strokeWidth={hovIdx === i ? 1 : 0.5}
                  opacity={
                    hovIdx === null ? 0.12 : hovIdx === i ? 0.4 : 0.05
                  }
                  style={{
                    transition: "all 0.4s cubic-bezier(0.25, 1, 0.5, 1)",
                  }}
                />
              );
            })}
          </svg>
        )}

        {/* Center mascot */}
        <div
          className={`absolute z-10 transition-all duration-700 delay-200 ${
            isInView ? "opacity-100 scale-100" : "opacity-0 scale-50"
          }`}
          style={{ left: cx - 32, top: cy - 44 }}
        >
          <FolderMascot globalMouseX={globalMouse.x} globalMouseY={globalMouse.y} />
        </div>

        {/* Nodes */}
        {basePos.map((pos, index) => {
          const tech = techStack[index];
          if (!tech) return null;
          const o = offsets[index] || { x: 0, y: 0 };

          return (
            <div
              key={tech._id}
              className={`absolute cursor-pointer ${
                isInView ? "opacity-100" : "opacity-0"
              }`}
              style={{
                left: pos.x + o.x - 30,
                top: pos.y + o.y - 30,
                transition: `left 0.4s cubic-bezier(0.25,1,0.5,1), top 0.4s cubic-bezier(0.25,1,0.5,1), opacity 0.7s ease ${350 + index * 70}ms`,
              }}
              onMouseEnter={() => onNodeEnter(index)}
              onMouseLeave={onNodeLeave}
              onClick={() => setSelected(tech)}
            >
              <div
                className="w-[60px] h-[60px] flex items-center justify-center"
                style={{
                  transform: hovIdx === index ? "scale(1.2)" : "scale(1)",
                  transition: "transform 0.35s cubic-bezier(0.25,1,0.5,1)",
                }}
              >
                <img
                  src={tech.logo}
                  alt={tech.name}
                  className="w-10 h-10 object-contain"
                  style={{
                    opacity:
                      hovIdx === null ? 0.65 : hovIdx === index ? 1 : 0.3,
                    transition: "opacity 0.35s ease",
                  }}
                />
              </div>
              <span
                className="block text-center text-[9px] font-medium tracking-[0.12em] uppercase whitespace-nowrap"
                style={{
                  marginLeft: "-16px",
                  marginRight: "-16px",
                  color:
                    hovIdx === index
                      ? "var(--color-text)"
                      : "var(--color-text-muted)",
                  opacity: hovIdx === null ? 0.7 : hovIdx === index ? 1 : 0.4,
                  transition: "all 0.35s ease",
                }}
              >
                {tech.name}
              </span>
            </div>
          );
        })}
      </div>

      {selected && (
        <TechModal tech={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

/* ─── GRID VIEW (static layout, no physics) ─── */
function GridView({
  techStack,
  isInView,
}: {
  techStack: Tech[];
  isInView: boolean;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [globalMouse, setGlobalMouse] = useState<Vec2>({ x: -9999, y: -9999 });

  const handleMove = useCallback((e: React.MouseEvent) => {
    setGlobalMouse({ x: e.clientX, y: e.clientY });
  }, []);

  const handleLeave = useCallback(() => {
    setGlobalMouse({ x: -9999, y: -9999 });
  }, []);

  const cols = Math.min(techStack.length, 6);

  return (
    <div
      ref={gridRef}
      className="relative"
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className="flex justify-center mb-4">
        <FolderMascot
          globalMouseX={globalMouse.x}
          globalMouseY={globalMouse.y}
          size={52}
        />
      </div>

      <div className="relative mb-6">
        <div className="h-px bg-[var(--color-border)] w-full" />
        <div className="flex justify-between px-2 mt-0">
          {Array.from({ length: cols + 1 }).map((_, i) => (
            <div
              key={i}
              className="w-px bg-[var(--color-border)] opacity-50"
              style={{ height: i % 3 === 0 ? "10px" : "6px" }}
            />
          ))}
        </div>
      </div>

      <div
        className="grid gap-y-10 gap-x-4 sm:gap-x-6"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {techStack.map((tech, index) => (
          <div
            key={tech._id}
            className={`flex flex-col items-center gap-3 transition-opacity duration-700 ${
              isInView ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: `${index * 40}ms` }}
          >
            <div className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
              <img
                src={tech.logo}
                alt={tech.name}
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
            <span className="text-[9px] sm:text-[10px] font-medium tracking-[0.12em] uppercase text-[var(--color-text-muted)] text-center whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── MAIN EXPORT ─── */
export default function TechStack() {
  const [sectionRef, isInView] = useInView({ threshold: 0.1 });
  const [techStack, setTechStack] = useState<Tech[]>([]);
  const [view, setView] = useState<"node" | "grid">("node");
  const heading = "Tools of the trade.";
  const { displayed: typedHeading, done: headingDone } = useTypewriter(heading, isInView, 30);

  useEffect(() => {
    const fetchTech = async () => {
      const res = await fetch("/api/techstack");
      const data = await res.json();
      setTechStack(data);
    };
    fetchTech();
  }, []);

  return (
    <section
      id="techstack"
      className="py-24 sm:py-32 lg:py-40 bg-[var(--color-bg-stone)] relative"
    >
      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
        <div
          ref={sectionRef}
          className={`transition-all duration-1000 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex items-center gap-6 mb-16">
            <span className="section-label">Tech Stack</span>
            <div className="flex-1 h-px bg-[var(--color-border)]" />
            <span className="section-label">{techStack.length}</span>
          </div>

          <h2 className="heading-editorial text-[clamp(2rem,4vw,3.5rem)] mb-16 max-w-3xl">
            {typedHeading}
            {!headingDone && <span className="inline-block w-[2px] h-[1em] bg-[var(--color-text)] ml-0.5 animate-pulse" />}
          </h2>

          <div className="relative min-h-[400px]">
            {view === "node" ? (
              <NodeView techStack={techStack} isInView={isInView} />
            ) : (
              <GridView techStack={techStack} isInView={isInView} />
            )}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-6 sm:left-8 lg:left-12 z-20 flex items-center gap-0 bg-[var(--color-text)] px-1 py-1">
        <button
          onClick={() => setView("node")}
          className={`text-[10px] font-medium tracking-[0.12em] uppercase px-3 py-1.5 transition-all duration-300 ${
            view === "node"
              ? "text-[var(--color-bg-stone)]"
              : "text-[#8A847D] hover:text-[var(--color-bg-stone)]"
          }`}
        >
          {view === "node" ? "[NODE]" : "NODE"}
        </button>
        <button
          onClick={() => setView("grid")}
          className={`text-[10px] font-medium tracking-[0.12em] uppercase px-3 py-1.5 transition-all duration-300 ${
            view === "grid"
              ? "text-[var(--color-bg-stone)]"
              : "text-[#8A847D] hover:text-[var(--color-bg-stone)]"
          }`}
        >
          {view === "grid" ? "[GRID]" : "GRID"}
        </button>
      </div>
    </section>
  );
}