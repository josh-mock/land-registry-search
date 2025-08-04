import SearchPage from "@/components/features/SearchPage";

export default function DynamicSearchPage({ params }) {
  return <SearchPage searchType={params.searchType} />;
}
