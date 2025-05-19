"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface Solution {
  id: string
  title: string
  description: string
  image: string
  features: string[]
  benefits: string[]
  caseStudy: {
    name: string
    description: string
    result: string
  }
}

interface SolutionModalProps {
  isOpen: boolean
  onClose: () => void
  solution: Solution
}

export function SolutionModal({ isOpen, onClose, solution }: SolutionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{solution.title}</DialogTitle>
          <DialogDescription className="text-base mt-2">{solution.description}</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <div className="relative h-[250px] rounded-lg overflow-hidden mb-6">
              <Image
                src={solution.image || "/placeholder.svg"}
                alt={solution.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 500px"
                loading="lazy"
              />
            </div>

            <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-3">Key Features</h3>
              <ul className="space-y-2">
                {solution.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3">Benefits</h3>
              <ul className="space-y-2">
                {solution.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-primary/10 p-4 rounded-lg mb-6">
              <h3 className="font-bold text-lg mb-2">Case Study: {solution.caseStudy.name}</h3>
              <p className="mb-3">{solution.caseStudy.description}</p>
              <Badge className="bg-primary text-white">{solution.caseStudy.result}</Badge>
            </div>

            <Button asChild className="w-full">
              <Link href={`/contact?solution=${solution.id}`}>Get Started with This Solution</Link>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
