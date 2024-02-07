import { TComputer, TPlayBody, TWriteOff } from "../services/types/types";

// const ApiUrlPath = 'http://89.23.113.109:8084';
const ApiUrlPath = 'http://172.20.10.2:80';
// const ApiUrlPath = 'http://localhost:80';

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
export const fetchCancel = async (computer: TComputer) => {
    const endpoint = routePlayground + `/cancel?id=${computer.id}`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        }
    }
    return request(endpoint, options);
}
export const fetchSwap = async (computer: TComputer, newId: number | undefined) => {
    const endpoint = routePlayground + `/swap`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            id: computer.id,
            new_id: newId
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
export const fetchStoreSell = async (products: any, payment: string) => {
    const endpoint = routeStore + "/item/sell";
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({
            "items": products,
            "payment": payment
        })
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
export const fetchStatSessionData = async (from?: any, until?: any, password?: string) => {
    const endpoint = routeStat + `/session`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid'),
            SessionId: localStorage.getItem('sessionId')
        },
        body: JSON.stringify({
            From: from,
            Until: until,
            Password: password
        })
    }
    return request(endpoint, options);
}
export const fetchAddExpenseData = async (amount: number, reason: string) => {
    const endpoint = routeStat + `/expense`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({ amount, reason })
    }
    return request(endpoint, options);
}
export const fetchAddCashoutData = async (amount: number, password: string) => {
    const endpoint = routeUser + `/cashout/set`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
        body: JSON.stringify({ amount, password })
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
export const fetchGetUsers = async () => {
    const endpoint = routeUser + `/all`;
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        }
    }
    return request(endpoint, options);
}
export const fetchStoreWriteOff = async (object: TWriteOff) => {
    const endpoint = routeStore + `/writeoff`;
    const options = {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid'),
            SessionId: localStorage.getItem('sessionId')
        },
        body: JSON.stringify(object)
    }
    return request(endpoint, options);
}
export const fetchStatPopularPrices = async () => {
    const endpoint = routeStat + `/prices`;
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
export const fetchSubmitPassword = async (password: string) => {
    const endpoint = routeUser + `/auth-admin`;
    const options = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid'),
            SessionId: localStorage.getItem('sessionId')
        },
        body: JSON.stringify({
            password,
        })
    }
    return request(endpoint, options);
}
export const fetchBlockPC = async (id: any, text: string) => {
    const endpoint = routePlayground + `/block?id=${id}&text=${text}`;
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}
export const fetchNotificationToPc = async (id: any, text: string) => {
    const endpoint = routePlayground + `/notification?id=${id}&text=${text}`;
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}
export const fetchUnblockPC = async (id: any) => {
    const endpoint = routePlayground + `/unblock?id=${id}`;
    const options = {
        method: "GET",
        headers: {
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('uuid')
        },
    }
    return request(endpoint, options);
}