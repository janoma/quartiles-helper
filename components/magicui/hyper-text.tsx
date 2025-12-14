"use client";

import { AnimatePresence, motion, type MotionProps } from "motion/react";
import { useEffect, useEffectEvent, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import { cn } from "@/lib/utils";

type CharacterSet = readonly string[] | string[];

interface HyperTextProps extends MotionProps {
  /** Whether to trigger animation on hover */
  animateOnHover?: boolean;
  /** Component to render as - defaults to div */
  as?: React.ElementType;
  /** Custom character set for scramble effect. Defaults to lowercase alphabet */
  characterSet?: CharacterSet;
  /** The text content to be animated */
  children: string;
  /** Optional className for styling */
  className?: string;
  /** Delay before animation starts in milliseconds */
  delay?: number;
  /** Duration of the animation in milliseconds */
  duration?: number;
  /** Whether to start animation when element comes into view */
  startOnView?: boolean;
}

const DEFAULT_CHARACTER_SET = Object.freeze(
  "abcdefghijklmnopqrstuvwxyz".split(""),
);

const getRandomInt = (max: number): number => Math.floor(Math.random() * max);

export function HyperText({
  animateOnHover = true,
  as: Component = "div",
  characterSet = DEFAULT_CHARACTER_SET,
  children,
  className,
  delay = 0,
  duration = 800,
  startOnView = false,
  ...props
}: HyperTextProps) {
  const MotionComponent = motion.create(Component, {
    forwardMotionProps: true,
  });

  const [displayText, setDisplayText] = useState<string[]>(() =>
    children.split(""),
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const iterationCount = useRef(0);
  const elementRef = useRef<HTMLElement>(null);

  const prefersReducedMotion = useMediaQuery(
    "(prefers-reduced-motion: reduce)",
    {
      defaultValue: false,
      initializeWithValue: false,
    },
  );

  const handleAnimationTrigger = () => {
    if (animateOnHover && !isAnimating) {
      iterationCount.current = 0;
      setIsAnimating(true);
    }
  };

  // Handle animation start based on view or delay
  useEffect(() => {
    if (!startOnView) {
      const startTimeout = setTimeout(() => {
        setIsAnimating(true);
      }, delay);
      return () => {
        clearTimeout(startTimeout);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setTimeout(() => {
            setIsAnimating(true);
          }, delay);
          observer.disconnect();
        }
      },
      { rootMargin: "-30% 0px -30% 0px", threshold: 0.1 },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [delay, startOnView]);

  const handleSetDisplayText = useEffectEvent((text: string[]) => {
    setDisplayText(text);
  });

  const handleSetIsAnimating = useEffectEvent((isAnimating: boolean) => {
    setIsAnimating(isAnimating);
  });

  // Handle scramble animation
  useEffect(() => {
    if (!isAnimating) {
      return;
    }

    if (prefersReducedMotion) {
      // No visual animation on reduced motion
      handleSetDisplayText(children.split(""));
      handleSetIsAnimating(false);
      return;
    }

    const intervalDuration = duration / (children.length * 10);
    const maxIterations = children.length;

    const interval = setInterval(() => {
      if (iterationCount.current < maxIterations) {
        setDisplayText(
          (currentText) =>
            currentText.map((letter, index) =>
              letter === " "
                ? letter
                : index <= iterationCount.current
                  ? children[index]
                  : characterSet[getRandomInt(characterSet.length)],
            ) as string[],
        );
        iterationCount.current = iterationCount.current + 0.1;
      } else {
        setIsAnimating(false);
        clearInterval(interval);
      }
    }, intervalDuration);

    return () => {
      clearInterval(interval);
    };
  }, [children, duration, isAnimating, characterSet, prefersReducedMotion]);

  return (
    // eslint-disable-next-line react-hooks/static-components
    <MotionComponent
      className={cn("overflow-hidden", className)}
      onMouseEnter={handleAnimationTrigger}
      ref={elementRef}
      {...props}
    >
      <AnimatePresence>
        {displayText.map((letter, index) => (
          <motion.span className={cn({ "w-3": letter === " " })} key={index}>
            {letter}
          </motion.span>
        ))}
      </AnimatePresence>
    </MotionComponent>
  );
}
