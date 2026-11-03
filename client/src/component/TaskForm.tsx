import { useState, useRef, useEffect, type ReactNode } from 'react';

import { Check, ChevronDown } from 'lucide-react';
import z from 'zod';
import { Controller, useForm, type FieldError } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import DatePicker from './DatePicker';
import { useCreateTask } from '../hooks/useTasks';

const taskSchema = z.object({
  title: z.string().trim().nonempty('Task title is required'),
  description: z.string().trim().nonempty('Task description is required'),
  tags: z.enum(['Urgent', 'Important']),
  dueDate: z.iso.date().optional(),
});

export type CreateTaskFormData = z.infer<typeof taskSchema>;

const AVAILABLE_TAGS = ['Urgent', 'Important'] as const;

type Tag = (typeof AVAILABLE_TAGS)[number];

interface FieldFrameProps {
  label: string;
  error?: FieldError;
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

      {error && (
        <p className="mt-1.5 text-sm text-destructive">{error.message}</p>
      )}
    </div>
  );
}

// export interface TaskFormValues {
//   title: string;
//   description: string;
//   tags: Tag;
// }

interface TagDropdownProps {
  value?: Tag;
  onChange: (tag: Tag) => void;
  onBlur: () => void;
  error?: FieldError;
}

function TagDropdown({ value, onChange, onBlur, error }: TagDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close on outside click or Escape
  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        onBlur();
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open, onBlur]);

  function selectTag(tag: Tag) {
    onChange(tag);
    setOpen(false);
  }

  return (
    <div ref={containerRef}>
      <FieldFrame label="Tag" error={error}>
        <button
          type="button"
          id="tags"
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={!!error}
          className="flex w-full items-center justify-between gap-2 py-2 text-left focus:outline-none"
        >
          <span
            className={`text-xl ${
              value ? 'text-text-dark' : 'text-muted-foreground'
            }`}
          >
            {value ?? 'Select tag...'}
          </span>

          <ChevronDown
            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {open && (
          <ul
            role="listbox"
            aria-labelledby="tags"
            className="mb-3 flex flex-col gap-2 border-t border-border pt-3"
          >
            {AVAILABLE_TAGS.map((tag) => {
              const active = value === tag;

              return (
                <li key={tag} role="option" aria-selected={active}>
                  <button
                    type="button"
                    onClick={() => selectTag(tag)}
                    className={`flex w-full items-center justify-between rounded-md border px-2.5 py-2 text-left text-sm transition-colors ${
                      active
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:border-foreground hover:text-foreground'
                    }`}
                  >
                    {tag}
                    {active && <Check className="h-4 w-4" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </FieldFrame>
    </div>
  );
}

export default function TaskForm() {
  const { mutate: createTask, isPending } = useCreateTask();
  const {
    register,
    control,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(taskSchema),
  });

  function onSubmitForm(data: CreateTaskFormData) {
    createTask(data);
    reset();
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmitForm)}
      noValidate
      className="flex w-full flex-col gap-4 md:gap-6 md:p-6 text-text-primary"
    >
      <div className="flex flex-col gap-4 md:grid md:grid-cols-2 w-full">
        <div className="space-y-3 ">
          <FieldFrame label="Task Title" error={errors.title}>
            <input
              type="text"
              id="title"
              {...register('title')}
              placeholder="E.g Project Defense, Assignment ..."
              aria-required="true"
              aria-invalid={!!errors.title}
              className="w-full bg-transparent md:py-2 text-xl text-text-dark placeholder:text-muted-foreground focus:outline-none"
            />
          </FieldFrame>

          <FieldFrame label="Description" error={errors.description}>
            <textarea
              id="description"
              {...register('description')}
              placeholder="Briefly describe your task..."
              rows={5}
              aria-required="true"
              aria-invalid={!!errors.description}
              className="w-full resize-none bg-transparent py-2 text-xl text-text-dark placeholder:text-muted-foreground focus:outline-none"
            />
          </FieldFrame>

          <Controller
            name="tags"
            control={control}
            render={({ field, fieldState }) => (
              <TagDropdown
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                error={fieldState.error}
              />
            )}
          />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-xl font-bold">Select Task Due Date</p>
          <p className="text-destructive text-sm mb-4">Optional</p>

          <Controller
            name="dueDate"
            control={control}
            render={({ field, fieldState }) => (
              <>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
                {fieldState.error && (
                  <p className="text-sm text-destructive">
                    {fieldState.error.message}
                  </p>
                )}
              </>
            )}
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isSubmitting || isPending}
        className="cursor-pointer rounded-md bg-theme py-3 text-xl text-white hover:bg-theme-hover"
      >
        {isSubmitting ? 'Creating Your New Task' : 'Create Task'}
      </button>
    </form>
  );
}
