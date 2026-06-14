'use client';

import {
  AIPrompt,
  Calendar,
  Checkbox,
  CheckboxGroup,
  ColorPicker,
  Combobox,
  CurrencyInput,
  DatePicker,
  DateRangePicker,
  DateTimePicker,
  DateTimeRangePicker,
  DropDownTree,
  FileItem,
  FileUpload,
  Input,
  InputGroup,
  MaskedInput,
  MentionInput,
  MultiColumnCombobox,
  MultiSelect,
  MultiViewCalendar,
  NumberInput,
  PasswordInput,
  PinInput,
  RadioCardGroup,
  RadioGroup,
  RangeSlider,
  SearchInput,
  Select,
  SignaturePad,
  Slider,
  SwatchPicker,
  SwitchGroup,
  TagInput,
  Textarea,
  TextareaAutosize,
  TimePicker,
} from '@officina/ui';
import { type ComponentProps, type ReactNode, useState } from 'react';

const statusOptions = [
  { value: 'draft', label: 'Draft' },
  { value: 'live', label: 'Live' },
  { value: 'archived', label: 'Archived' },
];

export function InputDemo() {
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <Input placeholder="Default input" />
      <Input placeholder="Invalid input" aria-invalid />
      <Input placeholder="Disabled input" disabled />
      <Input placeholder="Read only input" readOnly value="officina-admin" />
    </div>
  );
}

export function InputGroupDemo() {
  return (
    <div className="grid w-full gap-3">
      <InputGroup prefix="https://" suffix=".com">
        <input aria-label="Domain" defaultValue="officina-admin" />
      </InputGroup>
      <InputGroup prefix="$">
        <input aria-label="Amount" inputMode="decimal" defaultValue="49.00" />
      </InputGroup>
    </div>
  );
}

export function TextareaDemo() {
  const [notes, setNotes] = useState('Release notes for v1.0');
  return (
    <div className="grid w-full gap-3">
      <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} />
      <Textarea value="Read-only changelog entry" readOnly rows={2} />
    </div>
  );
}

export function TextareaAutosizeDemo() {
  const [value, setValue] = useState('Grows as you type…');
  return (
    <TextareaAutosize
      value={value}
      minRows={2}
      maxRows={5}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

export function NumberInputDemo() {
  const [num, setNum] = useState<number | null>(20);
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <NumberInput value={num} onChange={setNum} min={0} max={100} suffix="%" />
      <NumberInput value={8} onChange={() => {}} min={0} max={100} disabled />
    </div>
  );
}

export function SearchInputDemo() {
  const [search, setSearch] = useState('');
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <SearchInput value={search} onChange={setSearch} placeholder="Search primitives" />
      <SearchInput value="invoices" onChange={() => {}} placeholder="Search" />
    </div>
  );
}

export function MaskedInputDemo() {
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <MaskedInput mask="(999) 999-9999" value={phone} onChange={setPhone} label="Phone" />
      <MaskedInput mask="9999-99-99" value={date} onChange={setDate} label="Date" />
    </div>
  );
}

export function PasswordInputDemo() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} showStrength />
      <PasswordInput
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Confirm password"
      />
    </div>
  );
}

export function CurrencyInputDemo() {
  const [currency, setCurrency] = useState<number | null>(1999);
  const [eur, setEur] = useState<number | null>(2499);
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <CurrencyInput value={currency} onChange={setCurrency} currency="USD" />
      <CurrencyInput value={eur} onChange={setEur} currency="EUR" />
    </div>
  );
}

export function PinInputDemo() {
  const [pin, setPin] = useState('');
  const [code, setCode] = useState('');
  return (
    <div className="flex flex-col gap-3">
      <PinInput value={pin} onChange={setPin} />
      <PinInput value={code} onChange={setCode} length={4} />
    </div>
  );
}

export function TagInputDemo() {
  const [tags, setTags] = useState(['react', 'router']);
  return (
    <TagInput
      value={tags}
      onChange={setTags}
      placeholder="Add tag"
      suggestions={['react', 'router', 'table']}
    />
  );
}

export function CheckboxDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label="Include archived records"
      description="Works standalone or inside tables and forms."
    />
  );
}

export function CheckboxGroupDemo() {
  const [value, setValue] = useState(['email']);
  return (
    <CheckboxGroup
      value={value}
      onChange={setValue}
      options={[
        { value: 'email', label: 'Email', description: 'Account + billing alerts' },
        { value: 'sms', label: 'SMS', description: 'Critical alerts only' },
        { value: 'push', label: 'Push', disabled: true },
      ]}
    />
  );
}

export function SwitchGroupDemo() {
  const [value, setValue] = useState(['weekly']);
  return (
    <SwitchGroup
      value={value}
      onChange={setValue}
      options={[
        { value: 'weekly', label: 'Weekly digest', description: 'Sent every Monday' },
        { value: 'product', label: 'Product updates' },
        { value: 'security', label: 'Security alerts', description: 'Always recommended' },
      ]}
    />
  );
}

export function RadioGroupDemo() {
  const [value, setValue] = useState('growth');
  return (
    <RadioGroup
      options={[
        { value: 'starter', label: 'Starter' },
        { value: 'growth', label: 'Growth' },
        { value: 'scale', label: 'Scale' },
      ]}
      value={value}
      onChange={setValue}
      variant="card"
      orientation="horizontal"
    />
  );
}

export function RadioCardGroupDemo() {
  const [value, setValue] = useState('growth');
  return (
    <RadioCardGroup
      value={value}
      onChange={setValue}
      columns={3}
      options={[
        { value: 'starter', label: 'Starter', description: 'Up to 3 seats' },
        { value: 'growth', label: 'Growth', description: 'Up to 25 seats' },
        { value: 'scale', label: 'Scale', description: 'Unlimited seats' },
      ]}
    />
  );
}

export function SliderDemo() {
  const [value, setValue] = useState<[number, number]>([20, 80]);
  return (
    <Slider
      label="Confidence"
      value={value}
      onValueChange={(v) => setValue([v[0] ?? 0, v[1] ?? 100])}
      min={0}
      max={100}
    />
  );
}

export function RangeSliderDemo() {
  const [value, setValue] = useState<[number, number]>([25, 75]);
  return (
    <RangeSlider
      label="Price range"
      value={value}
      onValueChange={setValue}
      min={0}
      max={100}
      minStepsBetweenThumbs={5}
      formatValue={(n) => `$${n}`}
    />
  );
}

export function ComboboxDemo() {
  const [value, setValue] = useState<string | null>(null);
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <Combobox options={statusOptions} value={value} onChange={setValue} placeholder="Status" />
      <Combobox options={statusOptions} value="live" onChange={() => {}} disabled />
    </div>
  );
}

export function MultiSelectDemo() {
  const [value, setValue] = useState<string[]>([]);
  return (
    <MultiSelect
      options={statusOptions}
      value={value}
      onChange={setValue}
      placeholder="Statuses"
      showSelectAll
    />
  );
}

export function SelectDemo() {
  const [value, setValue] = useState('draft');
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <Select value={value} onChange={(e) => setValue(e.target.value)}>
        <option value="draft">Draft</option>
        <option value="live">Live</option>
      </Select>
      <Select defaultValue="live" disabled>
        <option value="draft">Draft</option>
        <option value="live">Live</option>
      </Select>
    </div>
  );
}

export function MultiColumnComboboxDemo() {
  const [value, setValue] = useState<ComponentProps<typeof MultiColumnCombobox>['value']>(null);
  return (
    <MultiColumnCombobox
      label="Product"
      items={[
        { id: '1', sku: 'A-100', name: 'Widget', stock: '120' },
        { id: '2', sku: 'B-200', name: 'Gadget', stock: '8' },
        { id: '3', sku: 'C-300', name: 'Gizmo', stock: '54' },
      ]}
      columns={[
        { key: 'sku', header: 'SKU', width: '90px' },
        { key: 'name', header: 'Name' },
        { key: 'stock', header: 'Stock', width: '70px' },
      ]}
      value={value}
      onChange={setValue}
      displayKey="name"
    />
  );
}

export function DropDownTreeDemo() {
  const [value, setValue] = useState<ComponentProps<typeof DropDownTree>['value']>(undefined);
  return (
    <DropDownTree
      label="Team"
      nodes={[
        {
          id: 'eng',
          label: 'Engineering',
          children: [
            { id: 'fe', label: 'Frontend' },
            { id: 'be', label: 'Backend' },
          ],
        },
        { id: 'design', label: 'Design' },
      ]}
      value={value}
      onChange={setValue}
      defaultExpandedIds={['eng']}
    />
  );
}

export function MentionInputDemo() {
  const [value, setValue] = useState('');
  return (
    <MentionInput
      value={value}
      onChange={setValue}
      options={[
        { id: '1', label: 'Lucio' },
        { id: '2', label: 'Officina Bot' },
      ]}
    />
  );
}

export function DatePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [preset, setPreset] = useState<Date | undefined>(new Date());
  return (
    <div className="grid w-full gap-3 md:grid-cols-2">
      <DatePicker value={date} onChange={setDate} placeholder="Pick date" />
      <DatePicker value={preset} onChange={setPreset} placeholder="Pick date" />
    </div>
  );
}

export function DateRangePickerDemo() {
  const [range, setRange] = useState<ComponentProps<typeof DateRangePicker>['value']>({
    from: undefined,
    to: undefined,
  });
  return <DateRangePicker value={range} onChange={setRange} placeholder="Pick range" />;
}

export function TimePickerDemo() {
  const [time, setTime] = useState<ComponentProps<typeof TimePicker>['value']>({
    hours: 9,
    minutes: 30,
  });
  return <TimePicker value={time} onChange={setTime} />;
}

export function DateTimePickerDemo() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  return <DateTimePicker value={date} onChange={setDate} />;
}

export function DateTimeRangePickerDemo() {
  const [range, setRange] = useState<ComponentProps<typeof DateTimeRangePicker>['value']>({
    from: undefined,
    to: undefined,
  });
  return <DateTimeRangePicker value={range} onChange={setRange} />;
}

export function MultiViewCalendarDemo() {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return <MultiViewCalendar months={2} value={date} onChange={setDate} />;
}

export function CalendarDemo() {
  const today = new Date();
  const [events, setEvents] = useState([
    {
      title: 'Standup',
      start: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9),
      end: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 10),
    },
  ]);
  return (
    <Calendar
      events={events}
      defaultDate={today}
      startAccessor="start"
      endAccessor="end"
      selectable
      onSelectSlot={(slot) => {
        const title = window.prompt('Event title');
        if (title) setEvents((prev) => [...prev, { title, start: slot.start, end: slot.end }]);
      }}
    />
  );
}

export function AIPromptDemo() {
  const [busy, setBusy] = useState(false);
  const [output, setOutput] = useState<ReactNode>(null);
  return (
    <AIPrompt
      suggestions={['Summarize this report', 'Draft a follow-up email']}
      busy={busy}
      onStop={() => setBusy(false)}
      onSubmit={(prompt) => {
        setBusy(true);
        setOutput(null);
        setTimeout(() => {
          setOutput(
            <p className="text-fd-muted-foreground text-sm">Demo response for: “{prompt}”</p>,
          );
          setBusy(false);
        }, 1200);
      }}
      output={output ?? undefined}
      hint="Transport-free demo — wire your own model call"
    />
  );
}

export function ColorPickerDemo() {
  const [value, setValue] = useState('#6366f1');
  const [brand, setBrand] = useState('#16a34a');
  return (
    <div className="flex flex-wrap gap-4">
      <ColorPicker value={value} onChange={setValue} label="Accent" />
      <ColorPicker
        value={brand}
        onChange={setBrand}
        label="Brand"
        presets={['#16a34a', '#0ea5e9', '#e11d48', '#f59e0b']}
      />
    </div>
  );
}

export function SwatchPickerDemo() {
  const [accent, setAccent] = useState('#3858e9');
  return (
    <SwatchPicker
      aria-label="Accent color"
      value={accent}
      onChange={setAccent}
      allowCustom
      swatches={['#3858e9', '#7c3aed', '#0ea5e9', '#16a34a', '#ea580c', '#e11d48']}
    />
  );
}

export function SignaturePadDemo() {
  return <SignaturePad onChange={() => {}} />;
}

export function FileUploadDemo() {
  return <FileUpload onFiles={() => {}} />;
}

export function FileItemDemo() {
  return (
    <div className="w-full space-y-2">
      <FileItem name="brand-guidelines.pdf" size={2_400_000} status="success" onRemove={() => {}} />
      <FileItem name="hero-image.png" size={840_000} status="uploading" progress={62} />
      <FileItem
        name="export.csv"
        size={12_000}
        status="error"
        error="Upload failed — file too large"
        onRetry={() => {}}
        onRemove={() => {}}
      />
    </div>
  );
}
