import React from "react";

const PurchaseHistoryItem = ({ product }: any) => {
  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <article className="flex items-start space-x-6 p-6 rounded-md bg-gray-100 dark:bg-gray-800 mb-3">
      <div className="flex-none w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
        <img
          src={product.product.image}
          alt={product.product.name}
          className="w-16 h-16 object-cover rounded-md"
        />
      </div>

      <div className="min-w-0 relative flex-auto">
        <div className="flex justify-between items-start mb-2">
          <h2 className="font-semibold text-lg">{product.product.name}</h2>
          <div className="text-right">
            <p className="font-medium">${product.totalPrice.toFixed(2)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {formatDate(product.date)}
            </p>
          </div>
        </div>

        <dl className="mt-2 text-sm gap-3 text-gray-600 dark:text-gray-300">
          <div>
            <dt className="inline font-bold">Quantity: </dt>
            <dd className="inline">{product.quantity}</dd>
          </div>
          <div>
            <dt className="inline font-bold">Status: </dt>
            <dd className="inline capitalize">
              {product.status.toLowerCase()}
            </dd>
          </div>

          {product.product.description && (
            <div className="">
              <dt className="inline font-bold">Description: </dt>
              <dd className="inline capitalize mt-1">{product.product.description}</dd>
            </div>
          )}
        </dl>
      </div>
    </article>
  );
};

export default PurchaseHistoryItem;
