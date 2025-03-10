"use client"

import React, { useRef, useState, useEffect, ReactNode } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ImageItem {
  src: string
  alt: string
}

function isImageItem(item: ImageItem | ReactNode): item is ImageItem {
  return (
    typeof item === 'object' &&
    item !== null &&
    'src' in item &&
    typeof (item as ImageItem).src === 'string'
  )
}

interface ScrollableGalleryProps {
  items?: (ImageItem | ReactNode)[]
  children?: ReactNode
  itemsPerView?: number
  className?: string
  itemClassName?: string
}

export function ScrollableGallery({
  items,
  children,
  itemsPerView = 5,
  className,
  itemClassName
}: ScrollableGalleryProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [currentPage, setCurrentPage] = useState(0)

  // Determine if we're using children or items
  const usingChildren = Boolean(children)
  const contentItems = usingChildren
    ? React.Children.toArray(children)
    : items || []

  const totalPages = Math.ceil(contentItems.length / itemsPerView)

  const scrollToNextSet = () => {
    if (!scrollContainerRef.current) return

    const containerWidth = scrollContainerRef.current.offsetWidth
    const newScrollPosition = scrollContainerRef.current.scrollLeft + containerWidth

    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    })

    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1)
    }
  }

  const scrollToPrevSet = () => {
    if (!scrollContainerRef.current) return

    const containerWidth = scrollContainerRef.current.offsetWidth
    const newScrollPosition = scrollContainerRef.current.scrollLeft - containerWidth

    scrollContainerRef.current.scrollTo({
      left: newScrollPosition,
      behavior: 'smooth'
    })

    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1)
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return

      const containerWidth = scrollContainerRef.current.offsetWidth
      const scrollPosition = scrollContainerRef.current.scrollLeft
      const newPage = Math.round(scrollPosition / containerWidth)

      if (newPage !== currentPage && newPage >= 0 && newPage < totalPages) {
        setCurrentPage(newPage)
      }
    }
    const scrollContainer = scrollContainerRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll)
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [currentPage, totalPages])

  // Calculate the width percentage based on itemsPerView
  const itemWidthPercentage = 100 / itemsPerView

  return (
    <div className={cn("w-full mx-auto space-y-4", className)}>
      <div
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {usingChildren ? (
          // Render children
          React.Children.map(children, (child, index) => (
            <div
              key={index}
              className={cn(
                "flex-none snap-start",
                itemClassName
              )}
              style={{ width: `${itemWidthPercentage}%`, minWidth: '200px' }}
            >
              <div className="w-full h-full p-1">
                {child}
              </div>
            </div>
          ))
        ) : (
          // Render items
          contentItems.map((item, index) => {
            return (
              <div
                key={index}
                className={cn(
                  "flex-none snap-start",
                  itemClassName
                )}
                style={{ width: `${itemWidthPercentage}%`, minWidth: '200px' }}
              >
                <div className="w-full h-full p-1">
                  {isImageItem(item) ? (
                    <div className="w-full h-full relative aspect-square overflow-hidden rounded-lg border">
                      <Image
                        src={item.src}
                        alt={item.alt || "Gallery image"}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    // Render any other type of content
                    item
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="flex items-center justify-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={scrollToPrevSet}
          disabled={currentPage === 0}
          aria-label="Previous set of items"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <span className="text-sm">
          Page {totalPages > 0 ? currentPage + 1 : 0} of {totalPages}
        </span>

        <Button
          variant="outline"
          size="icon"
          onClick={scrollToNextSet}
          disabled={currentPage === totalPages - 1}
          aria-label="Next set of items"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
