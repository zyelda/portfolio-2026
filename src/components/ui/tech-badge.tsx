export function TechBadge({ name }: { name: string }) {
    return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors cursor-default">
        {name}
    </span>
    );
}