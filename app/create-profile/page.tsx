// "use client"
// import { useUser } from "@clerk/nextjs";
// import { useMutation } from "@tanstack/react-query"
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";

// type ApiResponse = {
//     message: string;
//     error?: string;
// };

// async function createProfileRequest() {
//     const response = await fetch('/api/create-profile', {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         }
//     })

//     // const data = await response.json()
//     const res = await fetch("/api/create-profile", {
//   method: "POST",
// });

// if (!res.ok) {
//   const text = await res.text();
//   console.error("API error:", text);
//   throw new Error("Request failed");
// }

// return res.json();

//     // return data as ApiResponse
// }

// export default function CreateProfile() {

//     const { isLoaded, isSignedIn } = useUser()
//     const router = useRouter();

//     const { mutate, isPending } = useMutation<ApiResponse, Error>({
//         mutationFn: createProfileRequest,
//         onSuccess: (data) => {
//             router.push("/subscribe");
//         },
//         onError: (err) => {
//             console.log(err);
//         }
//     });

//     useEffect(() => {
//         if (isLoaded && isSignedIn && !isPending) {
//             mutate()
//         }
//     }, [isLoaded, isSignedIn])

//     return <div>Processing sign in...</div>
    
// }

"use client";
import { useUser } from "@clerk/nextjs";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ApiResponse = {
  message: string;
  error?: string;
};

async function createProfileRequest() {
  // Only fetch ONCE
  const response = await fetch("/api/create-profile", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Handle non-200 responses safely
  if (!response.ok) {
    // Attempt to parse JSON error, fallback to text if it's HTML (the 500/404 error page)
    const errorText = await response.text();
    let errorJson;
    try {
        errorJson = JSON.parse(errorText);
    } catch (e) {
        throw new Error(`API Error (Status ${response.status}): ${errorText}`);
    }
    throw new Error(errorJson.error || "Request failed");
  }

  return response.json();
}

export default function CreateProfile() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const { mutate, isPending } = useMutation<ApiResponse, Error>({
    mutationFn: createProfileRequest,
    onSuccess: (data) => {
      console.log("Profile created:", data);
      router.push("/subscribe");
    },
    onError: (err) => {
      console.error("Mutation Error:", err);
    },
  });

  useEffect(() => {
    if (isLoaded && isSignedIn && !isPending) {
      mutate();
    }
  }, [isLoaded, isSignedIn]); // Removed isPending to prevent loops, though logic was okay

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Setting up your account...</p>
    </div>
  );
}