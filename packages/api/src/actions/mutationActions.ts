import { Reference, useMutation } from "@apollo/client";

import {
  ADD_ADDRESS,
  ADD_DISCOUNT,
  ADD_PAYMENT_METHOD,
  CONFIRM_ORDER,
  CREATE_PAYMENT_INTENT,
  DELETE_ADDRESS,
  DELETE_PAYMENT_METHOD,
  EDIT_ADDRESS,
  LOGIN,
  LOGOUT,
  REGISTER,
  REMOVE_DISCOUNT,
  REMOVE_FROM_CART,
  SET_DELIVERY_OPTION,
  UPDATE_CART,
} from "../definitions/mutations";
import {
  AddAddress,
  AddAddressVariables,
  AddAddress_accountAddAddress,
} from "../types/AddAddress";
import { AddDiscount, AddDiscountVariables } from "../types/AddDiscount";
import {
  AddPaymentMethod,
  AddPaymentMethodVariables,
  AddPaymentMethod_accountAddPaymentMethod,
} from "../types/AddPaymentMethod";
import { ConfirmOrder, ConfirmOrderVariables } from "../types/ConfirmOrder";
import {
  CreatePaymentIntent,
  CreatePaymentIntentVariables,
} from "../types/CreatePaymentIntent";
import { DeleteAddress, DeleteAddressVariables } from "../types/DeleteAddress";
import {
  DeletePaymentMethod,
  DeletePaymentMethodVariables,
} from "../types/DeletePaymentMethod";
import {
  EditAddress,
  EditAddressVariables,
  EditAddress_accountEditAddress,
} from "../types/EditAddress";
import { Login, LoginVariables } from "../types/Login";
import { Logout } from "../types/Logout";
import { Register, RegisterVariables } from "../types/Register";
import {
  RemoveDiscount,
  RemoveDiscountVariables,
} from "../types/RemoveDiscount";
import {
  RemoveFromCart,
  RemoveFromCartVariables,
} from "../types/RemoveFromCart";
import {
  SetDeliveryOption,
  SetDeliveryOptionVariables,
} from "../types/SetDeliveryOption";
import { UpdateCart, UpdateCartVariables } from "../types/UpdateCart";

interface MutationParams<T> {
  onSuccess?: (data?: T) => void;
}

/**
 * ADDRESS
 */

export function useAddAddress({
  onSuccess,
}: MutationParams<AddAddress_accountAddAddress>) {
  return useMutation<AddAddress, AddAddressVariables>(ADD_ADDRESS, {
    update(cache, { data }) {
      if (data?.accountAddAddress?.id) {
        cache.modify({
          fields: {
            accountAddressList(existing: Reference[], { toReference }) {
              const addressRef = toReference({ ...data.accountAddAddress });

              return [...existing, addressRef];
            },
          },
        });
        onSuccess?.(data.accountAddAddress);
      }
    },
  });
}

export function useEditAddress({
  onSuccess,
}: MutationParams<EditAddress_accountEditAddress>) {
  return useMutation<EditAddress, EditAddressVariables>(EDIT_ADDRESS, {
    onCompleted({ accountEditAddress }) {
      if (accountEditAddress?.id) {
        onSuccess?.(accountEditAddress);
      }
    },
  });
}

export function useDeleteAddress({
  onSuccess,
}: MutationParams<EditAddress_accountEditAddress>) {
  return useMutation<DeleteAddress, DeleteAddressVariables>(DELETE_ADDRESS, {
    onCompleted({ accountRemoveAddress }) {
      if (accountRemoveAddress) {
        onSuccess?.();
      }
    },
    update(cache, { data }) {
      if (data?.accountRemoveAddress) {
        cache.modify({
          fields: {
            accountAddressList(existing: Reference[], { toReference }) {
              const all = data.accountRemoveAddress?.map((a) =>
                toReference({ ...a })
              );
              return all;
            },
          },
        });
      }
    },
  });
}

/**
 * PAYMENT
 */

export function useAddPaymentMethod({
  onSuccess,
}: MutationParams<AddPaymentMethod_accountAddPaymentMethod>) {
  return useMutation<AddPaymentMethod, AddPaymentMethodVariables>(
    ADD_PAYMENT_METHOD,
    {
      update(cache, { data }) {
        if (data?.accountAddPaymentMethod?.id) {
          cache.modify({
            fields: {
              accountPaymentMethodList(existing: Reference[], { toReference }) {
                const addressRef = toReference({
                  ...data.accountAddPaymentMethod,
                });

                return [addressRef, ...existing];
              },
            },
          });
          onSuccess?.(data.accountAddPaymentMethod);
        }
      },
    }
  );
}
export function useDeletePaymentMethod() {
  return useMutation<DeletePaymentMethod, DeletePaymentMethodVariables>(
    DELETE_PAYMENT_METHOD,
    {
      onCompleted({ accountRemovePaymentMethod }) {
        if (accountRemovePaymentMethod) {
          console.log("eliminado");
        }
      },
      update(cache, { data }) {
        if (data?.accountRemovePaymentMethod) {
          cache.modify({
            fields: {
              accountPaymentMethodList(existing: Reference[], { toReference }) {
                const all = data.accountRemovePaymentMethod?.map((a) =>
                  toReference({ ...a })
                );
                return all;
              },
            },
          });
        }
      },
    }
  );
}
export function useSetDeliverOption() {
  return useMutation<SetDeliveryOption, SetDeliveryOptionVariables>(
    SET_DELIVERY_OPTION
  );
}
export function useCreatePaymentIntent() {
  return useMutation<CreatePaymentIntent, CreatePaymentIntentVariables>(
    CREATE_PAYMENT_INTENT
  );
}
export function useConfirmOrder() {
  return useMutation<ConfirmOrder, ConfirmOrderVariables>(CONFIRM_ORDER, {
    update(cache, { data: updateData }) {
      if (updateData?.confirmOrder?.order?.id) {
        cache.modify({
          fields: {
            cart() {
              return [];
            },
          },
        });
      }
    },
  });
}

/**
 * CART
 */

export function useRemoveCart() {
  return useMutation<RemoveFromCart, RemoveFromCartVariables>(REMOVE_FROM_CART);
}
export function useUpdateCart() {
  return useMutation<UpdateCart, UpdateCartVariables>(UPDATE_CART);
}
export function useAddDiscount() {
  return useMutation<AddDiscount, AddDiscountVariables>(ADD_DISCOUNT);
}
export function useRemoveDiscount() {
  return useMutation<RemoveDiscount, RemoveDiscountVariables>(REMOVE_DISCOUNT);
}

/**
 * AUTH
 */

export function useLogin() {
  return useMutation<Login, LoginVariables>(LOGIN);
}
export function useLogout() {
  return useMutation<Logout>(LOGOUT);
}
export function useRegister() {
  return useMutation<Register, RegisterVariables>(REGISTER);
}
