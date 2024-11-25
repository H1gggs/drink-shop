  import ShoppingCart from "@/components/ShoppingCart";
  // import Navbar from "@/components/navbar";
  // import React from "react";
  //
  // import { GetServerSideProps } from "next/types";
  // import { getServerSession } from "next-auth/next";
  // import { authOptions } from "@/pages/api/auth/[...nextauth]";
  // import { prisma } from "../../lib/prisma";


  import React from "react";
  import { GetServerSideProps } from "next/types";
  import { getServerSession } from "next-auth/next";
  import { authOptions } from "@/pages/api/auth/[...nextauth]";
  import { prisma } from "../../lib/prisma";
  import Navbar from "@/components/navbar";
  import { motion } from "framer-motion";
  // @ts-ignore
  import { FaShoppingCart, FaTrash, FaCreditCard } from "react-icons/fa";
  import {useSelector} from "react-redux";
  import {RootState} from "../../redux/store";


  interface User {
    email: string;
  }

  interface Session {
    callbacks?: any;
    user?: User;
    expires?: string;
  }

  export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
    const session = (await getServerSession<Session>(
      req,
      res,
      authOptions
    )) as Session;

    if (!session) {
      return {
        redirect: {
          destination: "/api/auth/signin",
          permanent: false,
        },
      };
    }

    const unserializedUser = await prisma.user.findUnique({
      where: {
        email: session?.user?.email,
      },
    });

    const user = {
      ...unserializedUser,
      createdAt: unserializedUser?.createdAt.toISOString(),
    };

    // Fetch sales data with product and store details
    const sales = await prisma.orderItem.findMany({
      where: {
        order: { // Traverse the relation to Order
          userId: user.id, // Filter Orders by user.id
        },
      },
      include: {
        product: true, // Include related Product details
        order: true,   // Optionally include related Order details
      },
    });

    // Serialize all dates in the sales data, including nested objects
    // const serializedSales = sales.map(sale => ({
    //   ...sale,
    //   date: sale.date.toISOString(),
    //   createdAt: sale.createdAt.toISOString(),
    //   updatedAt: sale.updatedAt.toISOString(),
    //   product: {
    //     ...sale.product,
    //     createdAt: sale.product.createdAt.toISOString(),
    //     updatedAt: sale.product.updatedAt.toISOString(),
    //   }
    // }));

    return {
      props: {
        user,
        //sales: serializedSales
      },
    };
  };

  // Updated type definition without employee
  type UserType = {
    sales: {
      id: string;
      quantity: number;
      totalPrice: number;
      status: string;
      date: string;
      product: {
        id: string;
        name: string;
        price: number;
        description?: string;
        sku: string;
      };
      store: {
        id: string;
        name: string;
        address: string;
      };
    }[];
    user: {
      stripeCustomerId: string;
      id: string;
    };
  };

  function Cart(props: UserType) {
    const cartItems = useSelector((state: RootState) => state.cart.items);
    console.log('________________', cartItems);
    const count = cartItems.reduce((total, item) => total + item.quantity, 0);

    const calculateTotal = () => {
      // @ts-ignore
      return cartItems.reduce((total, sale) => total + sale.price * sale.quantity, 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
          <Navbar />

          <div className="max-w-7xl mx-auto px-4 py-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
              <div className="flex items-center mb-8">
                <FaShoppingCart className="text-sky-600 text-3xl mr-4" />
                <h1 className="text-3xl font-bold text-gray-800">Գնումների զամբյուղ</h1>
              </div>

              {count === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl shadow-lg">
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Empty_shopping_cart_clip_art.svg" // Add your empty cart illustration
                        alt="Empty Cart"
                        className="w-48 h-48 mx-auto mb-6"
                    />
                    <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                      Ձեր զամբյուղը դատարկ է
                    </h2>
                    <p className="text-gray-500 mb-8">
                      Կարծես դուք դեռ ապրանքներ չեք ավելացրել ձեր զամբյուղում։
                    </p>
                    <a
                        href="/store"
                        className="inline-flex items-center px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Շարունակել գնումները
                    </a>
                  </div>
              ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        {cartItems.map((sale, index) => (
                            <motion.div
                                key={sale.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-center p-6 border-b border-gray-100 last:border-0"
                            >
                              <img
                                  src={sale.imageUrl || '/placeholder.png'}
                                  alt={sale.name}
                                  className="w-24 h-24 object-cover rounded-lg"
                              />

                              <div className="ml-6 flex-1">
                                <h3 className="text-lg font-semibold text-gray-800">
                                  {sale.name}
                                </h3>
                                <p className="text-gray-500 text-sm mb-2">
                                  SKU: {sale.sku}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-4">
                              <span className="text-sky-600 font-bold">
                                ${sale.price}
                              </span>
                                    <div className="flex items-center border rounded-lg">
                                      <button className="px-3 py-1 hover:bg-gray-100">-</button>
                                      <span className="px-3 py-1 border-x">{sale.quantity}</span>
                                      <button className="px-3 py-1 hover:bg-gray-100">+</button>
                                    </div>
                                  </div>
                                  <button className="text-red-500 hover:text-red-600 transition-colors"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                        ))}
                      </div>
                    </div>

                    <div className="lg:col-span-1">
                      <div className="bg-white rounded-xl shadow-lg p-6 sticky top-6">
                        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

                        <div className="space-y-3 mb-6">
                          <div className="flex justify-between text-gray-600">
                            <span>Ենթագումար</span>
                            <span>${calculateTotal()}</span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Առաքում</span>
                            <span className="text-green-600">Free</span>
                          </div>
                          <div className="border-t pt-3">
                            <div className="flex justify-between font-semibold text-lg">
                              <span>Ընդհանուր</span>
                              <span className="text-sky-600">${calculateTotal().toFixed(2)}</span>
                            </div>
                          </div>
                        </div>

                        <button className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
                          <FaCreditCard />
                          <span>Անցնել վճարման</span>
                        </button>
                      </div>
                    </div>
                  </div>
              )}
            </motion.div>
          </div>
        </div>
    );
  }

  export default Cart;