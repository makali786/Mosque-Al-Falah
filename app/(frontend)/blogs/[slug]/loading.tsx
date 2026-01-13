import LoadingSpinner from "../../components/common/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Skeleton */}
      <div className="relative w-full h-75 sm:h-87.5 md:h-100 lg:h-[calc(100vh-130px)] bg-gray-200 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-tr from-black/50 to-transparent" />
        <div className="relative h-full flex items-end">
          <div className="w-full hn-container py-6 sm:py-10 md:py-12 lg:py-16 xl:py-20">
            <div className="flex flex-col gap-4 sm:gap-5 md:gap-6 xl:gap-6">
              {/* Title Skeleton */}
              <div className="w-3/4 h-12 bg-gray-300 rounded-lg" />
              {/* Breadcrumb Skeleton */}
              <div className="flex items-center gap-2">
                <div className="w-16 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-16 h-6 bg-gray-300 rounded" />
                <div className="w-6 h-6 bg-gray-300 rounded" />
                <div className="w-32 h-6 bg-gray-300 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="max-w-250 mx-auto px-4 md:px-8 py-12 md:py-20">
        <div className="space-y-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-full" />
          <div className="h-6 bg-gray-200 rounded w-5/6" />
          <div className="h-6 bg-gray-200 rounded w-4/5" />
          <div className="h-6 bg-gray-200 rounded w-full" />
          <div className="h-6 bg-gray-200 rounded w-3/4" />
        </div>
      </div>

      {/* Loading Spinner Overlay */}
      <LoadingSpinner size="lg" fullScreen />
    </div>
  );
}
