
export const setUser=(user)=>{

    return (dispatch)=>{
        dispatch({type:'SET_USER',payload:user});
    }

}

export const clearUser=()=>{
    return (dispatch)=>{
        dispatch({type:'CLEAR_USER'});
    }
}

export const setCurrentChannel=(channel)=>{
    return (dispatch)=>{
        dispatch({type:'SET_CURRENT_CHANNEL',payload:channel})
    }
}

export const setPrivateChannel=(isPrivateChannel)=>{
    return (dispatch)=>{
        dispatch({type:'SET_PRIVATE_CHANNEL',payload:isPrivateChannel})
    }
}

export const setUserPosts=(userpost)=>{
    return (dispatch)=>{
        dispatch({type:'SET_USER_POSTS',payload:userpost});
    }
}

export const setColors=(primary,secondary)=>{
    return (dispatch)=>{
        dispatch({type:'SET_COLORS',payload:{primary,secondary}}); 
    }
}