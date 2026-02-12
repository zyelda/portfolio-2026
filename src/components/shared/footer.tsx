export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm py-12 mt-24">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold">Aditias Zulmatoriq</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Building digital experiences with passion & code.
          </p>
        </div>

        <div className="text-sm text-muted-foreground text-center md:text-right">
          <p>© 2026 Neural Architect Portfolio.</p>
          <p className="text-xs mt-1">
            Built with Next.js 15, Tailwind, & Supabase.
          </p>
        </div>

      </div>
    </footer>
  );
}