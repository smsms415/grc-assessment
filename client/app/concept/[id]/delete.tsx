"use client";
import { useDeleteConceptMutation } from "@/src/__generated__";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

const ARE_YOU_SURE = "bg-red-600 border-transparent text-white";
const CTA_STYLE = "text-red-600";

export const DeleteForm = ({ id }: { id: string }) => {
  const router = useRouter();
  const [deleteConceptMutation, { data, loading, error }] =
    useDeleteConceptMutation();

  const [dangerMode, setDangerMode] = useState(false);
  const handleDeleteClick = useCallback(async () => {
    if (!dangerMode) {
      setDangerMode(true);
    } else {
      await deleteConceptMutation({
        variables: {
          id: parseInt(id, 10),
        },
      });

      console.log("successs");
      router.push("/");
    }
  }, [dangerMode]);

  const handleCancelClick = useCallback(() => {
    setDangerMode(false);
  }, []);

  return (
    <>
      <button
        onClick={handleDeleteClick}
        className={`px-4 py-1 text-sm font-semibold  border border-red-200  focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 ${
          dangerMode ? ARE_YOU_SURE : CTA_STYLE
        }`}
      >
        {dangerMode ? "ARE YOU SURE?" : "Delete"}
      </button>
      {dangerMode && (
        <button className="ml-4" onClick={handleCancelClick}>
          Cancel
        </button>
      )}
    </>
  );
};
