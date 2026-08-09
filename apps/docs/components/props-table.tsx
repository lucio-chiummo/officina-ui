import componentProps from '@/lib/component-props.json';

type PropDoc = {
  name: string;
  type: string;
  required: boolean;
  defaultValue: string | null;
  description: string;
};

type ComponentDoc = {
  name: string;
  description: string;
  props: PropDoc[];
  inheritsElement?: string;
};

const docs = componentProps as Record<string, ComponentDoc>;

/**
 * Renders the auto-extracted prop reference for a component. Data is generated
 * by `pnpm docs:props` (react-docgen-typescript) and kept in sync at build.
 */
export function PropsTable({ name }: { name: string }) {
  const doc = docs[name];

  if (!doc || doc.props.length === 0) {
    // Thin wrappers add no props of their own — tell the reader what they
    // forward rather than showing a bare "no props" dead-end.
    if (doc?.inheritsElement) {
      return (
        <p className="text-fd-muted-foreground text-sm">
          <code>{name}</code> adds no props of its own. It forwards all standard{' '}
          <code>&lt;{doc.inheritsElement}&gt;</code> attributes (plus <code>ref</code> and{' '}
          <code>className</code>) to the underlying element.
        </p>
      );
    }
    return (
      <p className="text-fd-muted-foreground text-sm">
        <code>{name}</code> is composed from other primitives and exposes no direct props. Compose
        it with its subcomponents and standard element attributes.
      </p>
    );
  }

  return (
    <div className="border-fd-border my-4 overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-fd-muted/50">
          <tr>
            <th className="px-3 py-2 font-medium">Prop</th>
            <th className="px-3 py-2 font-medium">Type</th>
            <th className="px-3 py-2 font-medium">Default</th>
            <th className="px-3 py-2 font-medium">Description</th>
          </tr>
        </thead>
        <tbody>
          {doc.props.map((prop) => (
            <tr key={prop.name} className="border-fd-border border-t align-top">
              <td className="whitespace-nowrap px-3 py-2 font-mono">
                {prop.name}
                {prop.required ? <span className="text-fd-primary">*</span> : null}
              </td>
              <td className="text-fd-primary max-w-[18rem] break-words px-3 py-2 font-mono">
                {prop.type}
              </td>
              <td className="text-fd-muted-foreground px-3 py-2 font-mono">
                {prop.defaultValue ?? '—'}
              </td>
              <td className="text-fd-muted-foreground px-3 py-2">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
