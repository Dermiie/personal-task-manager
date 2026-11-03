import { useEffect, useState } from 'react';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';

export interface LoadingScreenProps {
  /** Main status text, e.g. "Checking your session" */
  message?: string;
  /** Secondary, smaller detail text under the message */
  description?: string;
  /** Spinner size. Defaults to "xl" (big, centered) */
  size?: SpinnerSize;
  /**
   * Covers the whole viewport and locks page scroll.
   * Set to false to center inside the parent container instead.
   */
  fullScreen?: boolean;
  /**
   * Wait this many ms before showing anything. Prevents a jarring
   * spinner flash when loading finishes almost instantly.
   */
  delay?: number;
  /** Show animated dots after the message ("Loading...") */
  showDots?: boolean;
  /** Extra classes for the outer wrapper */
  className?: string;
}

const sizeStyles: Record<
  SpinnerSize,
  { box: string; ring: string; inner: string }
> = {
  sm: {
    box: 'h-6 w-6',
    ring: 'border-[3px]',
    inner: 'inset-[7px] border-[3px]',
  },
  md: { box: 'h-10 w-10', ring: 'border-4', inner: 'inset-2.5 border-4' },
  lg: { box: 'h-16 w-16', ring: 'border-[5px]', inner: 'inset-3 border-[5px]' },
  xl: {
    box: 'h-24 w-24',
    ring: 'border-[6px]',
    inner: 'inset-[15px] border-[6px]',
  },
};

export default function LoadingScreen({
  message = 'Loading',
  description,
  size = 'xl',
  fullScreen = true,
  delay = 200,
  showDots = true,
  className = '',
}: LoadingScreenProps) {
  const [visible, setVisible] = useState(delay <= 0);
  const [shown, setShown] = useState(false); // drives the fade-in

  // Delay rendering to avoid a flash on fast loads
  useEffect(() => {
    if (delay <= 0) return;
    const timer = window.setTimeout(() => setVisible(true), delay);
    return () => window.clearTimeout(timer);
  }, [delay]);

  // Trigger the opacity transition on the frame after mount
  useEffect(() => {
    if (!visible) return;
    const frame = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(frame);
  }, [visible]);

  // Lock page scroll while the full-screen loader is mounted
  useEffect(() => {
    if (!fullScreen) return;

    const { body, documentElement } = document;
    const prevBodyOverflow = body.style.overflow;
    const prevHtmlOverflow = documentElement.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    // Compensate for the disappearing scrollbar so the layout doesn't shift
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
    body.style.overflow = 'hidden';
    documentElement.style.overflow = 'hidden';

    return () => {
      body.style.overflow = prevBodyOverflow;
      documentElement.style.overflow = prevHtmlOverflow;
      body.style.paddingRight = prevPaddingRight;
    };
  }, [fullScreen]);

  if (!visible) return null;

  const s = sizeStyles[size];

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={[
        'flex items-center justify-center bg-white p-6 text-gray-800',
        'transition-opacity duration-300 ease-out motion-reduce:transition-none',
        'dark:bg-slate-900 dark:text-slate-100',
        shown ? 'opacity-100' : 'opacity-0',
        fullScreen
          ? 'fixed inset-0 z-[9999] h-screen h-[100dvh] touch-none overflow-hidden overscroll-contain'
          : 'min-h-[200px] w-full',
        className,
      ].join(' ')}
    >
      <div className="flex max-w-sm flex-col items-center gap-4 text-center">
        {/* Spinner */}
        <div className={`relative shrink-0 ${s.box}`} aria-hidden="true">
          <span
            className={[
              'absolute inset-0 rounded-full',
              'border-gray-200 border-t-theme',
              'dark:border-slate-800 dark:border-t-theme',
              'animate-spin [animation-duration:0.9s]',
              'motion-reduce:[animation-duration:2.5s]',
              s.ring,
            ].join(' ')}
          />
          <span
            className={[
              'absolute rounded-full',
              'border-transparent border-b-theme dark:border-b-theme',
              'animate-spin [animation-direction:reverse] [animation-duration:1.4s]',
              'motion-reduce:animate-none',
              s.inner,
            ].join(' ')}
          />
        </div>

        {/* Message */}
        <p className="m-0 text-lg font-semibold tracking-wide">
          {message}
          {showDots && (
            <span aria-hidden="true">
              {[0, 200, 400].map((d) => (
                <span
                  key={d}
                  className="inline-block animate-pulse motion-reduce:animate-none"
                  style={{ animationDelay: `${d}ms` }}
                >
                  .
                </span>
              ))}
            </span>
          )}
        </p>

        {/* Description */}
        {description && (
          <p className="m-0 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
            {description}
          </p>
        )}

        {/* Full sentence for screen readers */}
        <span className="sr-only">
          {message}
          {description ? `. ${description}` : ''}. Please wait.
        </span>
      </div>
    </div>
  );
}
