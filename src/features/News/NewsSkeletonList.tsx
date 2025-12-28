const StorySkeleton = () => {
  return (
    <li className="story story--skeleton">
      <div className="storyLink">
        <div className="storyLinkData">
          {/* Título */}
          <div className="skeleton skeleton-title" />

          {/* Info */}
          <div className="storyLinkInfo">
            <div className="skeleton-row">
              <div className="skeleton skeleton-label" />
              <div className="skeleton skeleton-label" />

              <div className="skeleton skeleton-label" />
            </div>

            <div className="skeleton-row row-2">
              <div className="skeleton skeleton-label" />
              {/* <div className="skeleton skeleton-value" /> */}
            </div>

            {/* <div className="skeleton-row">
              <div className="skeleton skeleton-label" />
              <div className="skeleton skeleton-value small" />
            </div> */}
          </div>
        </div>
      </div>

      {/* Botón */}
      <div className="removeButton skeleton skeleton-button" />
    </li>
  );
};

type Props = {
  items?: number;
};

const SkeletonList = ({ items = 6 }: Props) => {
  return (
    <ul className="news news-skeleton">
      {Array.from({ length: items }).map((_, index) => (
        <StorySkeleton key={index} />
      ))}
    </ul>
  );
};

const NewsSkeletonList = ({ items = 6 }: Props) => (
  <div className="listContainer">
    {/* <ListControlsSkeleton /> */}
    <SkeletonList items={items} />
  </div>
);
export default NewsSkeletonList;
