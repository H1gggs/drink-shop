import type { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { getCsrfToken, getProviders, signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaGoogle, FaEnvelope, FaLock, FaUser } from "react-icons/fa";

function validateEmail(string: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(string);
}

export default function SignIn({
                                 providers,
                                 csrfToken,
                               }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [emailInPutError, setEmailInputError] = useState(false);
  const [passwordInPutError, setPasswordInputError] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    validate();
  }, [email, password]);

  async function handleSubmit(e: any) {
    e.preventDefault();
    let res = await signIn("credentials", {
      email,
      password,
      callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,
      redirect: false,
    });
    if (res?.ok) {
      router.push("/");
    }
  }

  async function signUp(e: any) {
    e.preventDefault();
    const res = await fetch("api/user/create", {
      method: "POST",
      body: JSON.stringify({ firstname, lastname, username, phone, email, password, address }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setIsRegistered(true);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 3000);
    }
  }

  function validate() {
    setEmailInputError(!validateEmail(email));
    setPasswordInputError(password.length < 6);
  }

  return (
      <div className="min-h-screen bg-gradient-to-b from-sky-50 to-white flex items-center justify-center px-4">
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md w-full"
        >
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 pt-8 pb-6 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-sky-500 to-blue-600 bg-clip-text text-transparent mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-500">
                {isRegistered ? "Sign in to continue" : "Create your account"}
              </p>
            </div>

            <div className="px-8 pb-8">
              {isRegistered ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                          type="email"
                          placeholder="Email address"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                          type="password"
                          placeholder="Password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Sign In
                    </button>
                  </form>
              ) : (
                  <form onSubmit={signUp} className="space-y-4">
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

                    <div className="relative">
                      <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                          type="text"
                          placeholder="firstname"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          onChange={(e) => setFirstname(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                          type="text"
                          placeholder="lastname"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          onChange={(e) => setLastname(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                          type="text"
                          placeholder="username"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                          type="text"
                          placeholder="phone number"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <FaUser className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                          type="text"
                          placeholder="address"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                          type="email"
                          placeholder="Email address"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>

                    <div className="relative">
                      <FaLock className="absolute left-3 top-3.5 text-gray-400" />
                      <input
                          type="password"
                          placeholder="Password"
                          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                          onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      Create Account
                    </button>
                  </form>
              )}

              <div className="mt-6 text-center">
                <button
                    onClick={() => setIsRegistered(!isRegistered)}
                    className="text-sky-600 hover:text-sky-700 font-medium transition-colors"
                >
                  {isRegistered ? "Need an account? Sign up" : "Already have an account? Sign in"}
                </button>
              </div>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="px-4 bg-white text-sm text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6">
                {Object.values(providers).map(
                    (provider) =>
                        provider.name === "Google" && (
                            <button
                                key={provider.name}
                                onClick={() => signIn(provider.id)}
                                className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                              <FaGoogle className="text-red-500" />
                              <span className="text-gray-700 font-medium">
                        Continue with Google
                      </span>
                            </button>
                        )
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {successMessage && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 50 }}
                className="fixed bottom-4 right-4 bg-green-500 text-white py-3 px-6 rounded-lg shadow-lg"
            >
              🎉 Account created successfully!
            </motion.div>
        )}
      </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (session) return { redirect: { destination: "/" } };

  const providers = await getProviders();
  const csrfToken = await getCsrfToken(context);

  return {
    props: { providers: providers ?? [], csrfToken },
  };
}

// import type {
//   GetServerSidePropsContext,
//   InferGetServerSidePropsType,
// } from "next";
// import { getCsrfToken, getProviders, signIn } from "next-auth/react";
// import { getServerSession } from "next-auth/next";
// import { authOptions } from "./api/auth/[...nextauth]";
// import Image from "next/image";
// import ThemeChanger from "@/components/DarkSwitch";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/router";
//
// function validateEmail(string: string) {
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(string);
// }
//
// export default function SignIn({
//   providers,
//   csrfToken,
// }: InferGetServerSidePropsType<typeof getServerSideProps>) {
//   const router = useRouter();
//   const [fullName, setFullName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [emailInPutError, setEmailInputError] = useState(false);
//   const [passwordInPutError, setPasswordInputError] = useState(false);
//   const [isRegistered, setIsRegistered] = useState(true);
//   const [successMessage, setSuccessMessage] = useState(false);
//
//   useEffect(() => {
//     validate();
//   }, [email, password]);
//
//   async function handleSubmit(e: any) {
//     e.preventDefault();
//     let res = await signIn("credentials", {
//       email,
//       password,
//       callbackUrl: `${process.env.NEXT_PUBLIC_NEXTAUTH_URL}`,
//       redirect: false,
//     });
//
//     if (res?.ok) {
//       router.push("/");
//       return;
//     } else {
//       console.log("Failed", res);
//     }
//     return res;
//   }
//
//   async function signUp(e: any) {
//     e.preventDefault();
//     let userData = {
//       fullName,
//       email,
//       password,
//     };
//
//     // Make call to backend to create user
//     const res = await fetch("api/user/create", {
//       method: "POST",
//       body: JSON.stringify(userData),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     });
//
//     if (res.ok) {
//       setIsRegistered(!isRegistered);
//       setSuccessMessage(!successMessage);
//       setTimeout(() => {
//         setSuccessMessage(false);
//       }, 3000);
//     } else {
//       console.log("Registration faled");
//     }
//   }
//
//   function validate() {
//     let emailIsValid = validateEmail(email);
//
//     if (!emailIsValid) {
//       setEmailInputError(true);
//       return;
//     }
//     if (password.length < 6) {
//       setPasswordInputError(true);
//     } else {
//       setEmailInputError(false);
//       setPasswordInputError(false);
//     }
//   }
//   return (
//     <>
//       <section className="bg-gray-50 dark:bg-gray-900 w-full h-full">
//         <div className="flex justify-end mt-12 mr-12 mb-5 bg-gray-50 dark:bg-gray-900">
//           <ThemeChanger />
//         </div>
//         <div className="flex flex-row items-center justify-between px-6 mx-auto py-0">
//           <div className="w-full md:w-2/5 mx-auto flex items-center justify-center">
//             <div className="w-full h-full bg-gray-100 border-gray-200 rounded-lg shadow border p-0 dark:bg-gray-800 dark:border-gray-700">
//               <div className="flex pt-6 pl-8 items-center justify-start text-2xl font-semibold text-gray-900 dark:text-white">
//                 <span className="text-4xl font-medium bg-gradient-to-r text-transparent bg-clip-text from-[#3F51B5] to-[#e183f5]">
//                   Hello World
//                 </span>
//               </div>
//               <div className="p-4 space-y-4 md:space-y-6 sm:p-8">
//                 <h1 className="text-xl font-medium leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
//                   Welcome!
//                 </h1>
//                 {isRegistered == true ? (
//                   <form
//                     className="space-y-4 md:space-y-6"
//                     onSubmit={handleSubmit}
//                   >
//                     <div>
//                       <input
//                         name="csrfToken"
//                         type="hidden"
//                         defaultValue={csrfToken}
//                       />
//                       <label
//                         htmlFor="email"
//                         className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
//                       >
//                         Your email
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         id="email"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                         placeholder="name@company.com"
//                         onChange={(e) => {
//                           setEmail(e.target.value);
//                         }}
//                       />
//                       <label
//                         htmlFor="password"
//                         className="block my-2 text-xs font-medium text-gray-900 dark:text-white"
//                       >
//                         Your password
//                       </label>
//                       <input
//                         id="password"
//                         type="password"
//                         placeholder="************"
//                         onChange={(e) => {
//                           setPassword(e.target.value);
//                         }}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       />
//                     </div>
//
//                     <button
//                       type="submit"
//                       className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
//                     >
//                       Sign in
//                     </button>
//                   </form>
//                 ) : (
//                   <form className="space-y-4 md:space-y-6" onSubmit={signUp}>
//                     <div>
//                       <input
//                         name="csrfToken"
//                         type="hidden"
//                         defaultValue={csrfToken}
//                       />
//                       <label
//                         htmlFor="email"
//                         className="block my-2 text-xs font-medium text-gray-900 dark:text-white"
//                       >
//                         Your Full Name
//                       </label>
//                       <input
//                         type="text"
//                         name="name"
//                         id="name"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                         placeholder="John Smith"
//                         onChange={(e) => {
//                           setFullName(e.target.value);
//                         }}
//                       />
//                       <label
//                         htmlFor="email"
//                         className="block my-2 text-xs font-medium text-gray-900 dark:text-white"
//                       >
//                         Your email
//                       </label>
//                       <input
//                         type="email"
//                         name="email"
//                         id="email"
//                         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                         placeholder="name@company.com"
//                         onChange={(e) => {
//                           setEmail(e.target.value);
//                         }}
//                       />
//                       <label
//                         htmlFor="password"
//                         className="block mb-2 text-xs font-medium text-gray-900 dark:text-white"
//                       >
//                         Your password
//                       </label>
//                       <input
//                         id="password"
//                         type="password"
//                         placeholder="************"
//                         onChange={(e) => {
//                           setPassword(e.target.value);
//                         }}
//                         className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                       />
//                     </div>
//
//                     <button
//                       type="submit"
//                       className="w-full text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
//                     >
//                       Sign Up
//                     </button>
//                   </form>
//                 )}
//                 <p onClick={() => setIsRegistered(!isRegistered)} className="cursor-pointer">
//                   {isRegistered ? "Register" : "Login"}
//                 </p>
//                 <div className="flex items-center justify-center w-full">
//                   <hr className="w-full h-px my-8 bg-gray-300 border-0 dark:bg-gray-700" />
//                   <div className="absolute flex items-center justify-center w-full">
//                     <span className="px-3 py-1 font-medium text-gray-700 bg-gray-100 dark:text-white dark:bg-gray-800">
//                       or
//                     </span>
//                   </div>
//                 </div>
//                 {Object.values(providers).map(
//                   (provider) =>
//                     provider.name == "Google" && (
//                       <div key={provider.name} className="mt-16 grid space-y-4">
//                         <button
//                           onClick={() => signIn(provider.id)}
//                           className="group relative flex h-11 items-center border rounded-full px-6 hover:bg-gray-200 dark:hover:bg-gray-700"
//                         >
//                           <span className="w-full relative flex justify-center items-center gap-3 text-base font-medium text-gray-600 dark:text-gray-200">
//                             <img
//                               src="./google.svg"
//                               className="absolute left-0 w-5"
//                               alt="google logo"
//                             />
//                             <span>Continue with {provider.name}</span>
//                           </span>
//                         </button>
//                       </div>
//                     )
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//         {successMessage && (
//           <p className="fixed bottom-4 right-4 bg-green-500 text-white py-2 px-4 rounded opacity-90 z-50">
//             <span className="font-medium">🚀 User created successfully!</span>
//           </p>
//         )}
//       </section>
//     </>
//   );
// }
// interface User {
//   // Define the properties of the user object based on your needs
//   email: string;
//   // Other properties...
// }
//
// interface Session {
//   callbacks?: any;
//   user?: User;
//   expires?: string;
//   // Other session properties...
// }
//
// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession<Session>(
//     context.req,
//     context.res,
//     authOptions
//   );
//   const csrfToken = await getCsrfToken(context);
//
//   // If the user is already logged in, redirect.
//   // Note: Make sure not to redirect to the same page
//   // To avoid an infinite loop!
//   if (session) {
//     return { redirect: { destination: "/" } };
//   }
//
//   const providers = await getProviders();
//
//   return {
//     props: { providers: providers ?? [], csrfToken },
//   };
// }
