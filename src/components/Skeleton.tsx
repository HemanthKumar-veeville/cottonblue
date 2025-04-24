import { cn } from "../lib/utils";

interface SkeletonProps {
  variant?: "table" | "card" | "details" | "form" | "tickets";
  className?: string;
}

const TableSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("w-full animate-pulse", className)}>
    <div className="h-12 bg-gray-200 rounded-t-lg mb-4" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 mb-4">
        <div className="h-4 bg-gray-200 rounded w-1/12" />
        <div className="h-4 bg-gray-200 rounded w-2/12" />
        <div className="h-4 bg-gray-200 rounded w-3/12" />
        <div className="h-4 bg-gray-200 rounded w-2/12" />
        <div className="h-4 bg-gray-200 rounded w-2/12" />
        <div className="h-4 bg-gray-200 rounded w-2/12" />
      </div>
    ))}
  </div>
);

const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("w-full p-4 space-y-4 animate-pulse", className)}>
    <div className="h-8 bg-gray-200 rounded w-3/12" />
    <div className="space-y-3">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-200 rounded" />
      ))}
    </div>
  </div>
);

const DetailsSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("w-full p-6 space-y-8 animate-pulse", className)}>
    <div className="flex gap-8">
      <div className="w-1/3 h-[300px] bg-gray-200 rounded-lg" />
      <div className="flex-1 space-y-6">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="flex gap-4 pt-4">
          <div className="h-10 bg-gray-200 rounded flex-1" />
          <div className="h-10 bg-gray-200 rounded flex-1" />
        </div>
      </div>
    </div>
    <div className="space-y-4">
      <div className="h-6 bg-gray-200 rounded w-1/4" />
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  </div>
);

const FormSkeleton = ({ className }: { className?: string }) => (
  <div
    className={cn("w-full max-w-2xl p-6 space-y-6 animate-pulse", className)}
  >
    <div className="h-8 bg-gray-200 rounded w-1/4" />
    <div className="grid grid-cols-2 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4" />
          <div className="h-10 bg-gray-200 rounded w-full" />
        </div>
      ))}
    </div>
    <div className="flex justify-end">
      <div className="h-10 bg-gray-200 rounded w-1/4" />
    </div>
  </div>
);

const TicketsSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("w-full p-6 space-y-6 animate-pulse", className)}>
    {/* Header */}
    <div className="flex justify-between items-center">
      <div className="h-8 bg-gray-200 rounded w-1/6" />
      <div className="h-10 bg-gray-200 rounded w-1/6" />
    </div>

    {/* Search and Filter */}
    <div className="flex gap-4 items-center">
      <div className="flex-1 h-10 bg-gray-200 rounded" />
      <div className="w-[180px] h-10 bg-gray-200 rounded" />
    </div>

    {/* Two Column Layout */}
    <div className="flex gap-4">
      {/* In Progress Column */}
      <div className="flex-1 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div
              key={`left-${i}`}
              className="p-4 bg-gray-200 rounded-lg h-24"
            />
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="w-[1px] bg-gray-200" />

      {/* Closed Column */}
      <div className="flex-1 space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4" />
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div
              key={`right-${i}`}
              className="p-4 bg-gray-200 rounded-lg h-24"
            />
          ))}
        </div>
      </div>
    </div>
  </div>
);

export function Skeleton({ variant = "table", className }: SkeletonProps) {
  const skeletons = {
    table: TableSkeleton,
    card: CardSkeleton,
    details: DetailsSkeleton,
    form: FormSkeleton,
    tickets: TicketsSkeleton,
  };

  const Component = skeletons[variant];
  return <Component className={className} />;
}
