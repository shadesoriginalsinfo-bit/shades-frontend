import React from "react";


interface TandCProps {
  onOpenModal: () => void;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

const TandC: React.FC<TandCProps> = ({ onOpenModal, checked, onCheckedChange }) => {

  return (
    <div className="flex flex-col gap-3 text-sm mt-10">
      <label className="flex items-start gap-2">
        <input
          type="checkbox"
          name="termsAndConditionAccepted"
          checked={checked}
          onChange={(e) => onCheckedChange(e.target.checked)}
          className="mt-1"
        />
        <span>
          I acknowledge & agree to the{" "}
          <button onClick={onOpenModal} className="text-[#C6A46C] font-semibold hover:text-[#B8936A] transition-colors underline cursor-pointer">
            Terms and Conditions
          </button>
        </span>
      </label>
    </div>
  );
};

export default TandC;
