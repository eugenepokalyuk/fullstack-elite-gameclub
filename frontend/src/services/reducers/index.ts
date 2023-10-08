import { combineReducers } from 'redux';
import { computersReducer } from './computers';
import { storeReducer } from './store';
import { warehouseReducer } from './warehouse';

const rootReducer = combineReducers({
    playground: computersReducer,
    store: storeReducer,
    warehouse: warehouseReducer
});

export default rootReducer;