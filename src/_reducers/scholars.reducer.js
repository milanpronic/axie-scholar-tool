const data = [];

const prepare = (input_scholars) => {
    return input_scholars.map(item => {
        if(item["name"] == item["name"] * 1) item["name"] = item["name"] * 1;
        if (item["total"] != null && item["rule"]) {
            const rule = typeof item["rule"] == 'string' ? JSON.parse(item["rule"]): item["rule"];
            for (var i = rule.length - 1; i >= 0; i--) {
                if (rule[i][0] > item["total"]) {
                    item["scholar"] = (item["total"] * rule[i][1] / 100).toFixed(0) * 1;
                    item["manager"] = item["total"] - item["scholar"];
                }
            }
        }
        if (item["last_time"] && item["last_time"] != 0 && item["last_time"] != undefined) {
            let last_time = new Date(item["last_time"]);
            if(last_time.getTime()) {
                item["next"] = last_time.getTime() + 14 * 24 * 3600 * 1000;
                
                if(item["next"] < Date.now() && item["total"] - item["balance"] > 0) item["claim_status"] = 3;
                else if(last_time < 100) item["claim_status"] = 0;
                else if(Date.now() - last_time < 24 * 3600 * 1000) item["claim_status"] = 1;
                else item["claim_status"] = 0;
            }
        }
        if (item["balance"]) item["pay_status"] = 3;
        else if(item["last_paid"] && Date.now() - (new Date(item["last_paid"])) < 24 * 3600 * 1000) item["pay_status"] = 1;
        else item["pay_status"] = 0;
        return item;
    })
};

export function scholars(state = data, action) {
    switch(action.type) {
        case "SET_SCHOLARS":
            return prepare([...action.payload]);
            break;
        case "ADD_SCHOLAR": 
            return prepare([...state, action.payload]);
            break;
        case "ADD_SCHOLARS":
            return prepare([...state, ...action.payload]);
            break;
        case "UPDATE_SCHOLAR":
            return prepare(state.map(row => {
                if (row.id == action.payload.id) return {...row, ...action.payload};
                return row;
            }));
            break;
        case "DELETE_SCHOLAR":
            return prepare(state.filter(row => {
                return row.id != action.payload;
            }));
            break;
        case "DELETE_SCHOLARS":
            return prepare(state.filter(row => {
                return action.payload.indexOf(row.id) == -1;
            }));
            break;
        default:
            return [...state];
            break;
    }
}