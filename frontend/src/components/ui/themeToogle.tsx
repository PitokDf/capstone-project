'use client'

import { Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from './button'

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    useEffect(() => setMounted(true), [])

    if (!mounted) return null

    return (
        <Button variant={"ghost"} className='cursor-pointer' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
            {theme === 'dark' ?
                <Sun className='text-yellow-400' /> :
                <Moon className='text-gray-800' />}
        </Button>
    )
}
