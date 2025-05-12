import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";

export const TopProductsSkeleton = () => (
  <div className="flex flex-col gap-6 w-full">
    <div className="flex items-center justify-between w-full">
      <div className="flex items-start gap-6">
        <Skeleton className="w-[180px] h-10" />
        <Skeleton className="w-[240px] h-10" />
      </div>
      <Skeleton className="w-[180px] h-10" />
    </div>
    <Card className="flex-1 rounded-md shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 pb-2 px-6 pt-6">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-48 h-6" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-6 pt-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col bg-[#F8FAFC] rounded-md p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <Skeleton className="w-12 h-6" />
                  <div className="flex items-center">
                    <Skeleton className="w-20 h-20 rounded-md" />
                    <div className="w-px h-16 bg-[#E2E8F0] mx-4" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-32 h-5" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </div>
                </div>
                <Skeleton className="w-16 h-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export const TopClientsSkeleton = () => (
  <Card className="rounded-md shadow-md">
    <CardHeader className="pb-2 px-6 pt-6">
      <div className="flex items-center gap-4">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-48 h-6" />
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-4 px-6 pb-6">
      {[...Array(3)].map((_, index) => (
        <Card
          key={index}
          className="transition-all duration-200 hover:shadow-md rounded-md"
        >
          <CardContent className="px-6 py-4">
            <Skeleton className="w-48 h-6" />
          </CardContent>
        </Card>
      ))}
    </CardContent>
  </Card>
);

export const StatsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <Card key={index} className="rounded-md shadow-md">
        <CardContent className="p-6">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Skeleton className="w-6 h-6 rounded-full" />
              <Skeleton className="w-32 h-6" />
            </div>
            <Skeleton className="w-24 h-8" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export const DashboardSectionSkeleton = () => (
  <div className="flex gap-8 w-full">
    <Card className="flex-1 rounded-md shadow-md">
      <CardHeader className="flex flex-row items-center gap-4 pb-2 px-6 pt-6">
        <Skeleton className="w-6 h-6 rounded-full" />
        <Skeleton className="w-48 h-6" />
      </CardHeader>
      <CardContent className="p-0">
        <div className="flex flex-col gap-4 p-6 pt-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex flex-col bg-[#F8FAFC] rounded-md p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                  <Skeleton className="w-12 h-6" />
                  <div className="flex items-center">
                    <Skeleton className="w-20 h-20 rounded-md" />
                    <div className="w-px h-16 bg-[#E2E8F0] mx-4" />
                    <div className="flex flex-col gap-2">
                      <Skeleton className="w-32 h-5" />
                      <Skeleton className="w-24 h-4" />
                    </div>
                  </div>
                </div>
                <Skeleton className="w-16 h-8" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
    <div className="flex flex-col gap-8 flex-1">
      <Card className="rounded-md shadow-md">
        <CardHeader className="pb-2 px-6 pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-48 h-6" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-6 pb-6">
          {[...Array(3)].map((_, index) => (
            <Card
              key={index}
              className="transition-all duration-200 hover:shadow-md rounded-md"
            >
              <CardContent className="px-6 py-4">
                <Skeleton className="w-48 h-6" />
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
      <Card className="flex-1 rounded-md shadow-md">
        <CardHeader className="pb-2 px-6 pt-6">
          <div className="flex items-center gap-4">
            <Skeleton className="w-6 h-6 rounded-full" />
            <Skeleton className="w-48 h-6" />
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 px-6 pb-6">
          {[...Array(2)].map((_, index) => (
            <div
              key={index}
              className="p-4 rounded-md border border-[#E2E8F0] bg-white"
            >
              <div className="flex flex-col gap-2">
                <Skeleton className="w-48 h-5" />
                <Skeleton className="w-32 h-4" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  </div>
);
