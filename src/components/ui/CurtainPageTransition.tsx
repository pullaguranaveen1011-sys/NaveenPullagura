"use client";

import { useEffect, useState, useRef } from "react";
import { motion, Transition } from "motion/react";
import React from "react";

export interface CurtainPageTransitionProps {
  trigger: number;
  onViewSwap?: () => void;
  className?: string;
  panelClassName?: string;
  duration?: number;
  ease?: Transition["ease"];
  direction?: "vertical" | "horizontal";
  color?: string;
}

export default function CurtainPageTransition({
  trigger,
  onViewSwap,
  className = "",
  panelClassName = "",
  duration = 0.3, // Fast 0.3s as requested
  ease = [0.76, 0, 0.24, 1],
  direction = "vertical", // Vertical curtain as requested
  color = "#022EB4",
}: CurtainPageTransitionProps) {
  const [transitionState, setTransitionState] = useState("idle");
  const onViewSwapRef = useRef(onViewSwap);

  useEffect(() => {
    onViewSwapRef.current = onViewSwap;
  }, [onViewSwap]);

  useEffect(() => {
    if (trigger > 0) {
      setTransitionState("entering");

      const totalAnimationTime = duration * 1000;

      const coverTimeout = setTimeout(() => {
        if (onViewSwapRef.current) onViewSwapRef.current();
        setTransitionState("covered");
      }, totalAnimationTime);

      const exitTimeout = setTimeout(() => {
        setTransitionState("exiting");
      }, totalAnimationTime + 40);

      const idleTimeout = setTimeout(
        () => {
          setTransitionState("idle");
        },
        totalAnimationTime * 2 + 50,
      );

      return () => {
        clearTimeout(coverTimeout);
        clearTimeout(exitTimeout);
        clearTimeout(idleTimeout);
      };
    }
  }, [trigger, duration]);

  if (transitionState === "idle") return null;

  const isHorizontal = direction === "horizontal";

  const getTransform = (side: "first" | "second", state: "enter" | "exit") => {
    if (state === "enter") {
      if (isHorizontal) {
        return { x: side === "first" ? "-100%" : "100%", y: "0%" };
      } else {
        return { y: side === "first" ? "-100%" : "100%", x: "0%" };
      }
    } else {
      if (isHorizontal) {
        return { x: side === "first" ? "-100%" : "100%", y: "0%" };
      } else {
        return { y: side === "first" ? "-100%" : "100%", x: "0%" };
      }
    }
  };

  const isCoveredOrEntering =
    transitionState === "entering" || transitionState === "covered";

  return (
    <div
      key={trigger}
      className={`pointer-events-none fixed inset-0 z-[100000] h-full w-full overflow-hidden ${className}`}
    >
      {/* Top Curtain Panel (Vertical) */}
      <motion.div
        initial={getTransform("first", "enter")}
        animate={
          isCoveredOrEntering
            ? { x: "0%", y: "0%" }
            : getTransform("first", "exit")
        }
        transition={{ duration, ease }}
        className={`pointer-events-auto absolute ${
          isHorizontal
            ? "top-0 left-0 h-full w-[50.5%]"
            : "top-0 left-0 h-[50.5%] w-full"
        } ${panelClassName}`}
        style={{ backgroundColor: color }}
      />
      {/* Bottom Curtain Panel (Vertical) */}
      <motion.div
        initial={getTransform("second", "enter")}
        animate={
          isCoveredOrEntering
            ? { x: "0%", y: "0%" }
            : getTransform("second", "exit")
        }
        transition={{ duration, ease }}
        className={`pointer-events-auto absolute ${
          isHorizontal
            ? "top-0 right-0 h-full w-[50.5%]"
            : "bottom-0 left-0 h-[50.5%] w-full"
        } ${panelClassName}`}
        style={{ backgroundColor: color }}
      />
    </div>
  );
}
