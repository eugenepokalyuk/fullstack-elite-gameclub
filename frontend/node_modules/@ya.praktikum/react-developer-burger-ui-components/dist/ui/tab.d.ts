import React from 'react';
import './tab.css';
export declare const Tab: React.FC<React.PropsWithChildren<{
    active: boolean;
    value: string;
    onClick: (value: string) => void;
}>>;
