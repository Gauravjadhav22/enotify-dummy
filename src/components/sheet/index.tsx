import { Button } from "../new-button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./sheet"

type DrawerProps = {
    triggerText?: string;
    title?: string;
    description?: string;
    children?: React.ReactNode; // The content to be rendered inside the drawer
};

const Drawer = ({ triggerText, title, description, children }: DrawerProps) => {
    return (
        <Sheet>
            <SheetTrigger>
                <Button className="">
                    {triggerText ?? 'open'}

                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title??"welcome to ultimateIO"}</SheetTitle>
                    <SheetDescription>{description??"submit following details"}</SheetDescription>
                </SheetHeader>
                <div className="mt-10">{children}</div>
            </SheetContent>
        </Sheet>
    );
};

export default Drawer;
