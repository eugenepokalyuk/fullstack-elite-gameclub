import { combineReducers } from 'redux';
import { computersReducer } from './computers';
import { storeReducer } from './store';
import { warehouseReducer } from './warehouse';
import { paymentReducer } from './payment';

const rootReducer = combineReducers({
    playground: computersReducer,
    store: storeReducer,
    warehouse: warehouseReducer,
    payment: paymentReducer
});

export default rootReducer;