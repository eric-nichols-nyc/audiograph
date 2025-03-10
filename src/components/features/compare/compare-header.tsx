
export function CompareHeader() {
    return (
        <header className="relative border-b border-border/40 overflow-hidden">
            {/* Base gradient layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-card/90 to-background" />

            {/* Top right radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/30 via-primary/5 to-transparent" />

            {/* Bottom left radial gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary/40 via-secondary/10 to-transparent" />

            {/* Content layer */}
            <div className="container h-20 relative">
                <div className="flex items-center justify-center text-center h-full">
                    <h1 className="text-4xl font-semibold tracking-tight bg-gradient-to-r from-primary/90 via-primary to-primary/90 bg-clip-text text-transparent">
                        Compare Artists
                    </h1>
                </div>
            </div>
        </header>
    );
} 