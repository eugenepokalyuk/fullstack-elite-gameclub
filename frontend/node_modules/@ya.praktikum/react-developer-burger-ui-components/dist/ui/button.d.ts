import React, { SyntheticEvent } from 'react';
import './button.css';
interface Props extends React.PropsWithChildren<Omit<React.HTMLProps<HTMLButtonElement>, 'type' | 'size'>> {
    type?: 'secondary' | 'primary';
    size?: 'small' | 'medium' | 'large';
    onClick?: (() => void) | ((e: SyntheticEvent) => void);
    extraClass?: string;
    htmlType: 'button' | 'submit' | 'reset';
}
export declare const Button: React.FC<Props>;
export {};
