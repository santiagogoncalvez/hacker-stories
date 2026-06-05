import { SkeletonListProps } from '../../types/types';

const StoryTableSkeletonRow = () => {
  return (
    <tr className="tableSkeletonRow">
      <td className="listContainer__cell" data-col="TITLE">
        <div className="skeleton skeleton-table-title" />
      </td>

      <td className="listContainer__cell" data-col="AUTHOR">
        <div className="skeleton skeleton-table-author" />
      </td>

      <td className="listContainer__cell" data-col="POINTS">
        <div className="skeleton skeleton-table-number" />
      </td>

      <td className="listContainer__cell" data-col="COMMENTS">
        <div className="skeleton skeleton-table-number" />
      </td>

      <td className="listContainer__cell" data-col="CREATED_AT">
        <div className="skeleton skeleton-table-date" />
      </td>

      <td className="listContainer__cell" data-col="ACTION">
        <div className="skeleton skeleton-table-action" />
      </td>
    </tr>
  );
};

export const StoriesTableSkeleton = ({ items = 10 }: SkeletonListProps) => {
  return (
    <div className="listContainer">
      <div className="listContainer__tableContainer">
        <table className="listContainer__responsiveTable" data-type="story">
          <tbody>
            {Array.from({ length: items }).map((_, index) => (
              <StoryTableSkeletonRow key={index} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
