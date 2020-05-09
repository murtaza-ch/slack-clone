const initialState={
    currentChannel:null,
    isPrivateChannel:false,
    userPosts:null
}

export default function(state=initialState,action){
    const {type,payload}=action;

    switch (type) {
        case 'SET_CURRENT_CHANNEL':
            return{
                ...state,
                currentChannel:payload
            }
        case 'SET_PRIVATE_CHANNEL':
            return{
                ...state,
                isPrivateChannel:payload
            }
        case 'SET_USER_POSTS':
            return{
                ...state,
                userPosts:payload
            }
        default:
            return state;
    }
}