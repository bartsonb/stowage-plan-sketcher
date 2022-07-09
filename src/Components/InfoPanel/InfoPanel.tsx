import './InfoPanel.scss';

export interface InfoPanelProps {
  open: boolean;
  decks: object;
  cargo: object;
}

export const InfoPanel = (props: InfoPanelProps) => {
  const { open, decks, cargo } = props;

  return (
    <div className="InfoPanel">
      <p>InfoPanel: I am {open ? 'open' : 'closed'}.</p>
      <hr />
    </div>
  );
}

export default InfoPanel;