export interface Section {
    title: string | null;
    children: {
        title: string;
        id: string;
        startContent?: React.ReactElement | React.ReactElement[];
        endContent?: React.ReactElement | React.ReactElement[];
        disabled?: boolean;
        section?: React.ReactElement | React.ReactElement[];
        danger?: boolean;
        onClick?: () => void;
    }[];
}