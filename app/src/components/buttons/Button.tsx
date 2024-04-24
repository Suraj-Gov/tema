import { Button as BaseButton, ButtonProps } from "@radix-ui/themes";
import { CSSProperties, ElementRef, forwardRef } from "react";

interface props extends ButtonProps {
  cursor?: CSSProperties["cursor"];
}
type ButtonElement = ElementRef<typeof BaseButton>;
const Button = forwardRef<ButtonElement, props>((props, ref) => {
  return (
    <BaseButton
      {...props}
      style={{ ...props.style, cursor: props.cursor ?? "pointer" }}
      ref={ref}
    />
  );
});

Button.displayName = "Button";
export default Button;
