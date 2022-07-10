import { useState, useEffect, useRef } from 'react';
import './InfoPanel.scss';

export interface InfoPanelProps {
  decks: object;
  cargo: object;
}

export const InfoPanel = (props: InfoPanelProps) => {
  const { decks, cargo } = props;
  const [ isCollapsed, setIsCollapsed ] = useState(null);

  const handleClick = (e): void => {
    setIsCollapsed(!isCollapsed);
    localStorage.setItem('infoPanelIsCollapsed', JSON.stringify(!isCollapsed));
  }
  
  useEffect(() => {
    setIsCollapsed(JSON.parse(localStorage.getItem('infoPanelIsCollapsed') || 'false'))

    return () => {
    }
  });

  return (
    <div className="InfoPanel">
      <p onClick={handleClick}>collapse</p>
      <p>InfoPanel: I am {`${isCollapsed ? 'closed' : 'open'}`}.</p>
      <hr />
      <p>{JSON.stringify(cargo)}</p>
    </div>
  );
}

export default InfoPanel;