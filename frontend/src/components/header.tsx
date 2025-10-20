import { Badge } from "./ui/badge";

const Header = () => {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between gap-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orbix</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Automated monitoring and detection of suspicious trading patterns
            using AI-powered agents
          </p>
        </div>
        <Badge variant="outline">
          <div className="flex items-center gap-2 text-sm">
            <span className="relative flex size-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex size-3 rounded-full bg-primary"></span>
            </span>
            <div className="text-xs">Live</div>
          </div>
        </Badge>
      </div>
    </div>
  );
};

export default Header;
