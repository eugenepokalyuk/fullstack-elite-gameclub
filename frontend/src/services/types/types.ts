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
    id: number;
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
    qty: number,
    total: number,
    item_id: number,
    payment: string,
    name: string,
    uuid: string,
    date: string
};

export type TComputerStat = {
    id: number,
    pc_id: number,
    price: number
    payment: string,
    name: string,
};

export type TUser = {
    uuid: string,
    sessionId: string,
    name: string
}

export type TWriteOff = {
    type: string | undefined,
    details: {
        id: number | undefined,
        qty: number | undefined,
        name?: string
    }
}