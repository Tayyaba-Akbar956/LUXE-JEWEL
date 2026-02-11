import * as React from "react"
import { cn } from "@/lib/utils"

const Dialog = ({ children, open, onOpenChange }: any) => {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 overflow-y-auto">
            <div className="relative bg-luxury-dark border border-gold-500/30 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => onOpenChange(false)}
                    className="absolute top-4 right-4 text-silver-500 hover:text-champagne-200"
                >
                    ✕
                </button>
                {children}
            </div>
        </div>
    );
};

const DialogContent = ({ children, className }: any) => (
    <div className={cn("p-6", className)}>{children}</div>
);

const DialogHeader = ({ children, className }: any) => (
    <div className={cn("mb-4", className)}>{children}</div>
);

const DialogTitle = ({ children, className }: any) => (
    <h2 className={cn("text-2xl font-display text-champagne-200", className)}>{children}</h2>
);

const DialogTrigger = ({ children }: any) => <>{children}</>;

export { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger }
