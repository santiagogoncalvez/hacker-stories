import ArrowIcon from '../../assets/arrow.svg?react';

const MoreButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <div className="moreButton-container">
      <button
        type="button"
        className="moreButton"
        title="More news"
        onClick={() => onClick()}
      >
        More {<ArrowIcon width={15} height={15} />}
      </button>
    </div>
  );
};

export default MoreButton;
