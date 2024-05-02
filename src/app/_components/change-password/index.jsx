import React from "react";
import InputField from "../input-field";
import ChangePassInputField from "../change-pass-input-field";
import { useForm } from "react-hook-form";
import GenericButton from "../generic-button";

const ChangePassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      currentPass: "",
      confirmCurrentPass: "",
      newPass: "",
    },
  });
  return (
    <div className="flex items-center justify-center  mt-20 p-5">
      <div className="  w-2/5">
        <div className="  pb-3">
          <h1 className="text-xl font-bold mb-2 ">Change Password</h1>
          <span className=" text-[#989B9E] text-sm font-normal">
            To change your password, please complete the fields below. Remember
            not to use your previous password for the new one.
          </span>
        </div>
        <ChangePassInputField
          title="Current Password"
          placeholder="Enter Current Password"
          register={register}
          name="currentPass"
          error={errors.currentPass}
          validate={{ required: "Current Password is required" }}
          type="password"
        />
        <ChangePassInputField
          title="Confirm Current Password"
          placeholder="Enter Current Password"
          register={register}
          name="confirmCurrentPass"
          error={errors.confirmCurrentPass}
          validate={{ required: "Current Password is required" }}
          type="password"
        />
        <ChangePassInputField
          title="New Password"
          placeholder="Enter New Password"
          register={register}
          name="newPass"
          error={errors.newPass}
          validate={{ required: "New Password is required" }}
          type="password"
        />
        <GenericButton text="Update" onClick={handleSubmit} />
      </div>
    </div>
  );
};

export default ChangePassword;
