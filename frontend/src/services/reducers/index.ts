import { combineReducers } from 'redux';
import { computersReducer } from './computers';
import { storeReducer } from './store';
import { warehouseReducer } from './warehouse';
import { paymentReducer } from './payment';
import { statReducer } from './stat';
import { authReducer } from './auth';
import { sessionReducer } from './session';

const rootReducer = combineReducers({
    playground: computersReducer,
    store: storeReducer,
    warehouse: warehouseReducer,
    payment: paymentReducer,
    stat: statReducer,
    auth: authReducer,
    session: sessionReducer
});

export default rootReducer;