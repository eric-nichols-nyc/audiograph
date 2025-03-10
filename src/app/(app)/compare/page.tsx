import { CompareHeader } from "@/components/features/compare/compare-header";
import { CompareContainer } from "@/components/features/compare/compare-container";
import { Suspense } from "react";

export default function ComparePage() {
  return (
    <div className="flex min-h-screen flex-col">
      <CompareHeader />
      <main className="container flex-1 py-8">
        <Suspense>
          <CompareContainer />
        </Suspense>
      </main>
    </div>
  );
}