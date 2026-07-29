import * as React from 'react';
import { cn } from '@/lib/utils';

export function Field({ className, ...props }: React.ComponentProps<'div'>) {
    return <div data-slot="field" className={cn('space-y-2', className)} {...props} />;
}

export function FieldLabel({ className, ...props }: React.ComponentProps<'label'>) {
    return <label data-slot="field-label" className={cn('text-sm leading-none font-medium', className)} {...props} />;
}
