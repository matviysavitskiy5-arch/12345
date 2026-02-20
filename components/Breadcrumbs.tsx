import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  active?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  // Don't render if it's just the root level (Home)
  if (items.length <= 1) return null;

  return (
    <nav className="flex items-center flex-wrap text-sm text-gray-500 mb-6 bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm w-fit animate-in fade-in slide-in-from-top-2 duration-300">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 mx-2 text-gray-300 flex-shrink-0" />}
          <button
            onClick={item.onClick}
            disabled={!item.onClick || item.active}
            className={`flex items-center transition-colors ${
              item.active 
                ? "font-bold text-blue-600 cursor-default" 
                : item.onClick 
                  ? "hover:text-blue-600 text-gray-600 font-medium" 
                  : "text-gray-400 cursor-default"
            }`}
          >
            {index === 0 ? <Home className="w-4 h-4" /> : item.label}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
};