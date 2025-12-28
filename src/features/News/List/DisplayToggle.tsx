import React from 'react';
import SquaresIcon from '../../../assets/squares.svg?react';
import ListIcon from '../../../assets/list.svg?react';
import { DisplayType } from '../../../types/types';

interface DisplayProps {
  display: DisplayType;
  onClick: (type: DisplayType) => void;
}

const DisplayToggle = ({ display, onClick }: DisplayProps) => {
  return (
    <div className="display">
      <button
        className={display === 'CARD' ? 'active' : ''}
        type="button"
        onClick={() => onClick('CARD' as DisplayType)}
      >
        <SquaresIcon width={25} height={25} />
      </button>
      <button
        className={display === 'LIST' ? 'active' : ''}
        type="button"
        onClick={() => onClick('LIST' as DisplayType)}
      >
        <ListIcon width={25} height={25} />
      </button>
    </div>
  );
};

export default React.memo(DisplayToggle);
