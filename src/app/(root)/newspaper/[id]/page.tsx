import NewspaperView from "@/components/NewspaperView";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <>
      <NewspaperView id={id} />
    </>
  );
}
