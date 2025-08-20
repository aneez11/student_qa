import { useEffect, useRef } from "react";
import React from "react";

interface PerformanceMetrics {
  startTime: number;
  endTime?: number;
  duration?: number;
}

export function usePerformanceMonitor(name: string, enabled = false) {
  const metricsRef = useRef<PerformanceMetrics>({ startTime: 0 });

  useEffect(() => {
    if (!enabled) return;

    const metrics = metricsRef.current;
    metrics.startTime = performance.now();

    return () => {
      metrics.endTime = performance.now();
      metrics.duration = metrics.endTime - metrics.startTime;

      console.log(`Performance [${name}]:`, {
        duration: `${metrics.duration.toFixed(2)}ms`,
        startTime: metrics.startTime,
        endTime: metrics.endTime,
      });
    };
  }, [name, enabled]);

  return metricsRef.current;
}

export function measureRenderTime<
  T extends React.ComponentType<Record<string, unknown>>
>(Component: T, name: string): T {
  const MeasuredComponent = (props: React.ComponentProps<T>) => {
    usePerformanceMonitor(
      `Render-${name}`,
      process.env.NODE_ENV === "development"
    );
    return React.createElement(Component, props);
  };

  MeasuredComponent.displayName = `Measured(${
    Component.displayName || Component.name
  })`;
  return MeasuredComponent as T;
}
