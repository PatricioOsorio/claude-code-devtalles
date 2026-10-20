"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

export interface IRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

const emptySubscribe = () => () => {};

export function Reveal({ children, className, delay }: IRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(element);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn(mounted && "reveal", isVisible && "in", className)}
    >
      {children}
    </div>
  );
}
