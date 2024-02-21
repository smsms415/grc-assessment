import { useRef } from "react";
import {
  AllConceptsTableBody,
  ConceptListTableBody,
  SearchConceptsTableBody,
} from "../../tablebody";
import { redirect } from "next/navigation";
import Link from "next/link";

// TODO refactor into shared location
async function doSearch(data: FormData) {
  "use server";
  const searchTerm = encodeURIComponent(data.get("searchTerm") as string);
  redirect(`/concept/search/${searchTerm}`);
}

export default function SearchPage({
  params: { searchString },
}: {
  params: { searchString: string };
}) {
  return (
    <section>
      <div className="flex">
        <form action={doSearch}>
          <input
            className="border"
            name="searchTerm"
            defaultValue={decodeURIComponent(searchString)}
          />{" "}
          <button>🔍</button>
        </form>{" "}
        <Link href="/">❌</Link>
      </div>
      <table className="">
        <thead className="bg-blue-100">
          <tr>
            <th>Id</th>
            <th>Name</th>
            <th>Description</th>
            <th># Children</th>
            <th># Parents</th>
          </tr>
        </thead>
        <SearchConceptsTableBody searchTerm={searchString} />
      </table>
    </section>
  );
}
