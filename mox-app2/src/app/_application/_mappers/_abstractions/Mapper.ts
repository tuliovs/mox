import { IMapper } from '../_interfaces/IMapper';

export class Mapper<T> implements IMapper<T> {

    constructor(private instance: new () => T) { }

    map(json): T {
        const obj = new this.instance();

        Object.keys(obj).forEach(key => {
            obj[key] = json[key.charAt(0).toUpperCase() + key.slice(1)];
        });

        return obj;
    }

}
