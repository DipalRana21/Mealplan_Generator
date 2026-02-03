import { SignUp } from "@clerk/nextjs";

export default function SignUpPage()
{
   return (
       <div>
         {/* <SignUp signInFallbackRedirectUrl="/create-profile"/> */}
         <SignUp forceRedirectUrl="/create-profile" />
      </div>

   )
  
}