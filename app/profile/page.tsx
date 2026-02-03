"use client"
import { Spinner } from "@/components/spinner";
import { useUser } from "@clerk/nextjs"
import Image from "next/image";
import { Toaster } from "react-hot-toast";

export default function Profile()
{
   const {isLoaded, isSignedIn, user} = useUser();

   if(!isLoaded){
      return ( 
      <div>
         <Spinner /> 
         <span>
            Loading...
         </span>
      </div>
      )
   }

   if(!isSignedIn){
      return ( 
      <div>
         <p>Please sign in to view your profile.</p>
      </div>
      )
   }
   return (
      <div> 
         <Toaster position="top-center"/>

         <div>
            <div>
               <div>
                  { user.imageUrl && (
                  <Image 
                     src={user.imageUrl} 
                     alt="User Avatar" 
                     width={100} 
                     height={100} 
                     />
                  )}

                  <h1>{user.firstName} {user.lastName}</h1>
                  <p> {user.primaryEmailAddress?.emailAddress}</p>
               </div>

               <div>
                  <h2> Subscription Details</h2>
               </div>
            </div>
         </div>
      </div>
   )
}