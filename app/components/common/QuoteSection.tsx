"use client"

interface QuoteSectionProps {
  quote: string
  attribution: string
  showAttributionSymbol?: boolean
  onShare?: () => void
  onDonate?: () => void
  shareButtonText?: string
  donateButtonText?: string
}

export function QuoteSection({
  quote,
  attribution,
  showAttributionSymbol = true,
  onShare,
  onDonate,
  shareButtonText = "Share this page",
  donateButtonText = "Donate Now",
}: QuoteSectionProps) {
  return (
    <section className="px-6 py-16 sm:py-20 md:py-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        {/* Quote and Attribution */}
        <div className="flex-1">
          <blockquote className="mb-6">
            <p className="text-2xl sm:text-3xl md:text-3xl">"{quote}"</p>
          </blockquote>

          <div className="flex items-center gap-2">
            <p className="text-3xl font-medium">— {attribution}</p>
            {showAttributionSymbol && (
              <span className="text-2xl" title="Peace be upon him">
                ﷺ
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={onShare}
            className="px-6 py-3 bg-[#3F3F46] text-white font-semibold rounded-lg transition-colors duration-200 text-center whitespace-nowrap"
            aria-label="Share this page"
          >
            {shareButtonText}
          </button>

          <button
            onClick={onDonate}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-200 text-center whitespace-nowrap"
            aria-label="Donate now"
          >
            {donateButtonText}
          </button>
        </div>
      </div>
    </section>
  )
}
