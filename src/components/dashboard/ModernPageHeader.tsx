import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ModernPageHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: {
    text: string;
    variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  };
  actions?: Array<{
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    icon?: LucideIcon;
    disabled?: boolean;
  }>;
  className?: string;
}

const ModernPageHeader: React.FC<ModernPageHeaderProps> = ({
  title,
  description,
  icon: Icon,
  badge,
  actions = [],
  className = ""
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`border-b border-border/30 pb-4 mb-6 ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0 gap-4">
        <div className="flex items-center space-x-3">
          {Icon && (
            <div className="bg-primary/10 p-2 rounded-lg border border-primary/20 flex-shrink-0">
              <Icon className="h-5 w-5 text-primary" />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-2 flex-wrap gap-2">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
              {badge && (
                <Badge variant={badge.variant || 'default'} className="font-medium text-xs">
                  {badge.text}
                </Badge>
              )}
            </div>
            {description && (
              <p className="text-muted-foreground text-sm mt-1 max-w-2xl">
                {description}
              </p>
            )}
          </div>
        </div>

        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 flex-shrink-0">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                size="sm"
                disabled={action.disabled}
                className="gap-1.5 text-sm"
                asChild={!!action.href}
              >
                {action.href ? (
                  <a href={action.href}>
                    {action.icon && <action.icon className="h-4 w-4" />}
                    {action.label}
                  </a>
                ) : (
                  <>
                    {action.icon && <action.icon className="h-4 w-4" />}
                    {action.label}
                  </>
                )}
              </Button>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ModernPageHeader;
