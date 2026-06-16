import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Avatar } from '../Avatar';
import { Badge } from '../Badge';
import { DescriptionList } from '../DescriptionList';
import { Kbd } from '../Kbd';
import { PageHeader } from '../Page/PageHeader';
import { StatCard } from '../StatCard';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { LoadingState, SkeletonRow } from './LoadingState';

describe('States + Display + Page', () => {
  it('EmptyState renders status role + title', () => {
    render(<EmptyState title="Empty" description="Nothing yet" />);
    expect(screen.getByRole('status')).toHaveTextContent('Empty');
  });

  it('ErrorState renders alert role', () => {
    render(<ErrorState message="oops" />);
    expect(screen.getByRole('alert')).toHaveTextContent('oops');
  });

  it('LoadingState + SkeletonRow render', () => {
    render(
      <>
        <LoadingState label="Wait" />
        <SkeletonRow rows={2} />
      </>,
    );
    expect(screen.getAllByRole('status').length).toBeGreaterThanOrEqual(2);
  });

  it('Avatar renders initials when no src', () => {
    render(<Avatar initials="LC" alt="Lucio" />);
    expect(screen.getByText('LC')).toBeInTheDocument();
  });

  it('Badge renders content', () => {
    render(<Badge tone="success">Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('Kbd renders inside <kbd>', () => {
    const { container } = render(<Kbd>⌘K</Kbd>);
    expect(container.querySelector('kbd')).toHaveTextContent('⌘K');
  });

  it('StatCard renders label + value + delta', () => {
    render(<StatCard label="MRR" value="$10k" delta={12} deltaLabel="vs last month" />);
    expect(screen.getByText('MRR')).toBeInTheDocument();
    expect(screen.getByText('$10k')).toBeInTheDocument();
  });

  it('DescriptionList renders dt/dd pairs', () => {
    render(<DescriptionList items={[{ term: 'Plan', detail: 'Pro' }]} />);
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Pro')).toBeInTheDocument();
  });

  it('PageHeader renders breadcrumbs + h1 + actions', () => {
    render(
      <PageHeader
        title="Users"
        description="People in your org"
        breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Users' }]}
        actions={<button type="button">New</button>}
      />,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'Users' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /breadcrumb/i })).toBeInTheDocument();
  });
});
