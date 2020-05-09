const initialState={
    primaryColor:'#4c3c4c',
    secondaryColor:'#eee'
}

export default function(state=initialState,action) {
    const {type,payload}=action;
    switch (type) {
        case 'SET_COLORS':
            return{
                primaryColor:payload.primary,
                secondaryColor:payload.secondary
            }
        default:
            return state;
    }
}