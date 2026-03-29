import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import LabelField from "@/components/LabelField";
import type { IProduct } from "@/types/product";
import Spinner from "./Spinner";

interface Props {
  open: boolean;
  onClose: () => void;
  stockProduct: IProduct | null;
  stockValue: string;
  onStockValueChange: (value: string) => void;
  isPending: boolean;
  onSubmit: () => void;
}

const StockModal = ({
  open,
  onClose,
  stockProduct,
  stockValue,
  onStockValueChange,
  isPending,
  onSubmit,
}: Props) => (
  <Dialog open={open} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle className="font-light tracking-wide text-gray-800 font-serif">
          Update Stock
        </DialogTitle>
      </DialogHeader>
      <p className="text-xs text-gray-400 -mt-2">{stockProduct?.title}</p>

      <LabelField label="New Stock Quantity">
        <Input
          type="number"
          value={stockValue}
          onChange={(e) => onStockValueChange(e.target.value)}
          placeholder="0"
          restrictSpecialChars={false}
        />
      </LabelField>

      <DialogFooter>
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancel
        </Button>
        <Button size="sm" disabled={isPending} onClick={onSubmit}>
          {isPending && <Spinner />}
          Update
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default StockModal;
