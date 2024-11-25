import { useDispatch, useSelector } from "react-redux";
import { addItem, removeItem } from "../../redux/slices/cartSlice";

export default function ListItem({ product }: { product: any }) {
  const dispatch = useDispatch();

  const calculateItemPrice = (price: string, quantity: number) => {
    return parseInt(price) * quantity;
  };
  return (
    <article className="flex items-start space-x-6 p-6 bg-gray-100 dark:bg-gray-800 mb-3">
      <img
        src={product.image}
        alt=""
        width="60"
        height="88"
        className="flex-none rounded-md object-contain bg-slate-100"
      />
      <div className="min-w-0 relative flex-auto">
        <h2 className="font-semibold truncate pr-20 mb-8">{product.name}</h2>
        <dl className="mt-2 flex flex-wrap text-sm leading-6 font-medium">
          <div className="absolute top-0 right-0 flex items-center space-x-1">
            <dd>${calculateItemPrice(product.price, product.quantity)}</dd>
          </div>
          <div className="flex flex-row">
            <dd
              className="px-2.5 ring-1 ring-slate-200 rounded cursor-pointer"
              onClick={() => dispatch(removeItem(product.id))}
            >
              -
            </dd>

            <dd className="px-3.5 ring-1 ring-slate-200 rounded mx-2">
              {product.quantity}
            </dd>
            <dd
              className="px-2.5 ring-1 ring-slate-200 rounded cursor-pointer"
              onClick={() => dispatch(addItem(product))}
            >
              +
            </dd>
          </div>
        </dl>
      </div>
    </article>
  );
}
