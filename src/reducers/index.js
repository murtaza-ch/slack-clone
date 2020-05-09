import {combineReducers} from 'redux'
import user from './User';
import channel from './Channel';
import color from './Color';

export default combineReducers({
    user,
    channel,
    color
})