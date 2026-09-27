import { useState, useRef, useEffect, type ReactNode } from 'react';
import { ChevronDown, X } from 'lucide-react';

const AVAILABLE_TAGS = ['Urgent', 'Important'] as const;
type Tag = (typeof AVAILABLE_TAGS)[number];

interface FormErrors {
  title?: string;
  description?: string;
  tags?: string;
}

interface FieldFrameProps {
  label: string;
  error?: string;
  children: ReactNode;
}

// A bordered "fieldset" wrapper that draws the label breaking the top border,
// matching the reference design (legend sitting on the border line).
function FieldFrame({ label, error, children }: FieldFrameProps) {
  return (
    <div className="w-full">
      <fieldset
        className={`w-full rounded-lg border px-4 pb-4 pt-0 transition-colors ${
          error ? 'border-destructive' : 'border-border'
        }`}
      >
        <legend
          className={`px-1 text-xl ${
            error ? 'text-destructive' : 'text-foreground'
          }`}
        >
          {label}
        </legend>
        {children}
      </fieldset>
      {error && <p className="mt-1.5 text-sm text-destructive">{error}</p>}
    </div>
  );
}

export interface TaskFormValues {
  title: string;
  description: string;
  tags: Tag[];
}

export interface TaskFormProps {
  /** Called with the validated values once the form passes validation. */
  onSubmit?: (values: TaskFormValues) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<Tag[]>([]);
  const [tagsOpen, setTagsOpen] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const tagsRef = useRef<HTMLDivElement | null>(null);

  // Close the tag dropdown when clicking outside it.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (tagsRef.current && !tagsRef.current.contains(e.target as Node)) {
        setTagsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!title.trim()) next.title = 'Task title is required.';
    if (!description.trim()) next.description = 'Description is required.';
    if (tags.length === 0) next.tags = 'Select at least one tag.';
    return next;
  }

  // Errors are derived from current field values on every render — not
  // stored in their own state — so there's no effect needed to keep them
  // in sync. Before the first submit attempt we show no errors; after
  // that, they update automatically as title/description/tags change.
  const errors: FormErrors = submitted ? validate() : {};

  function toggleTag(tag: Tag) {
    setTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    const next = validate();
    if (Object.keys(next).length === 0) {
      const values: TaskFormValues = { title, description, tags };
      if (onSubmit) {
        onSubmit(values);
      } else {
        alert(
          `Task created:\n\nTitle: ${values.title}\nDescription: ${values.description}\nTags: ${values.tags.join(', ')}`,
        );
      }
      setTitle('');
      setDescription('');
      setTags([]);
      setSubmitted(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className=" flex w-full flex-col gap-6 p-6 text-text-primary"
    >
      <FieldFrame label="Task Title" error={errors.title}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g Project Defense, Assignment ..."
          aria-required="true"
          aria-invalid={!!errors.title}
          className="w-full bg-transparent py-2 text-text-dark text-xl placeholder:text-muted-foreground focus:outline-none"
        />
      </FieldFrame>

      <FieldFrame label="Description" error={errors.description}>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Briefly describe your task..."
          rows={5}
          aria-required="true"
          aria-invalid={!!errors.description}
          className="w-full resize-none bg-transparent py-2 text-text-dark text-xl placeholder:text-muted-foreground focus:outline-none"
        />
      </FieldFrame>

      <div ref={tagsRef}>
        <FieldFrame label="Tags" error={errors.tags}>
          <button
            type="button"
            onClick={() => setTagsOpen((o) => !o)}
            aria-required="true"
            aria-invalid={!!errors.tags}
            aria-expanded={tagsOpen}
            className="flex w-full items-center justify-between gap-2 py-2 text-left focus:outline-none"
          >
            <div className="flex flex-wrap gap-2">
              {tags.length === 0 ? (
                <span className="text-text-dark text-xl">Select tags...</span>
              ) : (
                tags.map((tag) => (
                  <span
                    key={tag}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTag(tag);
                    }}
                    className="flex items-center gap-1 rounded-md border border-border bg-muted px-2 py-0.5 text-xs text-muted-foreground hover:border-destructive/50 hover:text-destructive"
                  >
                    {tag}
                    <X className="h-3 w-3" />
                  </span>
                ))
              )}
            </div>
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                tagsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {tagsOpen && (
            <div className="mb-3 flex flex-wrap gap-2 border-t border-border pt-3">
              {AVAILABLE_TAGS.map((tag) => {
                const active = tags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`rounded-md border px-2.5 py-1 text-xs transition-colors ${
                      active
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          )}
        </FieldFrame>
      </div>

      <button className="bg-theme rounded-md py-3 text-white text-xl hover:bg-theme-hover cursor-pointer">
        Done
      </button>
    </form>
  );
}
