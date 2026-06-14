'use client';

import {
  AnimatedList,
  AnimatedNumber,
  AspectRatio,
  Badge,
  Barcode,
  BentoCard,
  BentoGrid,
  BorderBeam,
  Box,
  Button,
  Confetti,
  Container,
  Grid,
  GradientText,
  ImageLightbox,
  ImageList,
  ImageListItem,
  ImagePreview,
  Map,
  Marquee,
  Masonry,
  MasonryItem,
  MotionPreset,
  NoSsr,
  Panel,
  PanelHandle,
  Paper,
  Player,
  PrimitiveLink,
  QRCode,
  ResizablePanels,
  Ripple,
  Scrollbar,
  Skeleton,
  SpotlightCard,
  Stack,
  Tilt,
  Typography,
} from '@officina/ui';
import { useRef, useState } from 'react';

const img = (id: string) => `https://images.unsplash.com/${id}?w=200&h=200&fit=crop`;

/* --- Media --- */

export function ImageListDemo() {
  return (
    <ImageList cols={3} gap={6}>
      {[
        '1517694712202-14dd9538aa97',
        '1522071820081-009f0129c71c',
        '1531297484001-80022131f5a1',
      ].map((id, i) => (
        <ImageListItem key={id} caption={['Dashboard', 'Reports', 'Media'][i]}>
          <img src={img(id)} alt="" className="aspect-square w-full object-cover" />
        </ImageListItem>
      ))}
    </ImageList>
  );
}

export function ImagePreviewDemo() {
  return (
    <div className="flex flex-wrap gap-3">
      <ImagePreview src={img('1517694712202-14dd9538aa97')} name="cover.jpg" onRemove={() => {}} />
      <ImagePreview src={img('1522071820081-009f0129c71c')} status="uploading" progress={48} />
      <ImagePreview
        src={img('1531297484001-80022131f5a1')}
        status="error"
        onRetry={() => {}}
        onRemove={() => {}}
      />
    </div>
  );
}

export function MapDemo() {
  return (
    <Map
      markers={[
        { id: 'warehouse', label: 'Warehouse', x: 22, y: 58 },
        { id: 'route', label: 'Route A', x: 48, y: 46 },
        { id: 'store', label: 'Store #42', x: 74, y: 34 },
      ]}
      height={200}
    />
  );
}

export function PlayerDemo() {
  return (
    <NoSsr fallback={<div className="bg-fd-muted h-64 w-full rounded-lg" />}>
      <Player src="https://www.w3schools.com/html/mov_bbb.mp4" />
    </NoSsr>
  );
}

export function ImageLightboxDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Open image preview
      </Button>
      <ImageLightbox
        open={open}
        onClose={() => setOpen(false)}
        slides={[{ src: img('1551288049-bebda4e38f71') }]}
      />
    </>
  );
}

export function QRCodeDemo() {
  return (
    <div className="flex flex-wrap items-end gap-6">
      <QRCode value="https://officina-admin.local/primitives" size={120} />
      <QRCode value="https://officina.dev" size={80} />
    </div>
  );
}

export function BarcodeDemo() {
  return (
    <div className="flex flex-col gap-4">
      <Barcode value="OFFICINA-2026" height={56} />
      <Barcode value="SKU-008421" height={40} />
    </div>
  );
}

/* --- Layout --- */

export function BoxDemo() {
  return (
    <Box className="border-fd-border bg-fd-muted rounded-lg border border-dashed p-4">
      <Typography variant="body-sm" tone="muted">
        Box is the tiny polymorphic escape hatch for layout and spacing.
      </Typography>
    </Box>
  );
}

export function ContainerDemo() {
  return (
    <Container size="sm" className="border-fd-border bg-fd-muted rounded-lg border py-4">
      <Typography variant="title">Contained content</Typography>
      <Typography variant="body-sm" tone="muted">
        Responsive max-width with app-safe horizontal padding.
      </Typography>
    </Container>
  );
}

export function GridDemo() {
  return (
    <Grid minChildWidth={120}>
      {['Metrics', 'Reports', 'Billing'].map((item) => (
        <Paper key={item} className="p-3">
          <Typography variant="body-sm">{item}</Typography>
        </Paper>
      ))}
    </Grid>
  );
}

export function StackDemo() {
  return (
    <Stack direction="row" align="center" wrap>
      <Badge tone="success">Live</Badge>
      <Typography variant="body-sm" tone="muted">
        Stack handles direction, alignment, wrapping, and gap tokens.
      </Typography>
    </Stack>
  );
}

export function PaperDemo() {
  return (
    <Stack>
      <Paper elevation={0} variant="outlined" className="p-3">
        <Typography variant="body-sm">Outlined paper</Typography>
      </Paper>
      <Paper elevation={2} variant="elevated" className="p-3">
        <Typography variant="body-sm">Elevated paper</Typography>
      </Paper>
    </Stack>
  );
}

export function BentoGridDemo() {
  return (
    <BentoGrid columns={3} className="auto-rows-[5rem]">
      <BentoCard colSpan={2}>
        <p className="text-fd-foreground text-sm font-semibold">Featured</p>
      </BentoCard>
      <BentoCard>
        <p className="text-fd-muted-foreground text-xs">Cell</p>
      </BentoCard>
      <BentoCard>
        <p className="text-fd-muted-foreground text-xs">Cell</p>
      </BentoCard>
      <BentoCard colSpan={2}>
        <p className="text-fd-muted-foreground text-xs">Wide cell</p>
      </BentoCard>
    </BentoGrid>
  );
}

export function BentoCardDemo() {
  return (
    <BentoGrid columns={2} className="auto-rows-[5rem]">
      <BentoCard>
        <p className="text-fd-foreground text-sm font-semibold">Bento card</p>
      </BentoCard>
      <BentoCard>
        <p className="text-fd-muted-foreground text-xs">A single tile in a bento grid.</p>
      </BentoCard>
    </BentoGrid>
  );
}

export function AspectRatioDemo() {
  return (
    <div className="grid w-full gap-3 sm:grid-cols-2">
      <AspectRatio ratio={16 / 9}>
        <div className="bg-fd-muted text-fd-muted-foreground grid h-full place-items-center text-sm">
          16:9 media frame
        </div>
      </AspectRatio>
      <AspectRatio ratio={1}>
        <div className="bg-fd-muted text-fd-muted-foreground grid h-full place-items-center text-sm">
          1:1 square
        </div>
      </AspectRatio>
    </div>
  );
}

export function MasonryDemo() {
  return (
    <Masonry columns={2}>
      {[64, 96, 80, 120].map((height, index) => (
        <MasonryItem key={height}>
          <Paper
            className="text-fd-muted-foreground grid place-items-center p-3 text-xs"
            style={{ height }}
          >
            Card {index + 1}
          </Paper>
        </MasonryItem>
      ))}
    </Masonry>
  );
}

export function ScrollbarDemo() {
  return (
    <Scrollbar className="border-fd-border h-28 w-full rounded-md border">
      <div className="space-y-2 p-3">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="bg-fd-muted rounded px-2 py-1 text-sm">
            Scroll row {index + 1}
          </div>
        ))}
      </div>
    </Scrollbar>
  );
}

export function ResizablePanelsDemo() {
  return (
    <div className="border-fd-border h-28 w-full overflow-hidden rounded-lg border">
      <ResizablePanels direction="horizontal">
        <Panel defaultSize={40} className="grid h-full place-items-center">
          <span className="text-sm font-medium">Left</span>
        </Panel>
        <PanelHandle />
        <Panel className="bg-fd-muted grid h-full place-items-center">
          <span className="text-sm font-medium">Right</span>
        </Panel>
      </ResizablePanels>
    </div>
  );
}

/* --- Content & Typography --- */

export function GradientTextDemo() {
  return (
    <div className="space-y-1">
      <GradientText as="p" className="text-2xl" animate>
        Officina Admin
      </GradientText>
      <GradientText
        as="p"
        className="text-lg"
        gradient="linear-gradient(90deg, var(--color-success), var(--color-info))"
      >
        Premium by default
      </GradientText>
    </div>
  );
}

export function AnimatedNumberDemo() {
  const [value, setValue] = useState(8421);
  return (
    <div className="flex items-center gap-3">
      <AnimatedNumber value={value} className="text-2xl font-semibold" />
      <Button
        size="sm"
        variant="secondary"
        onClick={() => setValue(Math.round(2000 + Math.random() * 18000))}
      >
        Randomize
      </Button>
    </div>
  );
}

export function PrimitiveLinkDemo() {
  return (
    <Stack direction="row" align="center" wrap>
      <PrimitiveLink href="/docs">Internal link</PrimitiveLink>
      <PrimitiveLink href="https://mui.com/components/" external>
        MUI components
      </PrimitiveLink>
    </Stack>
  );
}

/* --- Motion & Effects --- */

export function AnimatedListDemo() {
  const [items, setItems] = useState(['Deploy finished', 'Invoice paid', 'New signup']);
  const counter = useRef(0);
  return (
    <div className="w-full space-y-2">
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setItems((prev) => [`Event ${++counter.current}`, ...prev].slice(0, 6))}
        >
          Add
        </Button>
        <Button size="sm" variant="ghost" onClick={() => setItems((prev) => prev.slice(1))}>
          Remove
        </Button>
      </div>
      <AnimatedList
        items={items}
        getKey={(item) => item}
        renderItem={(item) => (
          <div className="border-fd-border bg-fd-card rounded-md border px-3 py-2 text-sm">
            {item}
          </div>
        )}
      />
    </div>
  );
}

export function ConfettiDemo() {
  const [runKey, setRunKey] = useState(0);
  return (
    <div className="border-fd-border bg-fd-muted relative w-full overflow-hidden rounded-lg border">
      <Confetti key={runKey} height={150} pieces={48} />
      <div className="absolute inset-0 grid place-items-center text-center">
        <div>
          <div className="text-fd-foreground text-sm font-semibold">Upgrade complete</div>
          <Button size="xs" className="mt-3" onClick={() => setRunKey((c) => c + 1)}>
            Replay celebration
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BorderBeamDemo() {
  return (
    <BorderBeam className="p-4">
      <p className="text-fd-foreground text-sm font-semibold">Upgrade to Pro</p>
      <p className="text-fd-muted-foreground mt-1 text-xs">
        Animated border for upsell and active cards.
      </p>
    </BorderBeam>
  );
}

export function TiltDemo() {
  return (
    <Tilt className="border-fd-border bg-fd-card rounded-lg border p-5">
      <p className="text-fd-foreground text-sm font-semibold">Hover to tilt</p>
      <p className="text-fd-muted-foreground mt-1 text-xs">
        3D pointer tilt for feature and pricing cards.
      </p>
    </Tilt>
  );
}

export function MarqueeDemo() {
  return (
    <Marquee>
      <span>Officina Admin</span>
      <span>Primitives</span>
      <span>Design tokens</span>
    </Marquee>
  );
}

export function MotionPresetDemo() {
  return (
    <MotionPreset
      preset="fadeInUp"
      className="border-fd-border bg-fd-muted rounded-lg border p-4 text-sm"
    >
      Motion preset wrapper
    </MotionPreset>
  );
}

export function RippleDemo() {
  return (
    <Ripple className="rounded-md">
      <Button variant="secondary">Press for ripple</Button>
    </Ripple>
  );
}

export function SpotlightCardDemo() {
  return (
    <SpotlightCard>
      <p className="text-fd-foreground text-sm font-semibold">Hover for the spotlight</p>
      <p className="text-fd-muted-foreground mt-1 text-xs">
        Cursor-following glow for premium dashboard cards.
      </p>
    </SpotlightCard>
  );
}

/* --- Utilities --- */

export function NoSsrDemo() {
  return (
    <NoSsr fallback={<Skeleton height={28} />}>
      <Typography variant="body-sm">Client mounted at {new Date().toLocaleTimeString()}</Typography>
    </NoSsr>
  );
}
