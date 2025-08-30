import React from "react";
import Sidebar from "./ui-components/Sidebar";

interface LayoutProps {
    children: React.ReactNode
  }
  
  export default function Layout({ children }: LayoutProps) {
    return (
        <div className="min-h-screen flex w-full bg-background">
          <Sidebar />
          
          <div className="flex-1 flex flex-col">
            <header className="h-14 py-12 border-b border-b-gray-300 border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="flex items-center h-full px-6">
                <h1 className="font-semibold text-foreground text-4xl">
                  Iron Jiu Jitsu Management
                </h1>
              </div>
            </header>
  
            <main className="flex-1 p-6">
              {children}
            </main>
          </div>
        </div>
    )
  }