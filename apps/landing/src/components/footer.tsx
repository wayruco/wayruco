"use client";

import { getVersionString, getBuildInfo, getEnvironment } from "@/lib/version";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Github, Globe, Calendar, Code, Package } from "lucide-react";

export function Footer() {
  const version = getVersionString();
  const buildInfo = getBuildInfo();
  const environment = getEnvironment();

  return (
    <footer className="sticky bottom-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Left side - Company info */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="text-sm font-medium">WayruCo</span>
            </div>
            <p className="text-xs text-muted-foreground">
              © 2025 WayruCo - Open Source Internet Initiative. Not affiliated with Wayru Inc.
            </p>
          </div>

          <Separator className="md:hidden" />

          {/* Center - Version info */}
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span className="text-sm font-mono">{version}</span>
              <Badge
                variant={environment === "production" ? "default" : "secondary"}
                className="text-xs"
              >
                {environment}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{buildInfo}</span>
            </div>
          </div>

          <Separator className="md:hidden" />

          {/* Right side - Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/wayruco/wayruco"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-4 w-4" />
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <a
              href="/changelog"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <Code className="h-4 w-4" />
              <span className="hidden sm:inline">Changelog</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
