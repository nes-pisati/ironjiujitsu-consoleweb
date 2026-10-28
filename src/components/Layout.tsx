import React from "react";
import { Navigate } from "react-router-dom";
import Sidebar from "./ui-components/Sidebar";
import { TOKEN_KEY } from "../axiosSetup";

interface LayoutProps {
    children: React.ReactNode
  }
  
  export default function Layout({ children }: LayoutProps) {
    if (!localStorage.getItem(TOKEN_KEY)) {
      return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen flex w-auto bg-background ml-60 overflow-y-hidden">
          <Sidebar />
          
          <div className="flex-1 flex flex-col">
            <header className="h-16 border-border bg-white w-full backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed shadow-sm shadow-gray-200">
              <div className="flex items-center h-full px-6">
                <h1 className="font-semibold text-foreground text-2xl">
                  Iron Jiu Jitsu Management
                </h1>
              </div>
            </header>
  
            <main className="flex-1 p-6 pt-22">
              {children}
            </main>
          </div>
        </div>
    )
  }