'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getPosts } from './actions/posts'

export default function Home() {
  const router = useRouter()
  const { user } = useAuth()

  useEffect(() => {
    async function fetchPosts() {
      const res = await getPosts();
      console.log(res);
    }
    fetchPosts();
  }, []);

  useEffect(() => {
    if (user) {
      switch (user.role) {
        case 'superadmin':
          router.push('/superadmin/dashboard')
          break
        case 'admin':
          router.push('/admin/dashboard')
          // router.push('/lecturer/dashboard')
          break
        case 'lecturer':
          router.push('/lecturer/dashboard')
          // router.push('/admin/dashboard')

          break
        default:
          router.push('/login')
      }
    } else {
      router.push('/login')
    }
  }, [user, router])

  return null
}

