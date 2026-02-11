import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Users, Star, MessageSquare, Clock } from 'lucide-react';
import ScrollAnimationWrapper from '@/components/ScrollAnimationWrapper';

interface StatItem {
  icon: React.ElementType;
  endValue: number;
  suffix: string;
  prefix?: string;
  label: string;
  decimals?: number;
}

const stats: StatItem[] = [
  { icon: Users, endValue: 10000, suffix: '+', label: 'Patients Treated' },
  { icon: Star, endValue: 5.0, suffix: '', label: 'Google Rating', decimals: 1 },
  { icon: MessageSquare, endValue: 428, suffix: '+', label: 'Reviews' },
  { icon: Clock, endValue: 6, suffix: '+', label: 'Years Experience' },
];

const useCountUp = (end: number, isVisible: boolean, duration = 2000, decimals = 0) => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const startTime = performance.now();
    const step = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(parseFloat((eased * end).toFixed(decimals)));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, end, duration, decimals]);

  return count;
};

const StatCard: React.FC<{ stat: StatItem; isVisible: boolean; delay: number }> = ({ stat, isVisible, delay }) => {
  const count = useCountUp(stat.endValue, isVisible, 2000, stat.decimals ?? 0);

  return (
    <ScrollAnimationWrapper variant="scale" delay={delay}>
      <div className="flex flex-col items-center text-center p-6">
        <div className="bg-medical-gradient p-4 rounded-full w-16 h-16 flex items-center justify-center mb-4">
          <stat.icon className="h-8 w-8 text-white" />
        </div>
        <span className="text-4xl md:text-5xl font-bold text-primary tabular-nums">
          {stat.decimals ? count.toFixed(stat.decimals) : count.toLocaleString()}
          {stat.suffix}
        </span>
        <span className="text-muted-foreground mt-2 font-medium">{stat.label}</span>
      </div>
    </ScrollAnimationWrapper>
  );
};

const StatsCounter: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {stats.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} isVisible={isVisible} delay={i * 150} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsCounter;
