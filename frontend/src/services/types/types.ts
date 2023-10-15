export type TComputer = {
    id: number,
    name: string,
    status: string,
    grid_id: number,
    details?: {
        price: number,
        payment: string,
        time: {
            from: {
                hours: number,
                minutes: number
            },
            until: {
                hours: number,
                minutes: number
            }
        },
        reason: string
    }
}
export type TStoreItem = {
    id: number,
    name: string,
    qty: number,
    price: number,
    hide: boolean
}

export type TPlayBody = {
    id: any;
    price: number,
    time: {
        hours: number,
        minutes: number
    }
}

export interface ComputerDetailsProps {
    computer: TComputer;
    statement: string;
}

export type WarehouseDetailsProps = {
    statement: string;
}

export interface ModalProps {
    children: React.ReactNode;
    header?: string;
    onClose: () => void;
}

export interface ModalOverlayProps {
    onClose: () => void;
}

export interface SquareProps {
    id: number;
    onDragStart: Function;
    onDragOver: Function;
    onDrop: Function;
    playground: TComputer[] | any;
}

export type TStoreStat = {
    id: number,
    item_id: number,
    qty: number,
    total: number,
    payment: string,
    uuid: string,
    date: string
};

export type TComputerStat = {
    id: number,
    payment: string,
    pc_id: number,
    price: number
};

export type TUser = {
    uuid: string,
    sessionId: string,
    name: string
}
