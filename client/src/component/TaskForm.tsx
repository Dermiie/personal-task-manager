import { useState, useRef, useEffect, type ReactNode } from 'react';

import { ChevronDown } from 'lucide-react';

import type { ITask } from '../types';

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
  tags: Tag;
}

export interface TaskFormProps {
  onSubmit?: (values: ITask) => void;
}

export default function TaskForm({ onSubmit }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tag, setTag] = useState<Tag | ''>('');
  const [tagsOpen, setTagsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const tagsRef = useRef<HTMLDivElement | null>(null);

  // Close the dropdown when clicking outside it.
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (tagsRef.current && !tagsRef.current.contains(e.target as Node)) {
        setTagsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    };
  }, []);

  function validate(): FormErrors {
    const next: FormErrors = {};

    if (!title.trim()) {
      next.title = 'Task title is required.';
    }

    if (!description.trim()) {
      next.description = 'Description is required.';
    }

    if (!tag) {
      next.tags = 'Select a tag.';
    }

    return next;
  }

  const errors: FormErrors = submitted ? validate() : {};

  function selectTag(selectedTag: Tag) {
    setTag(selectedTag);
    setTagsOpen(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setSubmitted(true);

    const next = validate();

    if (Object.keys(next).length === 0 && tag) {
      const values: ITask = {
        title: title.trim(),
        description: description.trim(),
        tags: tag,
      };

      if (onSubmit) {
        onSubmit(values);
      } else {
        alert(
          `Task created:\n\nTitle: ${values.title}\nDescription: ${values.description}\nTag: ${values.tags}`,
        );
      }

      setTitle('');
      setDescription('');
      setTag('');
      setSubmitted(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex w-full flex-col gap-4 md:gap-6 md:p-6 text-text-primary"
    >
      <FieldFrame label="Task Title" error={errors.title}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="E.g Project Defense, Assignment ..."
          aria-required="true"
          aria-invalid={!!errors.title}
          className="w-full bg-transparent md:py-2 text-xl text-text-dark placeholder:text-muted-foreground focus:outline-none"
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
          className="w-full resize-none bg-transparent py-2 text-xl text-text-dark placeholder:text-muted-foreground focus:outline-none"
        />
      </FieldFrame>

      <div ref={tagsRef}>
        <FieldFrame label="Tag" error={errors.tags}>
          <button
            type="button"
            onClick={() => setTagsOpen((open) => !open)}
            aria-required="true"
            aria-invalid={!!errors.tags}
            aria-expanded={tagsOpen}
            className="flex w-full items-center justify-between gap-2 py-2 text-left focus:outline-none"
          >
            <span
              className={
                tag ? 'text-xl text-text-dark' : 'text-xl text-muted-foreground'
              }
            >
              {tag || 'Select tag...'}
            </span>

            <ChevronDown
              className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
                tagsOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {tagsOpen && (
            <div className="mb-3 flex flex-col gap-2 border-t border-border pt-3">
              {AVAILABLE_TAGS.map((availableTag) => {
                const active = tag === availableTag;

                return (
                  <button
                    type="button"
                    key={availableTag}
                    onClick={() => selectTag(availableTag)}
                    className={`rounded-md border px-2.5 py-2 text-left text-sm transition-colors ${
                      active
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    {availableTag}
                  </button>
                );
              })}
            </div>
          )}
        </FieldFrame>
      </div>

      <button
        type="submit"
        className="cursor-pointer rounded-md bg-theme py-3 text-xl text-white hover:bg-theme-hover"
      >
        Done
      </button>
    </form>
  );
}
