import React, { useState, useEffect } from 'react';
import Navbar from "@/components/navbar";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/slices/cartSlice";
import { FaStar, FaArrowRight, FaBook, FaShippingFast, FaCreditCard } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface User {
  email: string;
}

interface Session {
  callbacks?: any;
  user?: User;
  expires?: string;
}

type Product = {
  id: number;
  name: string;
  price: string;
  imageUrl?: string;
  sku: string
};

const Home: React.FC = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data.map((product: Product) => ({
        ...product,
        quantity: 0
      })));
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: <FaBook className="w-8 h-8" />,
      title: "Ընդարձակ Հավաքածու",
      description: "Բացահայտեք հազարավոր խմիչքներ բոլոր տեսակներից"
    },
    {
      icon: <FaShippingFast className="w-8 h-8" />,
      title: "Արագ Առաքում",
      description: "Անվճար առաքում 50$-ից բարձր պատվերների համար"
    },
    {
      icon: <FaCreditCard className="w-8 h-8" />,
      title: "Անվտանգ Վճարում",
      description: "Ապահով և հուսալի վճարման մեթոդներ"
    }
  ];

  if (loading) {
    return (
        <>
          <Navbar />
          <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-sky-50 to-white">
            <div className="animate-pulse space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[...Array(10)].map((_, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-md p-4 w-64">
                        <div className="w-full h-64 bg-gray-300 rounded-md mb-4" />
                        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
                        <div className="h-4 bg-gray-300 rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </>
    );
  }

  return (
      <>
        <Navbar />
        <div className="bg-gradient-to-b from-sky-50 to-white min-h-screen">
          {/* Hero Section */}
          <div className="relative h-[600px] overflow-hidden">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0"
            >
              <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8C1WZ5uUBWMp5009A6y5IGDuBK2A1MmUg9g&s"
                  className="w-full h-full object-cover filter brightness-50"
              />
            </motion.div>

            <div className="absolute inset-0 bg-gradient-to-r from-sky-900/50 to-transparent">
              <div className="max-w-7xl mx-auto px-4 h-full flex items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="max-w-2xl"
                >
                  <h1 className="text-5xl font-bold text-white mb-6">
                    Բարի գալուստ Drink Shop
                  </h1>
                  <p className="text-xl text-sky-100 mb-8">
                    Բացահայտեք ձեր հաջորդ սիրելի ըմպելիքը մեր բարձրորակ և թարմ տեսականուց
                  </p>
                  <button className="px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
                    <span>
                      <a href="/store">Հետազոտել հավաքածուն</a>
                      </span>
                    <FaArrowRight/>
                  </button>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                  <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                      className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="text-sky-500 mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </motion.div>
              ))}
            </div>
          </div>

          {/* Featured Books Section */}
          <div className="max-w-7xl mx-auto px-4 py-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-8">Ընտրված ըմպելիքներ</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {products.slice(0, 4).map((product, index) => (
                  <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-64 object-cover"
                    />
                    <div className="p-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        {product.name}
                      </h3>
                      <div className="flex items-center justify-between">
                        <span className="text-sky-600 font-bold">${product.price}</span>
                        <button
                            onClick={() => dispatch(addItem(product))}
                            className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors duration-200"
                        >
                          Ավելացնել
                        </button>
                      </div>
                    </div>
                  </motion.div>
              ))}
            </div>
          </div>

          {/* Newsletter Section */}
          <div className="bg-sky-900 py-16">
            <div className="max-w-7xl mx-auto px-4">
              <div className="text-center">
                <h2 className="text-3xl font-bold text-white mb-4">
                  Մնացեք արդիական
                </h2>
                <p className="text-sky-100 mb-8">
                  Բաժանորդագրվեք մեր տեղեկագրին՝ բացառիկ առաջարկների մասին տեղեկանալու համար
                </p>
                <div className="max-w-md mx-auto flex">
                  <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <button className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-r-lg transition-colors duration-200">
                    Բաժանորդագրվել
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
  );
};

export default Home;



// import React, { useState, useEffect } from 'react';
// import Navbar from "@/components/navbar";
// import { useDispatch } from "react-redux";
// import { addItem } from "../../redux/slices/cartSlice";
// import { FaStar } from 'react-icons/fa';
//
// interface User {
//   email: string;
// }
//
// interface Session {
//   callbacks?: any;
//   user?: User;
//   expires?: string;
// }
//
// type Product = {
//   id: number;
//   name: string;
//   price: string;
//   image?: string;
//   quantity: number;
//   sku: string
// };
//
// const Home: React.FC = () => {
//   const dispatch = useDispatch();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//
//   useEffect(() => {
//     fetchProducts();
//   }, []);
//
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/products'); // Your API endpoint
//       if (!response.ok) {
//         throw new Error('Failed to fetch products');
//       }
//       const data = await response.json();
//       setProducts(data.map((product: Product) => ({
//         ...product,
//         quantity: 0
//       })));
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   if (loading) {
//     return (
//         <>
//           <Navbar />
//           <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <div className="animate-pulse space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
//                 {[...Array(10)].map((_, index) => (
//                     <div key={index} className="bg-white rounded-lg shadow-md p-4 w-64">
//                       <div className="w-full h-64 bg-gray-300 rounded-md mb-4" />
//                       <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
//                       <div className="h-4 bg-gray-300 rounded w-1/2" />
//                     </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </>
//     );
//   }
//
//   return (
//       <>
//         <Navbar />
//         <div className="relative">
//           <img
//               src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/66/El_Ateneo_Bookstore.jpg/1920px-El_Ateneo_Bookstore.jpg"
//               alt="Large Banner"
//               className="w-full object-cover"
//           />
//           <div className="absolute inset-0 flex items-center justify-center">
//             <h1 className="text-4xl font-bold text-white">Welcome to Arm BookStore</h1>
//           </div>
//         </div>
//       </>
//   );
// };
//
// export default Home;
























































// import React, { useState, useEffect } from 'react';
// import Navbar from "@/components/navbar";
// import { useDispatch } from "react-redux";
// import { addItem } from "../../redux/slices/cartSlice";
// import { FaStar } from 'react-icons/fa';
// import { FaShippingFast } from 'react-icons/fa';
//
// interface User {
//   email: string;
// }
//
// interface Session {
//   callbacks?: any;
//   user?: User;
//   expires?: string;
// }
//
// type Product = {
//   id: number;
//   name: string;
//   price: string;
//   image?: string;
//   quantity: number;
//   sku: string
// };
//
// const Home: React.FC = () => {
//   const dispatch = useDispatch();
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//
//   useEffect(() => {
//     fetchProducts();
//   }, []);
//
//   const fetchProducts = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('/api/products'); // Your API endpoint
//       if (!response.ok) {
//         throw new Error('Failed to fetch products');
//       }
//       const data = await response.json();
//       setProducts(data.map((product: Product) => ({
//         ...product,
//         quantity: 0
//       })));
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Failed to load products');
//     } finally {
//       setLoading(false);
//     }
//   };
//
//   if (loading) {
//     return (
//         <>
//           <Navbar />
//           <div className="flex justify-center items-center min-h-screen bg-gray-100">
//             <div className="animate-pulse space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
//                 {[...Array(10)].map((_, index) => (
//                     <div key={index} className="bg-white rounded-lg shadow-md p-4 w-64">
//                       <div className="w-full h-64 bg-gray-300 rounded-md mb-4" />
//                       <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
//                       <div className="h-4 bg-gray-300 rounded w-1/2" />
//                     </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </>
//     );
//   }
//
//   console.log(products, "products")
//
//   return (
//       <>
//         <Navbar />
//         <div className="flex flex-row bg-gray-100 min-h-screen">
//           <div className="w-full p-6">
//             <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
//               {products.map((product: Product) => (
//                   <div
//                       key={product.id}
//                       className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
//                   >
//                     <div className="relative group">
//                       <img
//                           src={product.image}
//                           alt={product.name}
//                           className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
//                           loading="lazy"
//                       />
//                     </div>
//
//                     <div className="p-4">
//                       <h2 className="text-xl font-medium text-gray-800 mb-2 line-clamp-2">
//                         {product.name}
//                       </h2>
//
//                       <div className="flex items-center mb-2">
//                         {[...Array(5)].map((_, index) => (
//                             <FaStar key={index} className="text-yellow-400" />
//                         ))}
//                       </div>
//
//                       <div className="flex items-center mb-3">
//                     <span className="text-2xl font-bold text-gray-900">
//                       ${product.price}
//                     </span>
//                       </div>
//
//                       <div className="space-y-2">
//                         <button
//                             onClick={() => dispatch(addItem(product))}
//                             className="w-full py-2 bg-indigo-400 hover:bg-indigo-500 text-white font-medium rounded-md transition-colors duration-200"
//                         >
//                           Add to Cart
//                         </button>
//                       </div>
//                     </div>
//                   </div>
//               ))}
//             </div>
//           </div>
//         </div>
//       </>
//   );
// };
//
// export default Home;
