import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SignupPage from "./SignupForm";
import SigninPage from "./SigninForm";
import { useState } from "react";

export function TabsLine() {
  const [activeTab, setActiveTab] = useState("signup");

  return (
    <div className="w-full max-w-md mx-auto px-4 py-6">
      <Tabs
        defaultValue="signup"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList
          variant="line"
          className="w-full bg-transparent border-b border-gray-200 p-0 h-auto"
        >
          <TabsTrigger
            value="signup"
            className="flex-1 py-3 px-6 text-base font-semibold 
              data-[state=active]:text-[#F26A1C] data-[state=inactive]:text-gray-600
              bg-transparent hover:bg-transparent 
              shadow-none data-[state=active]:shadow-none
              border-0 rounded-none
              focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Sign Up
          </TabsTrigger>
          <TabsTrigger
            value="signin"
            className="flex-1 py-3 px-6 text-base font-semibold 
              data-[state=active]:text-[#F26A1C] data-[state=inactive]:text-gray-600
              bg-transparent hover:bg-transparent 
              shadow-none data-[state=active]:shadow-none
              border-0 rounded-none
              focus-visible:ring-0 focus-visible:ring-offset-0"
          >
            Sign In
          </TabsTrigger>
        </TabsList>

        <TabsContent value="signup" className="mt-6">
          <SignupPage />
        </TabsContent>

        <TabsContent value="signin" className="mt-6">
          <SigninPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
