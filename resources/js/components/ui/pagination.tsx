import * as React from "react"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
    currentPage: number
    totalPages: number
    baseUrl: string
    searchParams?: Record<string, string | undefined>
}

export function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
    if (totalPages <= 1) return null

    const createUrl = (page: number) => {
        const params = new URLSearchParams(searchParams as Record<string, string>)
        params.set('page', page.toString())
        return `${baseUrl}?${params.toString()}`
    }

    return (
        <nav className="flex items-center justify-center gap-1 mt-4" aria-label="Pagination">
            <Link
                href={createUrl(currentPage - 1)}
                className={cn(
                    "h-9 w-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                    currentPage === 1
                        ? "opacity-50 pointer-events-none"
                        : "hover:bg-muted"
                )}
                disabled={currentPage === 1}
            >
                <ChevronLeft className="h-4 w-4" />
            </Link>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                    if (totalPages <= 7) return true
                    if (page === 1 || page === totalPages) return true
                    if (page >= currentPage - 1 && page <= currentPage + 1) return true
                    return false
                })
                .map((page, index, array) => {
                    const prevPage = array[index - 1]
                    const showDots = prevPage && page - prevPage > 1

                    return (
                        <React.Fragment key={page}>
                            {showDots && (
                                <span className="h-9 w-9 flex items-center justify-center text-sm text-muted-foreground">
                                    ...
                                </span>
                            )}
                            <Link
                                href={createUrl(page)}
                                className={cn(
                                    "h-9 w-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                                    currentPage === page
                                        ? "bg-primary text-primary-foreground"
                                        : "hover:bg-muted"
                                )}
                            >
                                {page}
                            </Link>
                        </React.Fragment>
                    )
                })}

            <Link
                href={createUrl(currentPage + 1)}
                className={cn(
                    "h-9 w-9 rounded-md flex items-center justify-center text-sm font-medium transition-colors",
                    currentPage === totalPages
                        ? "opacity-50 pointer-events-none"
                        : "hover:bg-muted"
                )}
                disabled={currentPage === totalPages}
            >
                <ChevronRight className="h-4 w-4" />
            </Link>
        </nav>
    )
}

import { Link } from '@inertiajs/react'