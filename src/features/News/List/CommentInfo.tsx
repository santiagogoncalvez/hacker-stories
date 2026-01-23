import React from 'react';
import ProfileIcon from '../../../assets/author.svg?react';
import { formatUpdatedDate } from '../../../utils/formatDate';
import { Story } from '../../../types/types';

interface Props {
  item: Story;
}

const CommentInfo = ({ item }: Props) => {
  return (
    <dl className="storyLinkInfo">
      <div>
        <div>
          <dt className="label">
            <ProfileIcon width={20} height={20} />
          </dt>
          <dd>{item.author}</dd>
        </div>

        {formatUpdatedDate('Posted ', item.createdAtI)}
      </div>

      <p className="storyLinkInfo commentText">{item.commentText}</p>

      {item.url ? (
        <span>
          <span style={{ color: 'var(--gray)' }}> Comment on:</span> &nbsp;
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="storyLink"
          >
            {item.title}
          </a>
        </span>
      ) : (
        <span>
          <span>Comment on:</span>
          &nbsp;
          <p
            style={{ display: 'inline', fontSize: '1.2rem', fontWeight: '500' }}
          >
            {item.title}
          </p>
        </span>
      )}
    </dl>
  );
};

export default React.memo(CommentInfo);
