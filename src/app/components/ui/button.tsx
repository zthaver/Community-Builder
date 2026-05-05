import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../../../lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-lg font-semibold transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'text-white bg-gray-600 hover:bg-gray-700 cursor-pointer',
        destructive:
          'bg-red-600 text-white shadow-xs hover:bg-red-700 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40',
        outline:
          'border-2 border-gray-500 text-gray-700 shadow-xs hover:bg-gray-200 hover:text-gray-900',
        secondary:
          'bg-gray-500 text-white shadow-xs hover:bg-gray-600',
        ghost: 'cursor-pointer bg-gray-600 text-white hover:bg-gray-700',
        link: 'text-blue-600 underline-offset-4 hover:underline text-lg',
      },
      size: {
        default: 'h-12 px-6 py-3 has-[>svg]:px-4',
        sm: 'h-10 rounded-lg gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-14 rounded-lg px-8 has-[>svg]:px-6 text-xl',
        icon: 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
