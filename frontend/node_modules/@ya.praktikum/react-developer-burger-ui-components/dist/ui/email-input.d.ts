import React from 'react';
interface TEmailInputInterface extends Omit<React.HTMLProps<HTMLInputElement>, 'size' | 'type' | 'ref'> {
    value: string;
    size?: 'default' | 'small';
    placeholder?: string;
    isIcon?: boolean;
    extraClass?: string;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}
export declare const EmailInput: React.FC<TEmailInputInterface>;
export {};
