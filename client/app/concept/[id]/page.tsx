import { Suspense } from "react";
import { ConceptInstance } from "./instance";
import Link from "next/link";
import { DeleteForm } from "./delete";

export default async function Page({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <>
      <header className="px-4 sm:px-0 flex justify-between">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Concept Navigator
        </h3>
        <Link className="text-blue-600" href="/concept/list">
          back to list →
        </Link>
      </header>
      <Suspense fallback={<div>Loading...</div>}>
        <ConceptInstance id={id} />
        <DeleteForm id={id} />
      </Suspense>
    </>
  );
}
