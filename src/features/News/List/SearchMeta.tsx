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

  return (
    <div className="searchMeta">
      <span className="searchMeta-count">
        {nbHits.toLocaleString()} resultados
      </span>
      <span className="searchMeta-time">
        ({processingTimeMs / 1000} segundos)
      </span>
    </div>
  );
};

export default SearchMeta;
