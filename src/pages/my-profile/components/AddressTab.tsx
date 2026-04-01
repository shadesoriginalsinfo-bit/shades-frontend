import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MapPin, Plus, Pencil, Trash2, Loader2, Star } from "lucide-react";
import toast from "react-hot-toast";
import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
} from "@/lib/api";

import { handleApiError } from "@/utils/handleApiError";
import type { IAddress, ICreateAddress } from "@/types/address";
import AddressFormModal from "./AddressFormModal";

const AddressesTab = () => {
  const queryClient = useQueryClient();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<IAddress | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: addresses = [], isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: getAddresses,
  });

  const addMutation = useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setModalOpen(false);
      toast.success("Address added");
    },
    onError: handleApiError,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ICreateAddress }) =>
      updateAddress(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setModalOpen(false);
      setEditingAddress(null);
      toast.success("Address updated");
    },
    onError: handleApiError,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      toast.success("Address removed");
    },
    onError: handleApiError,
    onSettled: () => setDeletingId(null),
  });

  const handleSave = (payload: ICreateAddress, id?: string) => {
    if (id) {
      updateMutation.mutate({ id, payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const isSaving = addMutation.isPending || updateMutation.isPending;

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <p className="text-[11px] tracking-[0.25em] uppercase font-semibold text-gray-500">
          {addresses.length} Address{addresses.length !== 1 ? "es" : ""}
        </p>
        <button
          onClick={() => {
            setEditingAddress(null);
            setModalOpen(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-[#2A1810] text-white text-xs tracking-[0.2em] uppercase font-medium hover:bg-[#C6A46C] transition-all rounded-sm"
        >
          <Plus size={13} /> Add Address
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={22} className="animate-spin text-[#C6A46C]" />
        </div>
      ) : addresses.length === 0 ? (
        <div className="bg-white border border-[#E8DDD0] rounded-sm py-14 flex flex-col items-center gap-3">
          <MapPin size={32} className="text-[#C6A46C]/40" />
          <p className="text-sm text-gray-400 tracking-wide">
            No addresses saved yet
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="bg-white border border-[#E8DDD0] rounded-sm p-4 relative group"
            >
              {/* Default badge */}
              {addr.isDefault && (
                <span className="absolute top-3 right-3 flex items-center gap-1 text-[9px] tracking-wider uppercase px-1.5 py-0.5 bg-[#C6A46C]/10 text-[#C6A46C] border border-[#C6A46C]/30 rounded-sm">
                  <Star size={8} fill="currentColor" /> Default
                </span>
              )}

              {addr.label && (
                <p className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#C6A46C] mb-1">
                  {addr.label}
                </p>
              )}
              <p className="text-sm text-gray-800 font-medium leading-snug">
                {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ""}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {addr.city}
                {addr.state ? `, ${addr.state}` : ""} — {addr.postalCode}
              </p>
              <p className="text-xs text-gray-400">{addr.country}</p>

              {/* Actions */}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8DDD0]">
                <button
                  onClick={() => {
                    setEditingAddress(addr);
                    setModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#C6A46C] transition-colors tracking-wide"
                >
                  <Pencil size={12} /> Edit
                </button>
                <span className="text-gray-200">|</span>
                <button
                  onClick={() => {
                    setDeletingId(addr.id);
                    deleteMutation.mutate(addr.id);
                  }}
                  disabled={deleteMutation.isPending && deletingId === addr.id}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors tracking-wide disabled:opacity-50"
                >
                  {deleteMutation.isPending && deletingId === addr.id ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <AddressFormModal
          address={editingAddress}
          onClose={() => {
            setModalOpen(false);
            setEditingAddress(null);
          }}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}
    </>
  );
};

export default AddressesTab;
