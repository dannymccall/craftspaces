import React from 'react';

const SkeletonDashboard = () => {
  const skeletonBlock = "bg-neutral-700 rounded-md animate-pulse";

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6 space-y-6">
      {/* Header Cards Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className={`p-4 h-24 ${skeletonBlock}`} />
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <div className="bg-neutral-800 p-4 rounded-xl shadow-md space-y-4">
        <div className={`w-32 h-5 ${skeletonBlock}`} />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={`h-10 ${skeletonBlock}`} />
          ))}
        </div>
      </div>

      {/* Today's Orders Skeleton */}
      <div className="bg-neutral-800 p-4 rounded-xl shadow-md space-y-4">
        <div className={`w-40 h-5 ${skeletonBlock}`} />

        <div className="overflow-x-auto">
          <div className="min-w-full">
            {/* Table Header Skeleton */}
            <div className="grid grid-cols-10 gap-2 bg-neutral-700 p-2 rounded-md">
              {[...Array(10)].map((_, i) => (
                <div key={i} className={`h-4 ${skeletonBlock}`} />
              ))}
            </div>

            {/* Table Rows Skeleton */}
            {[...Array(3)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-10 gap-2 p-2 mt-2 rounded-md bg-neutral-800 hover:bg-neutral-700 transition"
              >
                {[...Array(10)].map((_, i) => (
                  <div key={i} className={`h-4 ${skeletonBlock}`} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonDashboard;
