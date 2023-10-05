import { combineReducers } from 'redux';
import { computersReducer } from './computers';

const rootReducer = combineReducers({
    playground: computersReducer
});

export default rootReducer;