
import { ClerkLoaded, ClerkLoading, SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { Loader2 } from "lucide-react";

export default function Page() {

  return (
  <div className="min-h-screen grid grid-cols-1
  lg:grid-cols-2">
    <div className="h-full lg:flex flex-col items-center justify-center px-4">
      <div className="text-center space-y-4 pt-16">
        <h1 className="font-bold text-3xl text-[#2E2A47]">
          Welcome Back!
        </h1>
        <p>
          Log in or Create an account to get back to your dashboard!
        </p>
      </div>
      <div className="flex items-center justify-center mt-8">
        <ClerkLoaded>
          <SignUp path="/sign-up" />          
        </ClerkLoaded>
        <ClerkLoading>
          <Loader2 className=" animate-spin text-muted-foreground"/>
        </ClerkLoading>
           
      </div>
      
    </div>
    <div className="h-full hidden bg-blue-600 lg:flex items-center justify-center">
      <Image src="/finance-project.svg" height={100} width={100} alt="Logo"/>

    </div>
    
  </div>
  )
  
}