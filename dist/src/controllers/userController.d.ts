declare const userController: {
    showInfo: (req: any, res: any, next: any) => void;
    editInfo: (req: any, res: any, next: any) => Promise<void>;
};
export default userController;
