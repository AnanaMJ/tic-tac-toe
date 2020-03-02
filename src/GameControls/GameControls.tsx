import * as React from 'react';

export interface GameControlsProps {
  reset: React.MouseEventHandler<HTMLElement>;
}

export const GameControls: React.SFC<GameControlsProps> = props => (
  <div className="controls">
    <button key="reset" onClick={props.reset}>Reset</button>
  </div>
)