import Link from "next/link";

export const linkToConceptId = (id: number, str: string) => (
  <Link className="underline text-blue-600" href={`/concept/${id}`}>
    {str}
  </Link>
);
