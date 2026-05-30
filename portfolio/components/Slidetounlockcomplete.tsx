"use client"

// ─────────────────────────────────────────────────────────────────────────────
//  ALL-IN-ONE  —  SlideToUnlock + ShimmeringText + useSound
//  Dependencies:  npm install motion sonner
//  Tailwind v4 required  (bg-linear-to-b, inset-ring-* utilities)
//  Add <Toaster /> once in your root layout  →  import { Toaster } from "sonner"
//  Usage:  import SlideToUnlockDemo from "@/components/SlideToUnlockComplete"
// ─────────────────────────────────────────────────────────────────────────────

import * as React from "react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react"
import type { ComponentProps, ComponentPropsWithoutRef, JSX } from "react"
import type { Variants } from "motion/react"
import {
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react"
import { toast } from "sonner"

/* ══════════════════════════════════════════════════════════════════════════════
   SOUND ENGINE  (Web Audio API — zero external deps)
══════════════════════════════════════════════════════════════════════════════ */
let _audioContext: AudioContext | null = null
const _bufferCache = new Map<string, Promise<AudioBuffer>>()

function getAudioContext(): AudioContext {
  if (!_audioContext) _audioContext = new AudioContext()
  return _audioContext
}

function fetchAndDecodeAudio(url: string): Promise<AudioBuffer> {
  const cached = _bufferCache.get(url)
  if (cached) return cached

  const ctx = getAudioContext()
  const promise = fetch(url)
    .then((res) => {
      if (!res.ok) throw new Error(`Audio fetch failed: ${res.status}`)
      return res.arrayBuffer()
    })
    .then((data) => ctx.decodeAudioData(data))
    .catch((err) => {
      _bufferCache.delete(url)
      throw err
    })

  _bufferCache.set(url, promise)
  return promise
}

/* ══════════════════════════════════════════════════════════════════════════════
   useSound HOOK
══════════════════════════════════════════════════════════════════════════════ */
interface UseSoundOptions {
  volume?: number
  playbackRate?: number
  interrupt?: boolean
  soundEnabled?: boolean
  lazy?: boolean
  onPlay?: () => void
  onEnd?: () => void
  onPause?: () => void
  onStop?: () => void
}

type PlayFunction = (overrides?: { volume?: number; playbackRate?: number }) => void
interface SoundControls { stop: () => void; pause: () => void; isPlaying: boolean }
type UseSoundReturn = readonly [PlayFunction, SoundControls]

export function useSound(url: string, options: UseSoundOptions = {}): UseSoundReturn {
  const {
    volume = 1,
    playbackRate = 1,
    interrupt = false,
    soundEnabled = true,
    lazy = false,
    onPlay,
    onEnd,
    onPause,
    onStop,
  } = options

  const [isPlaying, setIsPlaying] = useState(false)
  const sourceRef = useRef<AudioBufferSourceNode | null>(null)
  const gainRef   = useRef<GainNode | null>(null)
  const bufferRef = useRef<AudioBuffer | null>(null)

  // Pre-fetch unless lazy
  useEffect(() => {
    bufferRef.current = null
    if (lazy) return
    let cancelled = false
    fetchAndDecodeAudio(url).then((buf) => {
      if (!cancelled) bufferRef.current = buf
    })
    return () => { cancelled = true }
  }, [url, lazy])

  const stop = useCallback(() => {
    if (sourceRef.current) {
      try { sourceRef.current.stop() } catch { /* already stopped */ }
      sourceRef.current = null
    }
    setIsPlaying(false)
    onStop?.()
  }, [onStop])

  const play: PlayFunction = useCallback(
    (overrides?) => {
      if (!soundEnabled) return

      const startPlayback = (buffer: AudioBuffer) => {
        const ctx = getAudioContext()
        if (ctx.state === "suspended") ctx.resume()
        if (interrupt && sourceRef.current) stop()

        const source = ctx.createBufferSource()
        const gain   = ctx.createGain()

        source.buffer = buffer
        source.playbackRate.value = overrides?.playbackRate ?? playbackRate
        gain.gain.value           = overrides?.volume      ?? volume

        source.connect(gain)
        gain.connect(ctx.destination)

        source.onended = () => { setIsPlaying(false); onEnd?.() }
        source.start(0)

        sourceRef.current = source
        gainRef.current   = gain
        setIsPlaying(true)
        onPlay?.()
      }

      if (bufferRef.current) {
        startPlayback(bufferRef.current)
        return
      }
      // Lazy load on first play
      fetchAndDecodeAudio(url).then((buf) => {
        bufferRef.current = buf
        startPlayback(buf)
      })
    },
    [soundEnabled, url, interrupt, playbackRate, volume, stop, onPlay, onEnd]
  )

  const pause = useCallback(() => { stop(); onPause?.() }, [stop, onPause])

  // Keep gain in sync without restarting
  useEffect(() => {
    if (gainRef.current) gainRef.current.gain.value = volume
  }, [volume])

  // Cleanup on unmount
  useEffect(() => () => {
    try { sourceRef.current?.stop() } catch { /* ignore */ }
  }, [])

  return [play, { stop, pause, isPlaying }] as const
}

/* ══════════════════════════════════════════════════════════════════════════════
   UTILITY
══════════════════════════════════════════════════════════════════════════════ */
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ")
}

/* ══════════════════════════════════════════════════════════════════════════════
   SHIMMERING TEXT
══════════════════════════════════════════════════════════════════════════════ */
export type ShimmeringTextProps = Omit<
  React.ComponentProps<typeof motion.span>,
  "children"
> & {
  text: string
  duration?: number
  isStopped?: boolean
}

export function ShimmeringText({
  text,
  duration = 1,
  isStopped = false,
  className,
  ...props
}: ShimmeringTextProps) {
  const createCharVariants = React.useCallback(
    (i: number): Variants => ({
      running: {
        color: ["var(--color)", "var(--shimmering-color)", "var(--color)"],
        transition: {
          duration,
          repeat: Infinity,
          repeatType: "loop" as const,
          repeatDelay: text.length * 0.05,
          delay: (i * duration) / text.length,
          ease: "easeInOut",
        },
      },
      stopped: {
        color: "var(--color)",
        transition: { duration: duration * 0.5, ease: "easeOut" },
      },
    }),
    [duration, text.length]
  )

  return (
    <motion.span
      className={cn(
        "inline-block select-none",
        "[--color:var(--muted-foreground)] [--shimmering-color:var(--foreground)]",
        className
      )}
      {...props}
    >
      {text?.split("")?.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block whitespace-pre"
          initial="stopped"
          animate={isStopped ? "stopped" : "running"}
          variants={createCharVariants(i)}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   SLIDE TO UNLOCK  —  Context
══════════════════════════════════════════════════════════════════════════════ */
type SlideToUnlockContextValue = {
  x: MotionValue<number>
  trackRef: React.RefObject<HTMLDivElement | null>
  isDragging: boolean
  handleWidth: number
  textOpacity: MotionValue<number>
  onDragStart: () => void
  onDragEnd: () => void
}

const SlideToUnlockContext = createContext<SlideToUnlockContextValue | null>(null)

function useSlideToUnlock() {
  const ctx = useContext(SlideToUnlockContext)
  if (!ctx) throw new Error("SlideToUnlock components must be used within <SlideToUnlock>")
  return ctx
}

/* ══════════════════════════════════════════════════════════════════════════════
   SLIDE TO UNLOCK  —  Root
══════════════════════════════════════════════════════════════════════════════ */
export type SlideToUnlockRootProps = ComponentProps<"div"> & {
  handleWidth?: number
  onUnlock?: () => void
}

export function SlideToUnlock({
  className,
  handleWidth = 56,
  children,
  onUnlock,
  ...props
}: SlideToUnlockRootProps) {
  const trackRef   = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const x          = useMotionValue(0)
  const textOpacity = useTransform(x, [0, handleWidth], [1, 0])

  const handleDragStart = useCallback(() => setIsDragging(true), [])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    const maxX = (trackRef.current?.offsetWidth || 0) - handleWidth
    if (x.get() >= maxX) {
      onUnlock?.()
    } else {
      animate(x, 0, { type: "spring", bounce: 0, duration: 0.25 })
    }
  }, [x, onUnlock, handleWidth])

  return (
    <SlideToUnlockContext.Provider
      value={{ x, trackRef, isDragging, handleWidth, textOpacity,
               onDragStart: handleDragStart, onDragEnd: handleDragEnd }}
    >
      <div
        data-slot="slide-to-unlock"
        className={cn(
          "w-54 rounded-xl bg-muted p-1 shadow-inner inset-ring-1 inset-ring-foreground/10",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </SlideToUnlockContext.Provider>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   SLIDE TO UNLOCK  —  Track
══════════════════════════════════════════════════════════════════════════════ */
export type SlideToUnlockTrackProps = ComponentProps<"div">

export function SlideToUnlockTrack({ className, children, ...props }: SlideToUnlockTrackProps) {
  const { trackRef } = useSlideToUnlock()
  return (
    <div
      ref={trackRef}
      data-slot="track"
      className={cn("relative flex h-10 items-center justify-center", className)}
      {...props}
    >
      {children}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   SLIDE TO UNLOCK  —  Text
══════════════════════════════════════════════════════════════════════════════ */
export type SlideToUnlockTextProps = Omit<
  ComponentPropsWithoutRef<typeof motion.div>,
  "children"
> & {
  children: JSX.Element | ((props: { isDragging: boolean }) => JSX.Element)
}

export function SlideToUnlockText({ className, children, style, ...props }: SlideToUnlockTextProps) {
  const { handleWidth, textOpacity, isDragging } = useSlideToUnlock()
  return (
    <motion.div
      data-slot="text"
      data-dragging={isDragging}
      className={cn("pl-1 text-lg font-medium", className)}
      style={{ marginLeft: handleWidth, opacity: textOpacity, ...style }}
      {...props}
    >
      {typeof children === "function" ? children({ isDragging }) : children}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   SLIDE TO UNLOCK  —  Handle
══════════════════════════════════════════════════════════════════════════════ */
export type SlideToUnlockHandleProps = ComponentPropsWithoutRef<typeof motion.div>

export function SlideToUnlockHandle({ className, children, style, ...props }: SlideToUnlockHandleProps) {
  const { x, trackRef, onDragStart, onDragEnd, handleWidth: width } = useSlideToUnlock()
  return (
    <motion.div
      data-slot="handle"
      className={cn(
        "absolute top-0 left-0 flex h-10 cursor-grab items-center justify-center rounded-lg bg-white text-zinc-400 shadow-sm active:cursor-grabbing",
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-6",
        className
      )}
      style={{ width, x, ...style }}
      drag="x"
      dragConstraints={trackRef}
      dragElastic={0}
      dragMomentum={false}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      {...props}
    >
      {children ?? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden>
          <path d="M24 12 12.75 3v4.696H0v8.608h12.75V21z" fill="currentColor" />
        </svg>
      )}
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════════════════════════════════
   DEMO  —  Exact reference replica
            • Dark zinc gradient background
            • Emerald gradient handle
            • "slide to answer" with shimmer
            • Original iOS unlock sound from chanhdai.com CDN
            • Promise toast: Connecting… → Connected
══════════════════════════════════════════════════════════════════════════════ */
export default function SlideToUnlockDemo() {
  // Exact same audio URL used in chanhdai.com reference
  const [play] = useSound("https://assets.chanhdai.com/sounds/ios/unlock.mp3", {
    volume: 0.5,
  })

  return (
    <SlideToUnlock
      className="bg-linear-to-b from-zinc-800 to-zinc-900"
      onUnlock={() => {
        play()   // ← iOS unlock sound fires instantly

        const myPromise = new Promise((resolve) =>
          setTimeout(() => resolve(true), 1000)
        )
        toast.promise(myPromise, {
          loading: "Connecting...",
          success: () => "Connected",
          error: ({ message }: { message: string }) => `Error: ${message}`,
        })
      }}
    >
      <SlideToUnlockTrack>
        <SlideToUnlockText>
          {({ isDragging }) => (
            <ShimmeringText
              className="[--color:var(--color-zinc-600)] [--shimmering-color:var(--color-zinc-50)]"
              text="slide to answer"
              isStopped={isDragging}
            />
          )}
        </SlideToUnlockText>

        <SlideToUnlockHandle className="bg-linear-to-b from-emerald-500 to-emerald-700 text-white" />
      </SlideToUnlockTrack>
    </SlideToUnlock>
  )
}