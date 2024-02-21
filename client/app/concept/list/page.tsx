import { ConceptListTableBody } from "./tablebody";

export default function ListPage({
  params: { id },
}: {
  params: { id: string };
}) {
  return <ConceptListTable />;
}

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
      <ConceptListTableBody />
    </table>
  );
};
