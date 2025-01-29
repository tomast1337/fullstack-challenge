export default async function Page({
  query,
}: {
  query: Promise<{ id: string }>;
}) {
  const id = (await query).id;
  return (
    <div>
      Product <search></search>: {id}
    </div>
  );
}
