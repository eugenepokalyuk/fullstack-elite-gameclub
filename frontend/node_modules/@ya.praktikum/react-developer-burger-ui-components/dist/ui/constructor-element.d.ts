import React from 'react';
import './constructor-element.css';
export declare const ConstructorElement: React.FC<{
    text: string;
    thumbnail: string;
    price: number;
    type?: 'top' | 'bottom';
    isLocked?: boolean;
    extraClass?: string;
    handleClose?: () => void;
}>;
