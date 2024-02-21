"use client";
export const dynamic = "force-dynamic";

import { linkToConceptId } from "@/app/util";
import {
  AllConceptsDocument,
  AllConceptsSuspenseQueryHookResult,
  Concept,
  SearchByStringDocument,
  SearchByStringSuspenseQueryHookResult,
} from "@/src/__generated__";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
const TD_CLASSNAME = "border px-4";

export const AllConceptsTableBody = () => {
  const result: AllConceptsSuspenseQueryHookResult = useSuspenseQuery(
    AllConceptsDocument,
    {
      fetchPolicy: "no-cache",
    }
  );

  const {
    data: { allConcepts },
  } = result;

  if (!allConcepts) {
    return;
  }

  return <ConceptListTableBody concepts={allConcepts as Concept[]} />;
};

export const SearchConceptsTableBody = ({
  searchTerm,
}: {
  searchTerm: string;
}) => {
  const result: SearchByStringSuspenseQueryHookResult = useSuspenseQuery(
    SearchByStringDocument,
    {
      variables: {
        str: searchTerm,
      },
    }
  );
  const {
    data: { searchByString },
  } = result;

  /**
   * @TODO searchByString was not a good name for this array of concepts, rename it
   */
  if (!searchByString) {
    return;
  }

  return <ConceptListTableBody concepts={searchByString as Concept[]} />;
};

export const ConceptListTableBody = ({ concepts }: { concepts: Concept[] }) => {
  return (
    <tbody className="">
      {concepts.map(
        ({ conceptId, displayName, description, childIds, parentIds }) => (
          <tr key={`tr-${conceptId}`}>
            <td className={TD_CLASSNAME}>
              {linkToConceptId(conceptId, `${conceptId}`)}
            </td>
            <td className={TD_CLASSNAME}>
              {linkToConceptId(conceptId, displayName ?? "unnamed concept")}
            </td>
            <td className={TD_CLASSNAME}>{description}</td>
            <td className={`${TD_CLASSNAME} text-center`}>
              {childIds?.length ?? 0}
              {/* TODO: display the children on hover */}
            </td>
            <td className={`${TD_CLASSNAME} text-center`}>
              {parentIds?.length ?? 0}
              {/* TODO: display the parents on hover */}
            </td>
          </tr>
        )
      )}
    </tbody>
  );
};
