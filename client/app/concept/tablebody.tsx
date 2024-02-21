"use client";
export const dynamic = "force-dynamic";

import { linkToConceptId } from "@/app/util";
import {
  AllConceptsDocument,
  AllConceptsSuspenseQueryHookResult,
  Concept,
} from "@/src/__generated__";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
const TD_CLASSNAME = "border px-4";

export const AllConceptsTableBody = () => {
  const result: AllConceptsSuspenseQueryHookResult =
    useSuspenseQuery(AllConceptsDocument);

  const {
    data: { allConcepts },
  } = result;

  if (!allConcepts) {
    return;
  }

  return <ConceptListTableBody allConcepts={allConcepts as Concept[]} />;
};

export const ConceptListTableBody = ({
  allConcepts,
}: {
  allConcepts: Concept[];
}) => {
  return (
    <tbody className="">
      {allConcepts.map(
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
              {childIds?.length}
              {/* TODO: display the children on hover */}
            </td>
            <td className={`${TD_CLASSNAME} text-center`}>
              {parentIds?.length}
              {/* TODO: display the parents on hover */}
            </td>
          </tr>
        )
      )}
    </tbody>
  );
};
