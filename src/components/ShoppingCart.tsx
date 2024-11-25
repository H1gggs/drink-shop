// components/ShoppingCart.js
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../../redux/slices/cartSlice";
import { RootState } from "../../redux/store";
import ListItem from "./ListItem";
import { useState } from "react";
import { Button } from "flowbite-react";
import PurchaseHistoryItem from "./PurchaseHistoryItem";

type Props = {
  items: any;
  id: [string, string];
};

const ShoppingCart: React.FC<Props> = (props) => {
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const dispatch = useDispatch();

  const calculateTotalPrice = () => {
    return cartItems.reduce(
      (total, item) => total + parseInt(item?.price) * 1,
      0
    );
  };

  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);

  const goToCheckout = async () => {
    setIsCheckoutLoading(true);
    const res = await fetch(`/api/stripe/create-checkout-session`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cartItems,
        user: props.id[0],
        storeId: "cm2qeedkl0005p0brayy8urps",
        totalPrice: calculateTotalPrice(),
      }),
    });
    const { redirectUrl } = await res.json();
    if (redirectUrl) {
      window.location.assign(redirectUrl);
      dispatch(clearCart());
      await fetch(`/api/sendCardData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          items: cartItems,
          userId: props.id[1],
        }),
      });
    } else {
      setIsCheckoutLoading(false);
      console.log("Error creating checkout session");
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-row w-full">
        {cartItems && (
          <ul className="w-4/5">
            {cartItems.map((item) => (
              <li key={item.id}>
                <ListItem key={item.id} product={item} />
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col items-end justify-start rounded-md text-md font-medium ml-5">
          <p className="text-black dark:text-white text-xl mb-5 mr-5">
            Total Price: ${calculateTotalPrice()}
          </p>
          <Button
            onClick={() => {
              if (isCheckoutLoading) return;
              else goToCheckout();
            }}
            className="bg-indigo-600 text-lg"
          >
            {isCheckoutLoading ? "Loading..." : "Proceed to checkout!"}
          </Button>
        </div>
      </div>
      <div className="flex">
        {props.items && (
          <ul>
            <h1> The products you bought before! </h1>

            {props.items.map((item: any) => (
              <li key={item.id}>
                <PurchaseHistoryItem product={item} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ShoppingCart;
