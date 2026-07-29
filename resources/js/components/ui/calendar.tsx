import * as React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import { cn } from '@/lib/utils';

export interface CalendarProps extends React.ComponentProps<typeof DayPicker> {}

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
    return <DayPicker showOutsideDays={showOutsideDays} className={cn('w-fit p-3', className)} classNames={{ months: 'flex flex-col sm:flex-row gap-4', month: 'space-y-4', month_caption: 'flex justify-center pt-1 relative items-center', caption_label: 'inline-flex items-center gap-2 text-sm font-medium', nav: 'flex items-center gap-1', button_previous: 'inline-flex h-7 w-7 items-center justify-center rounded-md border bg-background hover:bg-accent', button_next: 'inline-flex h-7 w-7 items-center justify-center rounded-md border bg-background hover:bg-accent', month_grid: 'w-full border-collapse', weekdays: 'flex', weekday: 'w-9 text-center text-xs font-normal text-muted-foreground', week: 'mt-2 flex w-full', day: 'relative size-9 p-0 text-center text-sm', day_button: 'inline-flex size-9 items-center justify-center rounded-md font-normal hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', selected: '[&>button]:bg-primary [&>button]:text-primary-foreground [&>button]:hover:bg-primary', today: '[&>button]:bg-accent [&>button]:text-accent-foreground', outside: 'text-muted-foreground opacity-50', disabled: 'text-muted-foreground opacity-50', hidden: 'invisible', dropdowns: 'flex w-full items-center justify-center gap-2', dropdown: 'inline-flex h-9 items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring', dropdown_month: 'inline-flex h-9 items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring', dropdown_year: 'inline-flex h-9 items-center justify-between rounded-md border border-input bg-background px-3 text-sm shadow-xs focus:outline-none focus:ring-2 focus:ring-ring', ...classNames }} components={{ Chevron: ({ orientation }) => orientation === 'left' ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" /> }} {...props} />;
}

export { Calendar };
