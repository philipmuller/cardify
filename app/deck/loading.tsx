"use client";

import GridLoader from "react-spinners/GridLoader";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="h-screen flex items-center justify-center">
      <GridLoader size={60} margin={0} color="#a8a29e" loading={true} />
    </div>
  );
}
