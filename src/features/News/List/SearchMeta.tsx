interface SearchMetaProps {
  nbHits: number;
  processingTimeMs: number;
  isLoading?: boolean;
}

const SearchMeta = ({
  nbHits,
  processingTimeMs,
  isLoading,
}: SearchMetaProps) => {
  // Si está cargando o no hay resultados (y no es error), mejor no mostrar nada
  if (isLoading) {
    return (
      <div className="searchMeta">
        <div className="searchMeta-skeleton">
          <div className="searchMeta-skeleton-label"></div>
        </div>
      </div>
    );
  }
  // console.log(processingTimeMs);
  return (
    <div className="searchMeta">
      <span className="searchMeta-count">
        {nbHits.toLocaleString()} results
      </span>
      <span className="searchMeta-time">
        ({parseFloat((processingTimeMs / 1000).toFixed(3))} seconds)
      </span>
    </div>
  );
};

export default SearchMeta;
