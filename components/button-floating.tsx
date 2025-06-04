import { cn } from "@/lib/cn";
import { Octicons } from "@expo/vector-icons";
import { cva, type VariantProps } from "class-variance-authority";
import { forwardRef } from "react";
import { Pressable } from "react-native";

import tailwindColors from "@/tailwind-colors";
import AnimatedPressable from "./animated-pressable";

const buttonVariants = cva(
  "flex items-center justify-center rounded-full shadow-lg",
  {
    variants: {
      variant: {
        primary: "bg-background-brand shadow-primary-400/25",
        secondary: "bg-background-secondary shadow-base-900/50",
        tertiary: "bg-background-tertiary shadow-base-900/25",
      },
      size: {
        default: "h-12 w-12",
        sm: "h-10 w-10",
        lg: "h-14 w-14",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

// Map variants to icon colors
const getIconColor = (
  variant: "primary" | "secondary" | "tertiary" | null | undefined
) => {
  switch (variant) {
    case "primary":
      return tailwindColors.text.brandDark;
    case "secondary":
      return tailwindColors.text.secondary;
    case "tertiary":
      return tailwindColors.text.tertiary;
    default:
      return "white";
  }
};

interface FloatingButtonProps
  extends VariantProps<typeof buttonVariants>,
    Omit<React.ComponentProps<typeof AnimatedPressable>, "children"> {
  octicon: keyof typeof Octicons.glyphMap;
  className?: string;
  iconColor?: string;
}

const FloatingButton = forwardRef<
  React.ComponentRef<typeof Pressable>,
  FloatingButtonProps
>(({ octicon, variant, size, className, iconColor, ...props }, ref) => {
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;
  const color = iconColor || getIconColor(variant);

  return (
    <AnimatedPressable
      ref={ref}
      haptic
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    >
      <Octicons name={octicon} size={iconSize} color={color} />
    </AnimatedPressable>
  );
});

FloatingButton.displayName = "FloatingButton";

export { buttonVariants, FloatingButton };
