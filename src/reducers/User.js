const initialState={
    currentUser:null,
    isLoading:true
}

export default function(state=initialState,action){
    const {payload,type}=action;

    switch (type) {
        case 'SET_USER':
            return{
                currentUser:payload,
                isLoading:false
            }
        case 'CLEAR_USER':
            return{
                ...state,
                isLoading:false
            }
        default:
            return state;
    }
}