import type { ReactNode } from 'react';

type Props = {
  title: string;
  text: string;
  action?: ReactNode;
};

export const EmptyState = ({ title, text, action }: Props) => (
  <section className="empty-state">
    <h2>{title}</h2>
    <p>{text}</p>
    {action}
  </section>
);
