import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ROUTES } from "@/routes/routePaths";

import SigninForm from "./SigninForm";
import SignupForm from "./SignupForm";

export default function TabsLine() {
  const location = useLocation();
  const isSignup = location.pathname.includes(ROUTES.SIGNUP);
  
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(
    isSignup ? "signup" : "signin"
  );

  useEffect(() => {
    if (location.pathname.includes(ROUTES.SIGNUP)) {
      setActiveTab("signup");
    } else if (location.pathname.includes(ROUTES.SIGNIN) || location.pathname === ROUTES.AUTH) {
      setActiveTab("signin");
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-md mx-auto">
        {/* Brand */}
        <div className="flex justify-center mb-10">{/* <BrandCard /> */}</div>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "signin" | "signup")}
        >
          <TabsList className="w-full bg-transparent border-b border-gray-200 p-0 h-auto rounded-none">
            <TabsTrigger
              value="signin"
              className="flex-1 py-4 text-base font-semibold data-[state=active]:text-[#F26A1C] data-[state=inactive]:text-gray-500 border-b-2 border-transparent data-[state=active]:border-[#F26A1C] rounded-sm"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="flex-1 py-4 text-base font-semibold data-[state=active]:text-[#F26A1C] data-[state=inactive]:text-gray-500 border-b-2 border-transparent data-[state=active]:border-[#F26A1C] rounded-sm"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="mt-8">
            <SigninForm />
          </TabsContent>

          <TabsContent value="signup" className="mt-8">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
