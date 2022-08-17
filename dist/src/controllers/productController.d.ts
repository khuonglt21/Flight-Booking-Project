declare class ProductController {
    constructor();
    showHome(req: any, res: any, next: any): Promise<any>;
    searchFlight(req: any, res: any, next: any): Promise<any>;
    bookingFlight(req: any, res: any, next: any): Promise<any>;
    paymentBooking(req: any, res: any, next: any): Promise<any>;
    getPaymentBooking(req: any, res: any, next: any): Promise<any>;
    confirmPayment(req: any, res: any, next: any): Promise<any>;
    paymentSuccess(req: any, res: any, next: any): Promise<any>;
}
declare const _default: ProductController;
export default _default;
