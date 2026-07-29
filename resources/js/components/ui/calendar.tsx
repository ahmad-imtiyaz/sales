import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';

export interface CalendarProps extends React.ComponentProps<typeof DayPicker> {}

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return <DayPicker showOutsideDays={showOutsideDays} className={cn('p-3', className)} classNames={{ months: 'flex flex-col sm:flex-row gap-2', month: 'space-y-4', month_caption: 'flex h-9 items-center justify-center pt-1 relative', caption_label: 'text-sm font-medium', nav: 'absolute inset-x-3 top-3 flex items-center justify-between', button_previous: 'inline-flex size-9 items-center justify-center rounded-md border bg-background hover:bg-accent', button_next: 'inline-flex size-9 items-center justify-center rounded-md border bg-background hover:bg-accent', month_grid: 'w-full border-collapse', weekdays: 'flex', weekday: 'w-9 text-center text-xs font-normal text-muted-foreground', week: 'mt-2 flex w-full', day: 'relative size-9 p-0 text-center text-sm', day_button: 'inline-flex size-9 items-center justify-center rounded-md font-normal hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', selected: '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary', today: '[&>button]:bg-accent [&>button]:text-accent-foreground', outside: 'text-muted-foreground opacity-50', disabled: 'text-muted-foreground opacity-50', hidden: 'invisible', dropdowns: 'flex w-full gap-2', dropdown: 'inline-flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs', dropdown_month: 'inline-flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs', dropdown_year: 'inline-flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs', ...classNames }} components={{ Chevron: ({ orientation }) => orientation === 'left' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" /> }} {...props} />;
}

export { Calendar };
