export interface UiBreadcrumbItem {
  label: string;
  href?: string;
  disabled?: boolean;
}

export type UiBreadcrumbItems =
  | readonly UiBreadcrumbItem[]
  | Readonly<Record<string, UiBreadcrumbItem>>
  | UiBreadcrumbItem;

export interface UiBreadcrumbProps {
  items: UiBreadcrumbItems;
  ariaLabel?: string;
}