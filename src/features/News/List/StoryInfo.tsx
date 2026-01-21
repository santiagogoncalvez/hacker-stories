import React from 'react';
import { Story } from '../../../types/types';
import ProfileIcon from '../../../assets/author.svg?react';
import CommentsIcon from '../../../assets/comments.svg?react';
import CaretUnfillIcon from '../../../assets/caret-unfill.svg?react';
import { formatUpdatedDate } from '../../../utils/formatDate';

const StoryInfo = ({ item }: { item: Story }) => {
  const fields = [
    { key: 'POINTS', value: item.points, Icon: CaretUnfillIcon },
    { key: 'numComments', value: item.numComments, Icon: CommentsIcon },
    { key: 'AUTHOR', value: item.author, Icon: ProfileIcon },
  ];

  return (
    <dl className="storyLinkInfo">
      <div>
        {fields.map(({ key, value, Icon }) => (
          <div key={key}>
            <dt className="label">
              <Icon width={20} height={20} />
            </dt>
            <dd>{value}</dd>
          </div>
        ))}
      </div>

      {formatUpdatedDate('Created at ', item.createdAtI)}
    </dl>
  );
};

export default React.memo(StoryInfo);
