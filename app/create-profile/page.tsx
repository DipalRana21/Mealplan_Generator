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
  const response = await fetch("/api/create-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    const errorText = await response.text();
    // Try to parse as JSON, fallback to text
    try {
      const errorJson = JSON.parse(errorText);
      throw new Error(errorJson.error || "Request failed");
    } catch {
      throw new Error(`API Error ${response.status}: ${errorText}`);
    }
  }
  return response.json();
}

export default function CreateProfile() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const { mutate, isPending } = useMutation<ApiResponse, Error>({
    mutationFn: createProfileRequest,
    onSuccess: () => {
      // User is synced, send them to the real app
      router.push("/subscribe"); // or /dashboard
    },
    onError: (err) => {
      console.error("Mutation Error:", err);
      // Optional: Add a UI alert here so you know if it fails
    },
  });

  useEffect(() => {
    // FIX: Used && instead of comma
    if (isLoaded && isSignedIn) {
      mutate();
    }
  }, [isLoaded, isSignedIn]); 

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-2">
        {/* Simple loader to show something is happening */}
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
        <p className="text-gray-500">Setting up your account...</p>
      </div>
    </div>
  );
}