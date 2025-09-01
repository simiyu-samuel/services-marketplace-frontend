import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ModernStatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  isLoading?: boolean;
  className?: string;
  iconColor?: string;
}

const ModernStatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  description, 
  trend, 
  isLoading, 
  className,
  iconColor = "text-primary"
}: ModernStatCardProps) => {
  if (isLoading) {
    return (
      <Card className={cn("relative overflow-hidden", className)}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-4 w-20 bg-muted animate-pulse rounded" />
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
            </div>
            <div className="h-12 w-12 bg-muted animate-pulse rounded-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -2 }}
    >
      <Card className={cn(
        "relative overflow-hidden border-border/40 bg-gradient-to-br from-background via-background to-muted/20 hover:shadow-lg transition-all duration-300 group",
        className
      )}>
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                {title}
              </p>
              <div className="flex items-baseline gap-2">
                <motion.p 
                  className="text-3xl font-bold text-foreground"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  {value}
                </motion.p>
                {trend && (
                  <span className={cn(
                    "text-xs font-medium flex items-center",
                    trend.isPositive ? "text-green-600" : "text-red-600"
                  )}>
                    {trend.isPositive ? "↗" : "↘"} {Math.abs(trend.value)}%
                  </span>
                )}
              </div>
              {description && (
                <p className="text-xs text-muted-foreground">{description}</p>
              )}
            </div>
            <motion.div
              className={cn(
                "h-12 w-12 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                iconColor
              )}
              whileHover={{ rotate: 5 }}
            >
              <Icon className="h-6 w-6" />
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ModernStatCard;
