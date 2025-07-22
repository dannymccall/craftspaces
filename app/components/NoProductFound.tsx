import React from 'react'
import { FcFolder } from 'react-icons/fc'

const NoProductFound = ({children}:{children: React.ReactNode}) => {
  return (
    <div className="w-full h-screen flex flex-col gap-4 justify-center items-center text-center px-4">
       <FcFolder size={60} />
       <h1 className="text-amber-400 text-2xl font-semibold">
         No products found in this category.
       </h1>
       <p className="text-neutral-500">
         Try browsing a different category or check back later.
       </p>
       {/* Optional: 
       <button className="mt-4 px-4 py-2 bg-amber-400 text-white rounded-md">
         View All Products
       </button> 
       */}
       {children}
     </div>
  )
}

export default NoProductFound