import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isWish, isWishReq, unWishReq } from '../home/Mixins'
import { LayoutContext } from '../layout'
import { cartListProduct } from '../partials/FetchApi'
import { totalCost } from '../partials/Mixins'
import { getSingleProduct } from './FetchApi'
import { ProductDetailsContext } from './index'
import { addToCart, cartList, updateQuantity } from './Mixins'
import ProductDetailsSectionTwo from './ProductDetailsSectionTwo'
import Submenu from './Submenu'

const apiURL = process.env.REACT_APP_API_URL

const ProductDetailsSection = (props) => {
    let { id } = useParams()

    const { data, dispatch } = useContext(ProductDetailsContext)
    const { data: layoutData, dispatch: layoutDispatch } = useContext(
        LayoutContext
    ) // Layout Context

    const sProduct = layoutData.singleProductDetail
    const [, setPimages] = useState(null)

    const [quantity, setQuantity] = useState(1) // Increse and decrese quantity state
    const [, setAlertq] = useState(false) // Alert when quantity greater than stock

    const [wList, setWlist] = useState(
        JSON.parse(localStorage.getItem('wishList'))
    ) // Wishlist State Control

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        dispatch({ type: 'loading', payload: true })
        try {
            let responseData = await getSingleProduct(id)
            setTimeout(() => {
                if (responseData.Product) {
                    layoutDispatch({
                        type: 'singleProductDetail',
                        payload: responseData.Product,
                    }) // Dispatch in layout context
                    setPimages(responseData.Product.pImage)
                    dispatch({ type: 'loading', payload: false })
                    layoutDispatch({ type: 'inCart', payload: cartList() }) // This function change cart in cart state
                }
                if (responseData.error) {
                    console.log(responseData.error)
                }
            }, 500)
        } catch (error) {
            console.log(error)
        }
        fetchCartProduct() // Updating cart total
    }

    const fetchCartProduct = async () => {
        try {
            let responseData = await cartListProduct()
            if (responseData && responseData.Products) {
                layoutDispatch({
                    type: 'cartProduct',
                    payload: responseData.Products,
                }) // Layout context Cartproduct fetch and dispatch
            }
        } catch (error) {
            console.log(error)
        }
    }

    if (data.loading) {
        return (
            <div className="flex items-center justify-center h-screen col-span-2 md:col-span-3 lg:col-span-4">
                <svg
                    className="w-12 h-12 text-gray-600 animate-spin"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    ></path>
                </svg>
            </div>
        )
    } else if (!sProduct) {
        return <div>No product</div>
    }
    return (
        <Fragment>
            <Submenu
                value={{
                    categoryId: sProduct.category_id,
                    product: sProduct.pName,
                    category: sProduct.pCategory.cName,
                }}
            />
            <section className="m-4 md:mx-12 md:my-6">
                <div className="grid grid-cols-2 md:grid-cols-12">
                    <div className="col-span-2 md:col-span-7">
                        <div className="relative">
                            <img
                                className="w-full h-auto mx-50"
                                src={`${apiURL}/uploads/products/${sProduct.pImage}`}
                                alt="Pic"
                            />
                        </div>
                    </div>
                    <div className="col-span-2 mt-8 md:mt-0 md:col-span-4 md:ml-6 lg:ml-12">
                        <div className="flex flex-col leading-8">
                            <div className="text-2xl tracking-wider">
                                {sProduct.pName}
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xl tracking-wider text-yellow-700">
                                    ${sProduct.pPrice}.00
                                </span>
                                <span>
                                    <svg
                                        onClick={(e) =>
                                            isWishReq(
                                                e,
                                                sProduct.product_id,
                                                setWlist
                                            )
                                        }
                                        className={`${
                                            isWish(
                                                sProduct.product_id,
                                                wList
                                            ) && 'hidden'
                                        } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700`}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                        />
                                    </svg>
                                    <svg
                                        onClick={(e) =>
                                            unWishReq(
                                                e,
                                                sProduct.product_id,
                                                setWlist
                                            )
                                        }
                                        className={`${
                                            !isWish(
                                                sProduct.product_id,
                                                wList
                                            ) && 'hidden'
                                        } w-5 h-5 md:w-6 md:h-6 cursor-pointer text-yellow-700`}
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="my-4 text-gray-600 md:my-6">
                            {sProduct.pDescription}
                        </div>
                        <div className="my-4 md:my-6">
                            {quantity === sProduct.pQuantity ? (
                                <span className="text-xs text-red-500">
                                    Stock limited
                                </span>
                            ) : (
                                ''
                            )}
                            <div
                                className={`flex justify-between items-center px-4 py-2 border ${
                                    quantity === sProduct.pQuantity &&
                                    'border-red-500'
                                }`}
                            >
                                <div
                                    className={`${
                                        quantity === sProduct.pQuantity &&
                                        'text-red-500'
                                    }`}
                                >
                                    Quantity
                                </div>
                                {/* Quantity Button */}
                                {sProduct.pQuantity !== 0 ? (
                                    <Fragment>
                                        {layoutData.inCart == null ||
                                        (layoutData.inCart !== null &&
                                            layoutData.inCart.includes(
                                                sProduct.product_id
                                            ) === false) ? (
                                            <div className="flex items-center space-x-2">
                                                <span
                                                    onClick={(e) =>
                                                        updateQuantity(
                                                            'decrease',
                                                            sProduct.pQuantity,
                                                            quantity,
                                                            setQuantity,
                                                            setAlertq
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        className="w-5 h-5 cursor-pointer fill-current"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="font-semibold">
                                                    {quantity}
                                                </span>
                                                <span
                                                    onClick={(e) =>
                                                        updateQuantity(
                                                            'increase',
                                                            sProduct.pQuantity,
                                                            quantity,
                                                            setQuantity,
                                                            setAlertq
                                                        )
                                                    }
                                                >
                                                    <svg
                                                        className="w-5 h-5 cursor-pointer fill-current"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                <span>
                                                    <svg
                                                        className="w-5 h-5 cursor-not-allowed fill-current"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                                <span className="font-semibold">
                                                    {quantity}
                                                </span>
                                                <span>
                                                    <svg
                                                        className="w-5 h-5 cursor-not-allowed fill-current"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </span>
                                            </div>
                                        )}
                                    </Fragment>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <span>
                                            <svg
                                                className="w-5 h-5 cursor-not-allowed fill-current"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                        <span className="font-semibold">
                                            {quantity}
                                        </span>
                                        <span>
                                            <svg
                                                className="w-5 h-5 cursor-not-allowed fill-current"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    </div>
                                )}
                                {/* Quantity Button End */}
                            </div>
                            {/* Incart and out of stock button */}
                            {sProduct.pQuantity !== 0 ? (
                                <Fragment>
                                    {layoutData.inCart !== null &&
                                    layoutData.inCart.includes(
                                        sProduct.product_id
                                    ) === true ? (
                                        <div
                                            style={{ background: '#303031' }}
                                            className={`px-4 py-2 text-white text-center cursor-not-allowed uppercase opacity-75`}
                                        >
                                            In cart
                                        </div>
                                    ) : (
                                        <div
                                            onClick={(e) =>
                                                addToCart(
                                                    sProduct.product_id,
                                                    quantity,
                                                    sProduct.pPrice,
                                                    layoutDispatch,
                                                    setQuantity,
                                                    setAlertq,
                                                    fetchData,
                                                    totalCost
                                                )
                                            }
                                            style={{ background: '#303031' }}
                                            className={`px-4 py-2 text-white text-center cursor-pointer uppercase`}
                                        >
                                            Add to cart
                                        </div>
                                    )}
                                </Fragment>
                            ) : (
                                <Fragment>
                                    {layoutData.inCart !== null &&
                                    layoutData.inCart.includes(
                                        sProduct.product_id
                                    ) === true ? (
                                        <div
                                            style={{ background: '#303031' }}
                                            className={`px-4 py-2 text-white text-center cursor-not-allowed uppercase opacity-75`}
                                        >
                                            In cart
                                        </div>
                                    ) : (
                                        <div
                                            style={{ background: '#303031' }}
                                            disabled={true}
                                            className="px-4 py-2 text-center text-white uppercase opacity-50 cursor-not-allowed"
                                        >
                                            Out of stock
                                        </div>
                                    )}
                                </Fragment>
                            )}
                            {/* Incart and out of stock button End */}
                        </div>
                    </div>
                </div>
            </section>
            {/* Product Details Section two */}
            <ProductDetailsSectionTwo />
        </Fragment>
    )
}

export default ProductDetailsSection
