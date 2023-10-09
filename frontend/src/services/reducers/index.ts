import { combineReducers } from 'redux';
import { computersReducer } from './computers';
import { storeReducer } from './store';
import { warehouseReducer } from './warehouse';
import { paymentReducer } from './payment';
import { statReducer } from './stat';

const rootReducer = combineReducers({
    playground: computersReducer,
    store: storeReducer,
    warehouse: warehouseReducer,
    payment: paymentReducer,
    stat: statReducer
});

export default rootReducer;