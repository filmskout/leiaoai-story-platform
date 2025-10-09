import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Excalidraw, exportToBlob } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import { useAuth } from "../hooks/useAuth";

/**
 * Business Model Canvas (BMC) — Excalidraw-based, responsive, embeddable component
 * MIT-friendly dependencies only. Drop-in for React apps.
 *
 * Features
 * - Canonical BMC 9-block layout on an infinite canvas (Excalidraw)
 * - Fully responsive: recomputes block rectangles on container resize
 * - JSON import/export (9 blocks), PNG export, light/dark toggle
 * - LocalStorage persistence (optional)
 * - Minimal UI (Tailwind utility classes recommended, but not required)
 *
 * Props
 * - initialJson?: Partial<BMCJson>  // initial structured data
 * - theme?: "light" | "dark"          // initial theme, default "light"
 * - persistKey?: string               // localStorage key; omit to disable persistence
 * - onJsonChange?: (data: BMCJson) => void
 */

// ---------- Types ----------
export type BMCJson = {
  key_partners: string
  key_activities: string
  key_resources: string
  value_proposition: string
  customer_relationships: string
  channels: string
  customer_segments: string
  cost_structure: string
  revenue_streams: string
}

const EMPTY_BMC: BMCJson = {
  key_partners: "",
  key_activities: "",
  key_resources: "",
  value_proposition: "",
  customer_relationships: "",
  channels: "",
  customer_segments: "",
  cost_structure: "",
  revenue_streams: "",
}

// Canonical block order & titles
const BLOCKS: { key: keyof BMCJson; title: string }[] = [
  { key: "key_partners", title: "Key Partners" },
  { key: "key_activities", title: "Key Activities" },
  { key: "value_proposition", title: "Value Proposition" },
  { key: "customer_relationships", title: "Customer Relationships" },
  { key: "customer_segments", title: "Customer Segments" },
  { key: "key_resources", title: "Key Resources" },
  { key: "channels", title: "Channels" },
  { key: "cost_structure", title: "Cost Structure" },
  { key: "revenue_streams", title: "Revenue Streams" },
]

// Fixed IDs so we can round-trip JSON <-> scene (do not change once in use)
const RECT_ID = (k: keyof BMCJson) => `rect_${k}`
const HDR_ID = (k: keyof BMCJson) => `hdr_${k}`
const TXT_ID = (k: keyof BMCJson) => `txt_${k}`

// ---------- Simple ResizeObserver hook ----------
function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })
  useEffect(() => {
    if (!ref.current) return
    const el = ref.current
    const ro = new ResizeObserver((entries) => {
      const cr = entries[0].contentRect
      setSize({ width: cr.width, height: cr.height })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])
  return { ref, ...size }
}

// ---------- Layout math (5 columns x 3 rows, with spans to match BMC) ----------
function computeRects(w: number, h: number) {
  // Row height ratios: top ~36%, middle ~24%, bottom ~40%
  const r1 = Math.max(0.32, Math.min(0.42, 0.36))
  const r2 = Math.max(0.18, Math.min(0.30, 0.24))
  const r3 = 1 - r1 - r2
  const H1 = h * r1
  const H2 = h * r2
  const H3 = h * r3

  const COLS = 5
  const CW = w / COLS
  const Y1 = 0
  const Y2 = H1
  const Y3 = H1 + H2

  // Blocks (approx canonical Strategyzer layout)
  return {
    key_partners: { x: 0 * CW, y: Y1, w: 1 * CW, h: H1 },
    key_activities: { x: 1 * CW, y: Y1, w: 1 * CW, h: H1 },
    value_proposition: { x: 2 * CW, y: Y1, w: 1 * CW, h: H1 + H2 }, // spans 2 rows
    customer_relationships: { x: 3 * CW, y: Y1, w: 1 * CW, h: H1 },
    customer_segments: { x: 4 * CW, y: Y1, w: 1 * CW, h: H1 },

    key_resources: { x: 0 * CW, y: Y2, w: 2 * CW, h: H2 }, // span 2 cols
    channels: { x: 3 * CW, y: Y2, w: 2 * CW, h: H2 }, // span 2 cols

    cost_structure: { x: 0 * CW, y: Y3, w: 3 * CW, h: H3 }, // bottom left 3 cols
    revenue_streams: { x: 3 * CW, y: Y3, w: 2 * CW, h: H3 }, // bottom right 2 cols
  } as Record<keyof BMCJson, { x: number; y: number; w: number; h: number }>
}

// ---------- Excal helpers ----------
function headerText(title: string, x: number, y: number) {
  return {
    type: "text",
    x,
    y,
    text: title,
    fontSize: 18,
    textAlign: "left",
    // other props are defaulted by Excalidraw
  } as any
}

function contentText(text: string, x: number, y: number, fontSize = 16) {
  return {
    type: "text",
    x,
    y,
    text,
    fontSize,
    textAlign: "left",
  } as any
}

function rect(x: number, y: number, w: number, h: number) {
  return {
    type: "rectangle",
    x,
    y,
    width: Math.max(40, w),
    height: Math.max(40, h),
    strokeColor: "#7a7a7a",
  } as any
}

function buildSceneElements(
  width: number,
  height: number,
  data: BMCJson,
): any[] {
  const P = 12 // padding inside each block
  const layout = computeRects(width, height)
  const elements: any[] = []

  BLOCKS.forEach(({ key, title }) => {
    const r = (layout as any)[key]
    const header = headerText(title, r.x + P, r.y + P)
    const content = contentText((data as any)[key] || "", r.x + P, r.y + P + 26)
    const rectangle = rect(r.x, r.y, r.w, r.h)

    // Assign stable IDs for round-trip
    ;(rectangle as any).id = RECT_ID(key)
    ;(header as any).id = HDR_ID(key)
    ;(content as any).id = TXT_ID(key)

    elements.push(rectangle, header, content)
  })

  return elements
}

function jsonFromScene(elements: readonly any[]): BMCJson {
  const next = { ...EMPTY_BMC }
  for (const el of elements) {
    if (el?.type === "text" && typeof el?.id === "string" && el.id.startsWith("txt_")) {
      const key = el.id.replace("txt_", "") as keyof BMCJson
      if (key in next) (next as any)[key] = el.text ?? ""
    }
  }
  return next
}

// ---------- Component ----------
export default function BMCExcalidraw(props: {
  initialJson?: Partial<BMCJson>
  theme?: "light" | "dark"
  persistKey?: string
  onJsonChange?: (data: BMCJson) => void
}) {
  const { initialJson, theme = "light", persistKey, onJsonChange } = props
  const { user } = useAuth()
  const { ref, width, height } = useMeasure<HTMLDivElement>()
  const excalRef = useRef<any>(null)
  const [modeDark, setModeDark] = useState(theme === "dark")
  const [data, setData] = useState<BMCJson>(() => {
    if (persistKey) {
      try {
        const s = localStorage.getItem(persistKey)
        if (s) return { ...EMPTY_BMC, ...JSON.parse(s) }
      } catch {}
    }
    return { ...EMPTY_BMC, ...(initialJson || {}) }
  })

  // Build initial elements for current container size
  const initialData = useMemo(() => {
    const W = Math.max(width, 1200) // virtual layout width for a roomy canvas
    const H = Math.max(height, 800)
    return {
      elements: buildSceneElements(W, H, data),
      appState: { theme: modeDark ? "dark" : "light" },
    }
  }, [width, height, data, modeDark])

  // Persist
  useEffect(() => {
    if (!persistKey) return
    try { localStorage.setItem(persistKey, JSON.stringify(data)) } catch {}
  }, [data, persistKey])

  // Sync scene on width/height/theme/data changes
  useEffect(() => {
    const api = excalRef.current
    if (!api) return
    const W = Math.max(width, 1200)
    const H = Math.max(height, 800)
    const elements = buildSceneElements(W, H, data)
    api.updateScene({ elements, appState: { theme: modeDark ? "dark" : "light" } })
  }, [width, height, data, modeDark])

  // onChange -> lift JSON (structured) up
  const handleChange = useCallback(() => {
    const api = excalRef.current
    if (!api) return
    const els = api.getSceneElements() as any[]
    const next = jsonFromScene(els)
    setData(next)
    onJsonChange?.(next)
  }, [onJsonChange])

  const doExportPNG = useCallback(async () => {
    const api = excalRef.current
    if (!api) return
    const els = api.getSceneElements()
    const blob = await exportToBlob({ elements: els, mimeType: "image/png" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bmc.png"
    a.click()
    URL.revokeObjectURL(url)
  }, [])

  const doImportJSON = useCallback(async () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".json,application/json"
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const text = await file.text()
      try {
        const parsed = JSON.parse(text)
        const next = { ...EMPTY_BMC, ...parsed } as BMCJson
        setData(next)
      } catch (e) {
        alert("Invalid JSON")
      }
    }
    input.click()
  }, [])

  const doExportJSON = useCallback(() => {
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "bmc.json"
    a.click()
    URL.revokeObjectURL(url)
  }, [data])

  return (
    <div ref={ref} style={{ width: "100%", height: "100vh", position: "relative" }}>
      <Excalidraw
        initialData={initialData as any}
        onChange={handleChange}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: true,
            saveToActiveFile: false,
          },
        }}
      />
      {/* Controls */}
      <div
        className="bmc-controls"
        style={{
          position: "absolute",
          right: 16,
          top: 16,
          display: "flex",
          gap: 8,
          alignItems: "center",
          background: "rgba(0,0,0,0.5)",
          color: "#fff",
          padding: "8px 10px",
          borderRadius: 12,
          backdropFilter: "blur(4px)",
        }}
      >
        <button onClick={() => setModeDark((v) => !v)} title="Toggle theme"
          style={{ padding: "6px 10px", borderRadius: 8, border: 0, cursor: "pointer", background: "rgba(255,255,255,0.2)" }}>
          {modeDark ? "🌙 Dark" : "🔆 Light"}
        </button>
        <button 
          onClick={doExportPNG} 
          title={!user ? "Please sign in to export" : "Export PNG"}
          disabled={!user}
          style={{ 
            padding: "6px 10px", 
            borderRadius: 8, 
            border: 0, 
            cursor: user ? "pointer" : "not-allowed", 
            background: user ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.1)",
            opacity: user ? 1 : 0.5
          }}>
          ⬇️ PNG
        </button>
        <button onClick={doExportJSON} title="Export JSON"
          style={{ padding: "6px 10px", borderRadius: 8, border: 0, cursor: "pointer", background: "rgba(255,255,255,0.2)" }}>
          ⬇️ JSON
        </button>
        <button onClick={doImportJSON} title="Import JSON"
          style={{ padding: "6px 10px", borderRadius: 8, border: 0, cursor: "pointer", background: "rgba(255,255,255,0.2)" }}>
          ⬆️ JSON
        </button>
      </div>
    </div>
  )
}