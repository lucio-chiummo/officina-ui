import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Pencil, Trash2 } from 'lucide-react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AnimatedList } from './AnimatedList';
import { AnimatedNumber } from './AnimatedNumber';
import { AvatarStack } from './Avatar';
import { BentoCard, BentoGrid } from './BentoGrid';
import { BorderBeam } from './BorderBeam';
import { IconButton } from './Button';
import { CopyField } from './CopyField';
import { FileItem } from './FileUpload';
import { GradientText } from './GradientText';
import { ImagePreview } from './ImagePreview';
import { InlineNotice } from './InlineNotice';
import { Shortcut } from './Kbd';
import { LoadingOverlay } from './LoadingOverlay';
import { ActionMenu, RowActions } from './Menu';
import { MetadataList } from './MetadataList';
import { Meter } from './Meter';
import { PropertyList } from './PropertyList';
import { Ripple } from './Ripple';
import { SpotlightCard } from './SpotlightCard';
import { StatusLabel } from './StatusLabel';
import { SwatchPicker } from './SwatchPicker';
import { Tilt } from './Tilt';

const writeText = vi.fn().mockResolvedValue(undefined);

beforeEach(() => {
  writeText.mockClear();
  Object.assign(navigator, { clipboard: { writeText } });
});

describe('IconButton', () => {
  it('renders an accessible icon-only button', () => {
    const onClick = vi.fn();
    render(<IconButton aria-label="Delete" icon={<Trash2 />} onClick={onClick} />);
    const button = screen.getByRole('button', { name: 'Delete' });
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});

describe('ActionMenu', () => {
  it('exposes a labelled overflow trigger', () => {
    render(
      <ActionMenu
        label="Row actions"
        items={[{ label: 'Edit' }, { label: 'Delete', danger: true }]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Row actions' })).toBeInTheDocument();
  });
});

describe('RowActions', () => {
  it('renders inline actions and collapses overflow into a menu', () => {
    render(
      <RowActions
        max={1}
        actions={[
          { label: 'Edit', icon: <Pencil /> },
          { label: 'Delete', icon: <Trash2 />, danger: true },
        ]}
      />,
    );
    expect(screen.getByRole('button', { name: 'Edit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'More actions' })).toBeInTheDocument();
  });
});

describe('PropertyList', () => {
  it('renders label/value rows as a definition list', () => {
    render(
      <PropertyList
        items={[
          { label: 'Plan', value: 'Growth' },
          { label: 'Seats', value: '12' },
        ]}
      />,
    );
    expect(screen.getByText('Plan')).toBeInTheDocument();
    expect(screen.getByText('Growth')).toBeInTheDocument();
  });
});

describe('MetadataList', () => {
  it('copies a value via the inline copy button', async () => {
    render(
      <MetadataList
        items={[{ label: 'API key', value: 'sk_live_123', copyValue: 'sk_live_123' }]}
      />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('sk_live_123');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument());
  });
});

describe('StatusLabel', () => {
  it('renders toned text with a status dot', () => {
    render(<StatusLabel tone="success">Active</StatusLabel>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });
});

describe('AvatarStack', () => {
  it('shows an overflow chip beyond max', () => {
    render(
      <AvatarStack
        max={2}
        avatars={[{ name: 'Ada Lovelace' }, { name: 'Alan Turing' }, { name: 'Grace Hopper' }]}
      />,
    );
    expect(screen.getByText('+1')).toBeInTheDocument();
  });
});

describe('CopyField', () => {
  it('copies the underlying value', async () => {
    render(<CopyField label="Token" value="tok_abc" />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy' }));
    expect(writeText).toHaveBeenCalledWith('tok_abc');
    await waitFor(() => expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument());
  });
});

describe('LoadingOverlay', () => {
  it('renders a live status only when visible', () => {
    const { rerender } = render(<LoadingOverlay visible={false} label="Saving" />);
    expect(screen.queryByText('Saving')).not.toBeInTheDocument();
    rerender(<LoadingOverlay visible label="Saving" />);
    expect(screen.getByText('Saving')).toBeInTheDocument();
  });
});

describe('FileItem', () => {
  it('formats size and wires remove/retry', () => {
    const onRemove = vi.fn();
    const onRetry = vi.fn();
    render(
      <FileItem
        name="report.pdf"
        size={1536}
        status="error"
        error="Upload failed"
        onRemove={onRemove}
        onRetry={onRetry}
      />,
    );
    expect(screen.getByText('report.pdf')).toBeInTheDocument();
    expect(screen.getByText('1.5 KB')).toBeInTheDocument();
    expect(screen.getByText('Upload failed')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(onRetry).toHaveBeenCalledOnce();
    fireEvent.click(screen.getByRole('button', { name: 'Remove' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});

describe('ImagePreview', () => {
  it('renders the image and removes on click', () => {
    const onRemove = vi.fn();
    render(<ImagePreview src="blob:test" alt="Avatar" name="avatar.png" onRemove={onRemove} />);
    expect(screen.getByRole('img', { name: 'Avatar' })).toHaveAttribute('src', 'blob:test');
    fireEvent.click(screen.getByRole('button', { name: 'Remove avatar.png' }));
    expect(onRemove).toHaveBeenCalledOnce();
  });
});

describe('AnimatedNumber', () => {
  it('exposes the final formatted value as its accessible name', () => {
    render(<AnimatedNumber value={1234} />);
    expect(screen.getByRole('status', { name: '1,234' })).toBeInTheDocument();
  });

  it('supports a custom formatter', () => {
    render(<AnimatedNumber value={0.42} format={(n) => `${(n * 100).toFixed(0)}%`} />);
    expect(screen.getByRole('status', { name: '42%' })).toBeInTheDocument();
  });
});

describe('Meter', () => {
  it('reports value through the meter role', () => {
    render(<Meter value={40} max={100} label="Storage" valueLabel="40 of 100 GB" />);
    const meter = screen.getByRole('meter');
    expect(meter).toHaveAttribute('aria-valuenow', '40');
    expect(meter).toHaveAttribute('aria-valuemax', '100');
    expect(screen.getByText('Storage')).toBeInTheDocument();
  });

  it('sums stacked segments', () => {
    render(
      <Meter
        max={100}
        segments={[
          { value: 30, tone: 'accent', label: 'Images' },
          { value: 20, tone: 'info', label: 'Docs' },
        ]}
        showLegend
      />,
    );
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '50');
    expect(screen.getByText('Images')).toBeInTheDocument();
  });
});

describe('GradientText', () => {
  it('renders as the requested element with its text', () => {
    render(<GradientText as="h2">Premium</GradientText>);
    const heading = screen.getByRole('heading', { name: 'Premium' });
    expect(heading.tagName).toBe('H2');
  });
});

describe('SpotlightCard', () => {
  it('renders its children on the surface', () => {
    render(
      <SpotlightCard>
        <p>Glow content</p>
      </SpotlightCard>,
    );
    expect(screen.getByText('Glow content')).toBeInTheDocument();
  });
});

describe('Tilt', () => {
  it('renders children and tilts on pointer move', () => {
    render(
      <Tilt>
        <p>Tilt me</p>
      </Tilt>,
    );
    const content = screen.getByText('Tilt me');
    fireEvent.pointerMove(content, { clientX: 10, clientY: 10 });
    expect(content).toBeInTheDocument();
  });
});

describe('Shortcut', () => {
  it('renders platform key tokens with an accessible label', () => {
    render(<Shortcut keys="mod+k" />);
    // jsdom is non-Apple → mod maps to Ctrl
    expect(screen.getByLabelText('Ctrl+K')).toBeInTheDocument();
    expect(screen.getByText('K')).toBeInTheDocument();
  });
});

describe('AnimatedList', () => {
  it('renders items and reflects additions', () => {
    const { rerender } = render(
      <AnimatedList
        items={['Alpha', 'Beta']}
        getKey={(item) => item}
        renderItem={(item) => <span>{item}</span>}
      />,
    );
    expect(screen.getByText('Alpha')).toBeInTheDocument();
    rerender(
      <AnimatedList
        items={['Alpha', 'Beta', 'Gamma']}
        getKey={(item) => item}
        renderItem={(item) => <span>{item}</span>}
      />,
    );
    expect(screen.getByText('Gamma')).toBeInTheDocument();
  });
});

describe('BentoGrid', () => {
  it('renders cells with span classes', () => {
    render(
      <BentoGrid columns={3}>
        <BentoCard colSpan={2} data-testid="wide">
          Wide
        </BentoCard>
        <BentoCard>Standard</BentoCard>
      </BentoGrid>,
    );
    expect(screen.getByText('Wide')).toBeInTheDocument();
    expect(screen.getByTestId('wide')).toHaveClass('sm:col-span-2');
  });
});

describe('BorderBeam', () => {
  it('renders content inside the beamed surface', () => {
    render(<BorderBeam>Upgrade</BorderBeam>);
    expect(screen.getByText('Upgrade')).toBeInTheDocument();
  });
});

describe('Ripple', () => {
  it('renders children and handles pointer down', () => {
    render(
      <Ripple>
        <button type="button">Press</button>
      </Ripple>,
    );
    const button = screen.getByRole('button', { name: 'Press' });
    fireEvent.pointerDown(button);
    expect(button).toBeInTheDocument();
  });
});

describe('SwatchPicker', () => {
  it('marks the selected swatch and reports changes', () => {
    const onChange = vi.fn();
    render(
      <SwatchPicker
        aria-label="Accent"
        value="#3858e9"
        onChange={onChange}
        swatches={['#3858e9', { value: '#16a34a', label: 'Green' }]}
      />,
    );
    expect(screen.getByRole('radio', { name: '#3858e9' })).toHaveAttribute('aria-checked', 'true');
    fireEvent.click(screen.getByRole('radio', { name: 'Green' }));
    expect(onChange).toHaveBeenCalledWith('#16a34a');
  });
});

describe('InlineNotice', () => {
  it('dismisses when the close button is pressed', () => {
    const onDismiss = vi.fn();
    render(
      <InlineNotice tone="warning" dismissible onDismiss={onDismiss}>
        Unsaved changes
      </InlineNotice>,
    );
    expect(screen.getByText('Unsaved changes')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onDismiss).toHaveBeenCalledOnce();
    expect(screen.queryByText('Unsaved changes')).not.toBeInTheDocument();
  });
});
