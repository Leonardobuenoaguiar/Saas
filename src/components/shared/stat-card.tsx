"use client";

import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  iconColor?: string;
  iconBg?: string;
  index?: number;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs. mês passado",
  icon,
  iconColor = "text-violet-600",
  iconBg = "bg-violet-50",
  index = 0,
}: StatCardProps) {
  const isPositive = change !== undefined && change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-500">{title}</p>
              <p className="mt-2 text-2xl font-bold text-gray-900 tracking-tight">{value}</p>
              {change !== undefined && (
                <div className="mt-2 flex items-center gap-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-0.5 text-xs font-semibold",
                      isPositive ? "text-emerald-600" : "text-red-500"
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="h-3.5 w-3.5" />
                    ) : (
                      <TrendingDown className="h-3.5 w-3.5" />
                    )}
                    {Math.abs(change)}%
                  </span>
                  <span className="text-xs text-gray-400">{changeLabel}</span>
                </div>
              )}
            </div>
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-xl shrink-0",
                iconBg
              )}
            >
              <div className={cn("h-5 w-5", iconColor)}>{icon}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
