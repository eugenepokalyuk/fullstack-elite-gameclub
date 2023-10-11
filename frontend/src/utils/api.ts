import { useAppSelector } from "../services/hooks/hooks";
import { TComputer, TPlayBody } from "../services/types/types";

// const ApiUrlPath = 'http://172.20.10.4:80';
const ApiUrlPath = 'http://localhost:8000';

const routeStore = "/store";
const routePlayground = "/pc";
const routeStat = "/stat";
const routeUser = "/user";

const request = (endpoint: string, options: any) => {
    const url = `${ApiUrlPath}${endpoint}`;
    return fetch(url, options).then(checkResponse);
};

const checkResponse = (res: Response) => {
    return res.ok
        ? res.json()
        : res.json().then((err) => Promise.reject(err));
};
export const fetchComputersData = async () => {
    const endpoint = routePlayground + "/ping";
    const options = {
        headers: {
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}
export const fetchPlay = async (body: TPlayBody) => {
    const endpoint = routePlayground + "/play";
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify(body)
    }
    return request(endpoint, options);
}
export const fetchPause = async (id: number) => {
    const endpoint = routePlayground + `/pause?id=${id}`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}
export const fetchContinue = async (id: number) => {
    const endpoint = routePlayground + `/continue?id=${id}`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}
export const fetchFinish = async (computer: TComputer, newPrice: number | undefined, paymentType: string) => {
    const endpoint = routePlayground + "/finish";
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: newPrice ? JSON.stringify({
            id: computer.id,
            price: (newPrice),
            payment: paymentType
        }) : JSON.stringify({
            id: computer.id,
        })
    }
    return request(endpoint, options);
}
export const fetchTechOff = async (id: number) => {
    const endpoint = routePlayground + `/techworks/stop?id=${id}`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}
export const fetchTechOn = async (id: number, reason: string) => {
    const endpoint = routePlayground + `/techworks/start`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            id: id,
            reason: reason
        })
    }
    return request(endpoint, options);
}
export const fetchStoreData = async () => {
    const endpoint = routeStore + "/items";
    const options = {
        headers: {
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}
export const fetchStoreSell = async (selectedItems: any) => {
    const endpoint = routeStore + "/item/sell";
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify(selectedItems)
    }
    return request(endpoint, options);
}
export const fetchWarehouseAddItem = async (name: string, price: number | undefined) => {
    const endpoint = routeStore + "/item/add";
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            name: name,
            price: price
        })
    }
    return request(endpoint, options);
}
export const fetchWarehouseAddSupply = async (selectedItems: any) => {
    const endpoint = routeStore + "/supply";
    const options = {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({ items: selectedItems })
    }
    return request(endpoint, options);
}
export const fetchWarehouseItem = async (id: any) => {
    if (id > 0) {
        const endpoint = routeStore + `/info?id=${id}`;
        const options = {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('uuid')
            },
        }
        return request(endpoint, options);
    }
}
export const fetchWarehouseEditItemName = async (id: number | undefined, name: string) => {
    const endpoint = routeStore + `/item/edit/name`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            id: id,
            name: name
        })
    }
    return request(endpoint, options);
}
export const fetchWarehouseEditItemPrice = async (id: number | undefined, price: number) => {
    const endpoint = routeStore + `/item/edit/price`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            id: id,
            price: price
        })
    }
    return request(endpoint, options);
}
export const fetchWarehouseHideItem = async (id: number | undefined) => {
    const endpoint = routeStore + `/item/hide?id=${id}`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            id: id
        })
    }
    return request(endpoint, options);
}
export const fetchWarehouseShowItem = async (id: number | undefined) => {
    const endpoint = routeStore + `/item/show?id=${id}`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}
export const fetchComputerGridReplace = async (id: number | undefined, gridId: any) => {
    const endpoint = routePlayground + `/edit/grid`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            id: id,
            grid_id: gridId
        })
    }
    return request(endpoint, options);
}
export const fetchComputerStatData = async (from: string, until: string) => {
    const endpoint = routeStat + `/pc`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            From: from,
            Until: until
        })
    }
    return request(endpoint, options);
}
export const fetchStoreStatData = async (from: string, until: string) => {
    const endpoint = routeStat + `/store`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            From: from,
            Until: until
        })
    }
    return request(endpoint, options);
}
export const fetchStatSessionData = async () => {
    const endpoint = routeStat + `/session`;
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid'),
            SessionId: localStorage.getItem('sessionId')
        }
    }
    return request(endpoint, options);
}

export const fetchRemoveComputer = async (computer: TComputer) => {
    const endpoint = routePlayground + `/remove?id=${computer.id}`;
    const options = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}
export const fetchEditComputerName = async (computer: TComputer, name: string) => {
    const endpoint = routePlayground + `/edit/name`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            id: computer.id,
            name: name
        })
    }
    return request(endpoint, options);
}
export const fetchUserLogin = async (login: string, password: string) => {
    const endpoint = routeUser + `/login`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            login: login,
            password: password
        })
    }
    return request(endpoint, options);
}
export const fetchUserRegister = async (name: string, login: string, password: string) => {
    const endpoint = routeUser + `/create`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            name: name,
            login: login,
            password: password
        })
    }
    return request(endpoint, options);
}
export const fetchUserRefresh = async (uuid: string, sessionId: string) => {
    const endpoint = routeUser + `/auth`;
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: uuid,
            SessionId: sessionId
        }
    }
    return request(endpoint, options);
}
export const fetchUserFinish = async (uuid: string, sessionId: string) => {
    const endpoint = routeUser + `/finish`;
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: uuid,
            SessionId: sessionId
        }
    }
    return request(endpoint, options);
}
