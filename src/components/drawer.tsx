import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "./sheet"

type DrawerProps = {
    triggerText: string;
    title: string;
    description: string;
    children: React.ReactNode; // The content to be rendered inside the drawer
};

const Drawer = ({ triggerText, title, description, children }: DrawerProps) => {
    return (
        <Sheet>
            <SheetTrigger>{triggerText}</SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>{title}</SheetTitle>
                    <SheetDescription>{description}</SheetDescription>
                </SheetHeader>
                <div>{children}</div> {/* Render the passed content */}
            </SheetContent>
        </Sheet>
    );
};

export default Drawer;
