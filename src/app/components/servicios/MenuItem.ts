export interface MenuItem {
    label?: string;
    icon?: string;
    items?: MenuItem[];
    command?: () => void;
    separator?: boolean;
}
