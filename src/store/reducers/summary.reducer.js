const data = {
    today: 0,
    total: 0,
    unclaimed: 0,
    accounts: 0,
    axie: 0
};

export default function(state = data, action) {
    switch(action.type) {
        case "SET_SUMMARY":
            return {...action.payload};
            break;
        default:
            return {...state};
            break;
    }
}