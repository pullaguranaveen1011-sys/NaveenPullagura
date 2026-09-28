"use client";

import { useEffect, useState, useRef } from "react";
import { motion, Transition } from "motion/react";
import React from "react";

export interface CascadePageTransitionProps {
  trigger: number;
  onViewSwap?: () => void;
  className?: string;
  panelClassName?: string;
  columns?: number;
  colors?: string[];
  duration?: number;
  staggerDelay?: number;
  ease?: Transition["ease"];
  direction?: "top" | "bottom" | "left" | "right";
  exitOpposite?: boolean;
  mode?: "in-to-out" | "out-to-in";
  showLeadingStroke?: boolean;
  showTrailingStroke?: boolean;
  strokeWidth?: number;
  leadingStrokeColors?: string[];
  trailingStrokeColors?: string[];
}

// Great UI Palette customized with ONLY SINGLE COLOUR BLUE (#022EB4)
const defaultPalette = Array(14).fill("#022EB4");

export default function CascadePageTransition({
  trigger,
  onViewSwap,
  className = "",
  panelClassName = "",
  columns = 14,
  colors = defaultPalette,
  duration = 0.52,
  staggerDelay = 0.032,
  ease = [0.76, 0, 0.24, 1],
  direction = "bottom", // "bottom" with exitOpposite sweeps UPWARD
  exitOpposite = true,
  mode = "in-to-out",
  showLeadingStroke = false,
  showTrailingStroke = false,
  strokeWidth = 6,
  leadingStrokeColors = defaultPalette,
  trailingStrokeColors = defaultPalette,
}: CascadePageTransitionProps) {
  const [transitionState, setTransitionState] = useState("idle");
  const onViewSwapRef = useRef(onViewSwap);

  useEffect(() => {
    onViewSwapRef.current = onViewSwap;
  }, [onViewSwap]);

  useEffect(() => {
    if (trigger > 0) {
      setTimeout(() => setTransitionState("entering"), 0);

      const maxMultiplier = Math.floor((columns - 1) / 2);
      const maxStagger = maxMultiplier * staggerDelay;
      const totalAnimationTime = (duration + maxStagger) * 1000;

      const coverTimeout = setTimeout(() => {
        if (onViewSwapRef.current) onViewSwapRef.current();
        setTransitionState("covered");
      }, totalAnimationTime);

      const exitTimeout = setTimeout(() => {
        setTransitionState("exiting");
      }, totalAnimationTime + 120);

      const idleTimeout = setTimeout(
        () => {
          setTransitionState("idle");
        },
        totalAnimationTime * 2 + 150,
      );

      return () => {
        clearTimeout(coverTimeout);
        clearTimeout(exitTimeout);
        clearTimeout(idleTimeout);
      };
    }
  }, [trigger, columns, duration, staggerDelay]);

  if (transitionState === "idle") return null;

  const isVertical = direction === "top" || direction === "bottom";
  const isOutToIn = mode === "out-to-in";

  const getTransform = (state: "enter" | "exit") => {
    if (isVertical) {
      const isEnterBottom = direction === "bottom";
      if (state === "enter") {
        return { y: isEnterBottom ? "100%" : "-100%", x: "0%" };
      } else {
        return exitOpposite
          ? { y: isEnterBottom ? "-100%" : "100%", x: "0%" }
          : { y: isEnterBottom ? "100%" : "-100%", x: "0%" };
      }
    } else {
      const isEnterRight = direction === "right";
      if (state === "enter") {
        return { x: isEnterRight ? "100%" : "-100%", y: "0%" };
      } else {
        return exitOpposite
          ? { x: isEnterRight ? "-100%" : "100%", y: "0%" }
          : { x: isEnterRight ? "100%" : "-100%", y: "0%" };
      }
    }
  };

  const panels = Array.from({ length: columns }, (_, i) => i);

  return (
    <div
      key={trigger}
      className={`pointer-events-none fixed inset-0 z-[99999] flex h-full w-full overflow-hidden ${
        isVertical ? "flex-row" : "flex-col"
      } ${className}`}
    >
      {panels.map((i) => {
        const centerIndex = (columns - 1) / 2;
        const distanceFromCenter = Math.abs(i - centerIndex);
        const minDistance = columns % 2 === 0 ? 0.5 : 0;
        const delayMultiplier = distanceFromCenter - minDistance;
        const maxMultiplier = Math.floor((columns - 1) / 2);
        const finalDelayMultiplier = isOutToIn
          ? maxMultiplier - delayMultiplier
          : delayMultiplier;

        const delay = Math.max(0, finalDelayMultiplier * staggerDelay);
        const color = colors[i % colors.length];

        const leadingColor =
          leadingStrokeColors && leadingStrokeColors.length > 0
            ? leadingStrokeColors[i % leadingStrokeColors.length]
            : null;

        const trailingColor =
          trailingStrokeColors && trailingStrokeColors.length > 0
            ? trailingStrokeColors[i % trailingStrokeColors.length]
            : null;

        const isCoveredOrEntering =
          transitionState === "entering" || transitionState === "covered";

        const initialPos = getTransform("enter");
        const targetPos = isCoveredOrEntering
          ? { x: "0%", y: "0%" }
          : getTransform("exit");

        return (
          <motion.div
            key={i}
            initial={initialPos}
            animate={targetPos}
            transition={{
              duration: duration,
              ease: ease,
              delay: delay,
            }}
            className={`pointer-events-auto relative flex flex-1 items-center justify-center overflow-hidden ${panelClassName}`}
            style={{
              backgroundColor: color,
              width: isVertical ? `calc(${100 / columns}% + 0.5px)` : "100%",
              height: isVertical ? "100%" : `calc(${100 / columns}% + 0.5px)`,
              marginLeft: isVertical && i > 0 ? "-0.2px" : "0px",
              marginTop: !isVertical && i > 0 ? "-0.2px" : "0px",
            }}
          >
            {showLeadingStroke && leadingColor && (
              <div
                style={{
                  position: "absolute",
                  backgroundColor: leadingColor,
                  left: 0,
                  right: 0,
                  ...(direction === "bottom" ? { top: 0, height: strokeWidth } : { bottom: 0, height: strokeWidth }),
                }}
              />
            )}

            {showTrailingStroke && trailingColor && (
              <div
                style={{
                  position: "absolute",
                  backgroundColor: trailingColor,
                  left: 0,
                  right: 0,
                  ...(direction === "bottom" ? { bottom: 0, height: strokeWidth } : { top: 0, height: strokeWidth }),
                }}
              />
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
