"use client"

import { signIn } from "next-auth/react" // next-auth/react에서 signIn 사용
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignInForm({
  provider,
  callbackUrl,
}: {
  provider: { id: string; name: string }
  callbackUrl: string
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    try {
      const result = await signIn(provider.id, {
        redirect: false, // 수동 리다이렉트
        callbackUrl: "/", // 기본 리다이렉트를 설정
      })

      console.log(result); // 결과를 확인하여 디버깅

      if (!result?.error) {
        router.push(callbackUrl || "/") // 로그인 성공 시 리다이렉트
      } else {
        setError("Login failed. Please try again.")
      }
    } catch (err) {
        console.log(err);
      setError("An error occurred. Please try again.")
    }
  }

  return (
    <div>
      <button
        onClick={handleSignIn}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
      >
        <span>Sign in with {provider.name}</span>
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  )
}