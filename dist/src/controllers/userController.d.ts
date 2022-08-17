declare const userController: {
    showInfo: (req: any, res: any, next: any) => void;
    editInfo: (req: any, res: any, next: any) => Promise<void>;
    displayHistory: (req: any, res: any) => Promise<void>;
};
export default userController;
