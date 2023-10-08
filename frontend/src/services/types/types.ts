export type TComputer = {
    id: number,
    name: string,
    status: string,
    details?: {
        price: number,
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