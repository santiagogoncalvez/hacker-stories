import React from 'react';
import { CommonListProps } from '../../../types/types';
import Item from './Item';

const CommonList = ({ list, type }: CommonListProps) => {
  return (
    <ul className="news">
      {list.map((item) => (
        <Item key={item.objectId} item={item} type={type} />
      ))}
    </ul>
  );
};

export default React.memo(CommonList);
