import { useUpdateConceptNameMutation } from "@/src/__generated__";
import { SetStateAction, Suspense, useCallback, useState } from "react";

export const EditableDisplayName = ({
  id,
  displayName,
}: {
  id: number;
  displayName: string;
}) => {
  const [updateConceptNameMutation, { data, loading, error }] =
    useUpdateConceptNameMutation();
  const [inEditMode, setInEditMode] = useState(false);

  const [originalName, setOriginalName] = useState(displayName);
  const [stagedName, setStagedName] = useState(displayName);

  const onClickEditButton = useCallback(() => {
    setInEditMode(true);
  }, []);

  const onInputChange = useCallback(
    (e: { target: { value: SetStateAction<string> } }) => {
      setStagedName(e.target.value);
    },
    []
  );

  const onClickConfirm = useCallback(async () => {
    setInEditMode(false);
    setOriginalName(stagedName);
    await updateConceptNameMutation({
      variables: { id, name: stagedName },
    });
  }, [updateConceptNameMutation, stagedName, id]);

  const onClickCancel = useCallback(() => {
    // revert the name
    setStagedName(originalName);
    setInEditMode(false);
  }, [originalName]);

  return (
    <>
      {inEditMode ? (
        <>
          <input
            className="border mr-4"
            value={stagedName}
            onChange={onInputChange}
          />
          <button onClick={onClickConfirm}>✅</button>{" "}
          <button onClick={onClickCancel}>❌</button>
        </>
      ) : (
        <span>
          {" "}
          {stagedName} <button onClick={onClickEditButton}>📝</button>{" "}
          {loading && <>🚀</>}
        </span>
      )}
    </>
  );
};
