import { useRef } from "react";
import { AllConceptsTableBody, ConceptListTableBody } from "../../tablebody";
import { redirect } from "next/navigation";

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
      <form action={doSearch}>
        <input
          className="border"
          name="searchTerm"
          defaultValue={decodeURIComponent(searchString)}
        />{" "}
        <button>🔍</button>
      </form>
      {/* <ConceptListTable /> */}
    </section>
  );
}
