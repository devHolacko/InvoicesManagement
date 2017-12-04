export class HelperService{
    /**
     *
     */
    constructor() {
        
    }

    public objectToUrl(obj: any): string {
        var parts = [];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
                parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(obj[key]));
            }
        }
        return "?" + parts.join('&');
    }

    public dropDownFromEnum(enumType): any {
        return Object.keys(enumType).filter(f => !isNaN(Number(f)));
    }
}