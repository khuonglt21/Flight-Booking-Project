declare class CreateFlightController {
    constructor();
    createClass(req: any, res: any, next: any): Promise<any>;
    createCity(req: any, res: any, next: any): Promise<any>;
    createFlight(req: any, res: any, next: any): Promise<any>;
    showCreateFlight(req: any, res: any, next: any): Promise<any>;
    showCreateDetail(req: any, res: any, next: any): Promise<any>;
    createDetailFlight(req: any, res: any, next: any): Promise<any>;
    showDetailFlight(req: any, res: any, next: any): Promise<any>;
}
declare const _default: CreateFlightController;
export default _default;
