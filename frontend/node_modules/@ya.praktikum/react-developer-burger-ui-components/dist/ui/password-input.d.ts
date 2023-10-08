import React from 'react';
interface TPasswordInputInterface extends Omit<React.HTMLProps<HTMLInputElement>, 'size' | 'type' | 'ref'> {
    value: string;
    placeholder?: string;
    size?: 'default' | 'small';
    icon?: 'HideIcon' | 'ShowIcon' | 'EditIcon';
    extraClass?: string;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
}
export declare const PasswordInput: React.FC<TPasswordInputInterface>;
export {};
