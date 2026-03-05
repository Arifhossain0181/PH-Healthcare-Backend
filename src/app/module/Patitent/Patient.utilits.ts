import { isValid, parse } from "date-fns";

export const converdatetime = (datestring: string | undefined) =>{
    if(!datestring) return ""
    const date = parse(datestring, 'yyyy-MM-dd', new Date());
    if(!isValid(date)){
        return ""
    }
    return date;
}