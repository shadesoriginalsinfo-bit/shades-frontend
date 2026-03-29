import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import Spinner from "./Spinner";

interface Props {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  title: string;
  children: ReactNode;
}

const ConfirmDeleteModal = ({ open, onClose, onConfirm, isPending, title, children }: Props) => (
  <Dialog open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-light tracking-wide text-gray-800 font-serif">
          {title}
        </DialogTitle>
      </DialogHeader>
      {children}
      <DialogFooter>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="destructive" size="sm" disabled={isPending} onClick={onConfirm}>
          {isPending && <Spinner />}
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmDeleteModal;
