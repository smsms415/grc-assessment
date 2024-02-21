"use client";
export const dynamic = "force-dynamic";

import { linkToConceptId } from "@/app/util";
import {
  Concept,
  GetConceptDocument,
  GetConceptSuspenseQueryHookResult,
} from "@/src/__generated__";
import { useSuspenseQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import { EditableDisplayName } from "./editableDisplayName";

export const ConceptInstance = ({ id }: { id: string }) => {
  const parsedId = parseInt(id, 10);
  const result: GetConceptSuspenseQueryHookResult = useSuspenseQuery(
    GetConceptDocument,
    {
      variables: { id: parseInt(id, 10) },
    }
  );
  const { data } = result;

  const { displayName, description, children, parents } =
    data?.concept as Concept;

  return (
    <div className="w-full">
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Concept ID
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {id}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Display Name
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              <EditableDisplayName
                id={parsedId}
                displayName={displayName ?? ""}
              />
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">
              Description
            </dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {description}
            </dd>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <div className="text-sm font-medium leading-6 text-gray-900">
              Children
            </div>
            <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 ">
              {children?.length ? (
                <ul>
                  {(
                    children.filter(
                      (concept) => concept?.displayName?.length
                    ) as [
                      Omit<Concept, "displayName"> & { displayName: string }
                    ]
                  ) // this little trick tells typescript display name is always set
                    .map(({ conceptId, displayName }) => (
                      <li key={`concept-li-${conceptId}`}>
                        {linkToConceptId(conceptId, displayName)}
                      </li>
                    ))}
                </ul>
              ) : (
                <>no children</>
              )}
            </div>
          </div>

          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <div className="text-sm font-medium leading-6 text-gray-900">
              Parents
            </div>
            <div className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 ">
              {parents?.length ? (
                <ul>
                  {(
                    parents.filter(
                      (concept) => concept?.displayName?.length
                    ) as [
                      Omit<Concept, "displayName"> & { displayName: string }
                    ]
                  ) // this little trick tells typescript display name is always set
                    .map(({ conceptId, displayName }) => (
                      <li key={`concept-li-${conceptId}`}>
                        {linkToConceptId(conceptId, displayName)}
                      </li>
                    ))}
                </ul>
              ) : (
                <>no parents</>
              )}
            </div>
          </div>
        </dl>
      </div>
    </div>
  );
};
