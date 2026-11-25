import {
  useId,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import {
  Dialog as D,
  DropdownMenu as M,
  Popover as P,
  RadioGroup as R,
  Slider as S,
  Switch as W,
  Tabs as T,
  Toast as N,
  Tooltip as H,
} from "radix-ui";

export type Tone = "neutral" | "info" | "success" | "warning" | "danger";
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  loading?: boolean;
};
export function Button({
  variant = "primary",
  size = "md",
  loading,
  disabled,
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`ds-button ds-button--${variant} ds-button--${size} ${className}`}
    >
      {loading && <span className="ds-spinner" aria-hidden="true" />}
      {children}
    </button>
  );
}
export function Icon({
  name,
  ...props
}: {
  name:
    | "arrow"
    | "close"
    | "plus"
    | "check"
    | "grid"
    | "sliders"
    | "download"
    | "reset"
    | "chevron"
    | "info";
} & React.SVGProps<SVGSVGElement>) {
  const paths = {
    arrow: "M4 12h16m-6-6 6 6-6 6",
    close: "m6 6 12 12M6 18 18 6",
    plus: "M12 4v16M4 12h16",
    check: "m5 12 4 4L19 6",
    grid: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z",
    sliders: "M4 7h16M4 17h16M8 4v6M16 14v6",
    download: "M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5",
    reset: "M4 5v6h6M5 10a8 8 0 1 1 0 6",
    chevron: "m6 9 6 6 6-6",
    info: "M12 11v6m0-10v1M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20",
  };
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="square"
      strokeLinejoin="miter"
      className="ds-icon"
      aria-hidden="true"
      {...props}
    >
      <path d={paths[name]} />
    </svg>
  );
}
export function IconButton({
  label,
  children,
  ...props
}: Omit<ButtonProps, "children"> & { label: string; children: ReactNode }) {
  return (
    <Button
      {...props}
      aria-label={label}
      className={`ds-icon-button ${props.className ?? ""}`}
    >
      {children}
    </Button>
  );
}
export function Link({
  className = "",
  ...props
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} className={`ds-link ${className}`} />;
}
export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: Tone;
  children: ReactNode;
}) {
  return (
    <span className="ds-badge" data-tone={tone}>
      {children}
    </span>
  );
}
export function Alert({
  tone = "info",
  title,
  children,
}: {
  tone?: Exclude<Tone, "neutral">;
  title: string;
  children?: ReactNode;
}) {
  return (
    <div
      className="ds-alert"
      data-tone={tone}
      role={tone === "danger" ? "alert" : "status"}
    >
      <Icon name="info" />
      <div>
        <strong>{title}</strong>
        {children && <div>{children}</div>}
      </div>
    </div>
  );
}

type FieldProps = { label: string; hint?: string; error?: string };
function Field({
  id,
  label,
  hint,
  error,
  children,
}: FieldProps & { id: string; children: ReactNode }) {
  return (
    <div className="ds-field">
      <label htmlFor={id}>{label}</label>
      {children}
      {hint && (
        <p id={`${id}-hint`} className="ds-field-hint">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="ds-field-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
function useField(
  id: string | undefined,
  hint: string | undefined,
  error: string | undefined,
  describedBy: string | undefined,
) {
  const generated = useId();
  const fieldId = id ?? generated;
  return {
    id: fieldId,
    "aria-invalid": !!error || undefined,
    "aria-describedby":
      [describedBy, hint && `${fieldId}-hint`, error && `${fieldId}-error`]
        .filter(Boolean)
        .join(" ") || undefined,
  };
}
export function TextField({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}: FieldProps & InputHTMLAttributes<HTMLInputElement>) {
  const attrs = useField(id, hint, error, props["aria-describedby"]);
  return (
    <Field {...{ label, hint, error }} id={attrs.id}>
      <input {...props} {...attrs} className={`ds-input ${className}`} />
    </Field>
  );
}
export function Textarea({
  label,
  hint,
  error,
  id,
  className = "",
  ...props
}: FieldProps & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const attrs = useField(id, hint, error, props["aria-describedby"]);
  return (
    <Field {...{ label, hint, error }} id={attrs.id}>
      <textarea
        rows={4}
        {...props}
        {...attrs}
        className={`ds-input ds-textarea ${className}`}
      />
    </Field>
  );
}
export function Select({
  label,
  hint,
  error,
  id,
  options,
  className = "",
  ...props
}: FieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: { value: string; label: string }[];
  }) {
  const attrs = useField(id, hint, error, props["aria-describedby"]);
  return (
    <Field {...{ label, hint, error }} id={attrs.id}>
      <select {...props} {...attrs} className={`ds-input ${className}`}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </Field>
  );
}
export function Checkbox({
  label,
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & { label: string }) {
  return (
    <label className={`ds-choice ${className}`}>
      <input {...props} type="checkbox" />
      {label}
    </label>
  );
}
export function RadioGroup({
  label,
  options,
  ...props
}: React.ComponentProps<typeof R.Root> & {
  label: string;
  options: { value: string; label: string; disabled?: boolean }[];
}) {
  const id = useId();
  return (
    <div className="ds-field">
      <span id={id}>{label}</span>
      <R.Root {...props} aria-labelledby={id} className="ds-stack">
        {options.map((o) => (
          <label key={o.value} className="ds-choice">
            <R.Item value={o.value} disabled={o.disabled} className="ds-radio">
              <R.Indicator className="ds-radio-dot" />
            </R.Item>
            {o.label}
          </label>
        ))}
      </R.Root>
    </div>
  );
}
export function Switch({
  label,
  ...props
}: React.ComponentProps<typeof W.Root> & { label: string }) {
  const id = useId();
  return (
    <label htmlFor={id} className="ds-choice">
      <W.Root {...props} id={id} className="ds-switch">
        <W.Thumb className="ds-switch-thumb" />
      </W.Root>
      {label}
    </label>
  );
}
export function Slider({
  label,
  ...props
}: React.ComponentProps<typeof S.Root> & { label: string }) {
  const id = useId();
  return (
    <div className="ds-field">
      <span id={id}>{label}</span>
      <S.Root
        min={0}
        max={100}
        step={1}
        defaultValue={[50]}
        {...props}
        aria-labelledby={id}
        className="ds-slider"
      >
        <S.Track className="ds-slider-track">
          <S.Range className="ds-slider-range" />
        </S.Track>
        {(props.value ?? props.defaultValue ?? [50]).map((_, i) => (
          <S.Thumb
            key={i}
            className="ds-slider-thumb"
            aria-label={label + (i ? ` ${i + 1}` : "")}
          />
        ))}
      </S.Root>
    </div>
  );
}
export function Progress({ label, value }: { label: string; value?: number }) {
  const id = useId();
  return (
    <div className="ds-field">
      <label htmlFor={id}>{label}</label>
      <progress id={id} max={100} value={value} className="ds-progress" />
    </div>
  );
}
export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="ds-row">
      <span className="ds-spinner" aria-hidden="true" />
      {label}
    </div>
  );
}
export function EmptyState({
  title,
  children,
  action,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="ds-empty">
      <Icon name="grid" />
      <h3>{title}</h3>
      {children && <p>{children}</p>}
      {action}
    </div>
  );
}
export function Panel({
  title,
  eyebrow,
  children,
  footer,
  className = "",
  ...props
}: HTMLAttributes<HTMLElement> & {
  title: string;
  eyebrow?: string;
  footer?: ReactNode;
}) {
  return (
    <section {...props} className={`ds-panel ${className}`}>
      <header className="ds-panel-header">
        {eyebrow && <span className="ds-label">{eyebrow}</span>}
        <h3>{title}</h3>
      </header>
      <div className="ds-panel-body">{children}</div>
      {footer && <footer className="ds-panel-footer">{footer}</footer>}
    </section>
  );
}
export function Card({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`ds-card ${className}`} />;
}
export function Divider() {
  return <hr className="ds-divider" />;
}
export function Container({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`ds-container ${className}`} />;
}
export function Stack({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`ds-stack ${className}`} />;
}
export function Row({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`ds-row ${className}`} />;
}
export function Grid({
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div {...props} className={`ds-grid ${className}`} />;
}
export function Toolbar({
  label,
  className = "",
  ...props
}: HTMLAttributes<HTMLDivElement> & { label: string }) {
  return (
    <div
      {...props}
      role="group"
      aria-label={label}
      className={`ds-toolbar ${className}`}
    />
  );
}
export function Tabs({
  label,
  items,
  defaultValue,
}: {
  label: string;
  defaultValue?: string;
  items: {
    value: string;
    label: string;
    content: ReactNode;
    disabled?: boolean;
  }[];
}) {
  return (
    <T.Root defaultValue={defaultValue ?? items[0]?.value}>
      <T.List aria-label={label} className="ds-tabs">
        {items.map((item) => (
          <T.Trigger
            key={item.value}
            value={item.value}
            disabled={item.disabled}
            className="ds-tab"
          >
            {item.label}
          </T.Trigger>
        ))}
      </T.List>
      {items.map((item) => (
        <T.Content
          key={item.value}
          value={item.value}
          className="ds-tab-content"
        >
          {item.content}
        </T.Content>
      ))}
    </T.Root>
  );
}
export function Menu({
  label,
  items,
}: {
  label: string;
  items: {
    label: string;
    onSelect: () => void;
    disabled?: boolean;
    destructive?: boolean;
  }[];
}) {
  return (
    <M.Root>
      <M.Trigger asChild>
        <Button variant="secondary">
          {label}
          <Icon name="chevron" />
        </Button>
      </M.Trigger>
      <M.Portal>
        <M.Content className="ds-menu" sideOffset={8}>
          {items.map((item) => (
            <M.Item
              key={item.label}
              className="ds-menu-item"
              disabled={item.disabled}
              onSelect={item.onSelect}
              data-destructive={item.destructive || undefined}
            >
              {item.label}
            </M.Item>
          ))}
        </M.Content>
      </M.Portal>
    </M.Root>
  );
}
export function Dialog({
  trigger,
  title,
  description,
  children,
  open,
  onOpenChange,
}: {
  trigger: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <D.Root open={open} onOpenChange={onOpenChange}>
      <D.Trigger asChild>{trigger}</D.Trigger>
      <D.Portal>
        <D.Overlay className="ds-overlay" />
        <D.Content className="ds-dialog">
          <div className="ds-row ds-between">
            <D.Title>{title}</D.Title>
            <D.Close asChild>
              <IconButton label="Close dialog" variant="ghost">
                <Icon name="close" />
              </IconButton>
            </D.Close>
          </div>
          <D.Description className="ds-muted">{description}</D.Description>
          {children}
        </D.Content>
      </D.Portal>
    </D.Root>
  );
}
export function Tooltip({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <H.Provider delayDuration={250}>
      <H.Root>
        <H.Trigger asChild>{children}</H.Trigger>
        <H.Portal>
          <H.Content className="ds-tooltip" sideOffset={8}>
            {label}
            <H.Arrow className="ds-tooltip-arrow" />
          </H.Content>
        </H.Portal>
      </H.Root>
    </H.Provider>
  );
}
export function Popover({
  trigger,
  label,
  children,
}: {
  trigger: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <P.Root>
      <P.Trigger asChild>{trigger}</P.Trigger>
      <P.Portal>
        <P.Content aria-label={label} className="ds-popover" sideOffset={8}>
          <div className="ds-row ds-between">
            <strong>{label}</strong>
            <P.Close asChild>
              <IconButton label="Close popover" variant="ghost">
                <Icon name="close" />
              </IconButton>
            </P.Close>
          </div>
          {children}
        </P.Content>
      </P.Portal>
    </P.Root>
  );
}
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <N.Provider duration={5000} swipeDirection="right">
      {children}
      <N.Viewport className="ds-toast-viewport" />
    </N.Provider>
  );
}
export function Toast({
  title,
  description,
  open,
  onOpenChange,
}: {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <N.Root className="ds-toast" open={open} onOpenChange={onOpenChange}>
      <div>
        <N.Title className="ds-strong">{title}</N.Title>
        {description && <N.Description>{description}</N.Description>}
      </div>
      <N.Close asChild>
        <IconButton label="Dismiss notification" variant="ghost">
          <Icon name="close" />
        </IconButton>
      </N.Close>
    </N.Root>
  );
}
export function ToastDemo() {
  const [open, setOpen] = useState(false);
  return (
    <ToastProvider>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Show notification
      </Button>
      <Toast
        title="Preferences saved"
        description="Your workspace is up to date."
        open={open}
        onOpenChange={setOpen}
      />
    </ToastProvider>
  );
}
