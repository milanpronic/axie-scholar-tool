const data = {
    total: 0,
    manager: 0,
    scholar: 0,
    accounts: 0,
    latest: Date.now()
};

export function summary(state = data, action) {
    console.log('payload', action);
    switch(action.type) {
        case "SET_SUMMARY":
            return {...state, ...action.payload};
            break;
        default:
            return {...state};
            break;
    }
}

