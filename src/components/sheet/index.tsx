import { Button } from "../Button";
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
                <Button    variant="secondary"
            className="w-full gap-2 py-1.5 text-base sm:w-fit sm:text-sm">
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
