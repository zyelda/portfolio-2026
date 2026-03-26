"use client"

import * as React from "react"
import { useRouter, usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { NeuralOracle } from "@/components/ui/neural-oracle";
import { 
  Code, 
  Laptop, 
  Moon, 
  Sun, 
  Terminal, 
  Home, 
  User, 
  Sparkles 
} from "lucide-react"

import {
  CommandDialog,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

interface CommandMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function CommandMenu({ open, setOpen }: CommandMenuProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { setTheme } = useTheme()
  const [openOracle, ReactSetOpenOracle] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [open, setOpen])

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false)
    command()
  }, [setOpen])

  const scrollToSection = (id: string) => {
    if (pathname === "/") {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    } else {
      router.push(`/#${id}`)
    }
  }

  return (
    <> 
      <CommandDialog open={open} onOpenChange={setOpen}>
        {/* CommandInput dan CommandEmpty dihapus agar search bar hilang */}
        <CommandList className="py-2"> {/* Tambahan padding agar menu tidak mepet ke atas */}
          
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => scrollToSection('home'))}>
              <Home className="mr-2 h-4 w-4" />
              <span>Home</span>
            </CommandItem>
            
            <CommandItem onSelect={() => runCommand(() => scrollToSection('about'))}>
              <User className="mr-2 h-4 w-4" />
              <span>About Me</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => scrollToSection('certificates'))}>
              <User className="mr-2 h-4 w-4" />
              <span>Certificates</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => scrollToSection('projects'))}>
              <Code className="mr-2 h-4 w-4" />
              <span>Projects</span>
            </CommandItem>

            <CommandItem onSelect={() => runCommand(() => ReactSetOpenOracle(true))}>
              <Sparkles className="mr-2 h-4 w-4 text-purple-400" />
              <span>Mind Reader</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="System Interface">
            <CommandItem onSelect={() => runCommand(() => setTheme("light"))}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Light Mode</span>
              <CommandShortcut>⇧L</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => setTheme("dark"))}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Dark Mode</span>
              <CommandShortcut>⇧D</CommandShortcut>
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => setTheme("system"))}>
              <Laptop className="mr-2 h-4 w-4" />
              <span>System</span>
            </CommandItem>
          </CommandGroup>

        </CommandList>
      </CommandDialog>

      <NeuralOracle open={openOracle} setOpen={ReactSetOpenOracle} />
    </>
  )
} 