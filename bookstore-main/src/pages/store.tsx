import React, { useState, useEffect } from 'react';
import Navbar from "@/components/navbar";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/slices/cartSlice";
import { FaStar, FaShippingFast, FaHeart } from 'react-icons/fa';
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
    stock: number;
    sku: string
};

const Store: React.FC = () => {
    const dispatch = useDispatch();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts(data.map((product: Product) => ({
                ...product,
                quantity: 0
            })));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load products');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <>
                <Navbar />
                <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-sky-50 to-white">
                    <div className="animate-pulse space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                            {[...Array(8)].map((_, index) => (
                                <div key={index} className="bg-white rounded-xl shadow-lg p-4 w-72">
                                    <div className="w-full h-72 bg-sky-100 rounded-lg mb-4" />
                                    <div className="h-4 bg-sky-100 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-sky-100 rounded w-1/2" />
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
            <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <h1 className="text-4xl font-bold text-sky-900 mb-8 text-center">
                        Մեր արտադրանքը
                    </h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {products.map((product: Product) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
                                onMouseEnter={() => setHoveredId(product.id)}
                                onMouseLeave={() => setHoveredId(null)}
                            >
                                <div className="relative overflow-hidden rounded-t-xl">
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-72 object-cover transform transition-transform duration-300 hover:scale-110"
                                    />
                                    <button className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-all">
                                        <FaHeart className="text-sky-400 hover:text-sky-600" />
                                    </button>
                                </div>

                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-800 mb-2 line-clamp-2">
                                        {product.name}
                                    </h2>

                                    <div className="flex items-center mb-3">
                                        {[...Array(5)].map((_, index) => (
                                            <FaStar key={index} className="text-yellow-400 w-4 h-4" />
                                        ))}
                                        <span className="ml-2 text-gray-600 text-sm">(4.8)</span>
                                    </div>

                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-2xl font-bold text-sky-600">
                                            ${product.price}
                                        </span>
                                        <div className="flex items-center text-green-600 text-sm">
                                            <FaShippingFast className="mr-1" />
                                            Անվճար առաքում
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => dispatch(addItem(product))}
                                        className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                                    >
                                        <span>Ավելացնել զամբյուղում</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Store;


// import React, { useState, useEffect } from 'react';
// import Navbar from "@/components/navbar";
// import { useDispatch } from "react-redux";
// import { addItem } from "../../redux/slices/cartSlice";
// import { FaStar } from 'react-icons/fa';
// import { FaShippingFast } from 'react-icons/fa';
//
// interface User {
//     email: string;
// }
//
// interface Session {
//     callbacks?: any;
//     user?: User;
//     expires?: string;
// }
//
// type Product = {
//     id: number;
//     name: string;
//     price: string;
//     image?: string;
//     quantity: number;
//     sku: string
// };
//
// const Store: React.FC = () => {
//     const dispatch = useDispatch();
//     const [products, setProducts] = useState<Product[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);
//
//     useEffect(() => {
//         fetchProducts();
//     }, []);
//
//     const fetchProducts = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch('/api/products'); // Your API endpoint
//             if (!response.ok) {
//                 throw new Error('Failed to fetch products');
//             }
//             const data = await response.json();
//             setProducts(data.map((product: Product) => ({
//                 ...product,
//                 quantity: 0
//             })));
//         } catch (err) {
//             setError(err instanceof Error ? err.message : 'Failed to load products');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     if (loading) {
//         return (
//             <>
//                 <Navbar />
//                 <div className="flex justify-center items-center min-h-screen bg-gray-100">
//                     <div className="animate-pulse space-y-4">
//                         <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
//                             {[...Array(10)].map((_, index) => (
//                                 <div key={index} className="bg-white rounded-lg shadow-md p-4 w-64">
//                                     <div className="w-full h-64 bg-gray-300 rounded-md mb-4" />
//                                     <div className="h-4 bg-gray-300 rounded w-3/4 mb-2" />
//                                     <div className="h-4 bg-gray-300 rounded w-1/2" />
//                                 </div>
//                             ))}
//                         </div>
//                     </div>
//                 </div>
//             </>
//         );
//     }
//
//     console.log(products, "products")
//
//     return (
//         <>
//             <Navbar />
//             <div className="flex flex-row bg-gray-100 min-h-screen">
//                 <div className="w-full p-6">
//                     <div className="w-full grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
//                         {products.map((product: Product) => (
//                             <div
//                                 key={product.id}
//                                 className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
//                             >
//                                 <div className="relative group">
//                                     <img
//                                         src={product.image}
//                                         alt={product.name}
//                                         className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
//                                         loading="lazy"
//                                     />
//                                 </div>
//
//                                 <div className="p-4">
//                                     <h2 className="text-xl font-medium text-gray-800 mb-2 line-clamp-2">
//                                         {product.name}
//                                     </h2>
//
//                                     <div className="flex items-center mb-2">
//                                         {[...Array(5)].map((_, index) => (
//                                             <FaStar key={index} className="text-yellow-400" />
//                                         ))}
//                                     </div>
//
//                                     <div className="flex items-center mb-3">
//                     <span className="text-2xl font-bold text-gray-900">
//                       ${product.price}
//                     </span>
//                                     </div>
//
//                                     <div className="space-y-2">
//                                         <button
//                                             onClick={() => dispatch(addItem(product))}
//                                             className="w-full py-2 bg-indigo-400 hover:bg-indigo-500 text-white font-medium rounded-md transition-colors duration-200"
//                                         >
//                                             Add to Cart
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };
//
// export default Store;
