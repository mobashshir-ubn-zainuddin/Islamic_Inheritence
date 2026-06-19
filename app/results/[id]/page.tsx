import ResultsPage from '../ResultsPage';

type ResultsByIdProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ResultsById({ params }: ResultsByIdProps) {
  const { id } = await params;
  return <ResultsPage resultId={id} />;
}
