import * as React from "react"
import { cn } from "@/lib/utils"

const Select = ({ children, value, onValueChange }: { children: React.ReactNode, value: any, onValueChange: (value: string) => void }) => {
    return (
        <div className="relative inline-block w-full">
            <select
                value={value}
                onChange={(e) => onValueChange(e.target.value)}
                className="w-full h-10 bg-luxury-dark border border-gold-500/30 rounded-md px-3 text-champagne-200 text-sm focus:outline-none focus:ring-1 focus:ring-gold-500 appearance-none"
            >
                {children}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-silver-500">
                ▼
            </div>
        </div>
    );
};

const SelectTrigger = ({ children, className }: any) => <div className={cn("", className)}>{children}</div>;
const SelectValue = ({ placeholder }: any) => <span>{placeholder}</span>;
const SelectContent = ({ children }: any) => <>{children}</>;
const SelectItem = ({ value, children }: any) => <option value={value}>{children}</option>;

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem }
