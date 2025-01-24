import { ChevronRight } from "lucide-react"
import Link from "next/link"

export function Breadcrumbs() {
  return (
    <>
      <nav aria-label="Breadcrumb" className="ml-2">
        <ol role="list" className="flex items-center space-x-3 text-sm">
          <li className="flex">
            <Link
              href="/dashboard/quotes/monitoring"
              className=""
            >
              Home
            </Link>
          </li>
          <ChevronRight
            className="size-4 shrink-0 "
            aria-hidden="true"
          />
          <li className="flex">
            <div className="flex items-center">
              <Link
                href="#"
              // aria-current={page.current ? 'page' : undefined}
              >
                Quotes
              </Link>
            </div>
          </li>
        </ol>
      </nav>
    </>
  )
}
