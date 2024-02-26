"use client";
import { useCreateConceptMutation } from "@/src/__generated__";
import { redirect, useRouter } from "next/navigation";
import { useCallback } from "react";

export default function CreateForm() {
  const router = useRouter();
  const [createConceptMutation, { data, loading, error }] =
    useCreateConceptMutation();

  const addConcept = useCallback(async (fd: FormData) => {
    const name = fd.get("conceptName") as string;

    await createConceptMutation({ variables: { name } });

    redirect("/");
  }, []);

  return (
    <form action={addConcept} className="mt-4">
      <legend className="text-sm">Create new concept</legend>
      <label>
        Name
        <input className="border ml-3" name="conceptName" />{" "}
        <button className="bg-blue-300 hover:bg-blue-700 text-white">
          create
        </button>
      </label>
    </form>
  );
}
