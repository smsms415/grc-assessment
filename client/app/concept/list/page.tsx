import { useRef } from "react";
import { AllConceptsTableBody, ConceptListTableBody } from "../tablebody";
import { redirect } from "next/navigation";

export default function ListPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return (
    <section>
      <form action={doSearch}>
        <input className="border" name="searchTerm" /> <button>🔍</button>
      </form>
      <ConceptListTable />
    </section>
  );
}

// TODO refactor into shared location
async function doSearch(data: FormData) {
  "use server";
  const searchTerm = encodeURIComponent(data.get("searchTerm") as string);

  redirect(`/concept/search/${searchTerm}`);
}

/*
 * TODO: next (or maybe apollo client?) needs to refresh the cache when a
 * concept is updated.
 */
const ConceptListTable = () => {
  return (
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
      <AllConceptsTableBody />
    </table>
  );
};
