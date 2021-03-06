import React, { Fragment, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { getAllCategory } from '../../admin/categories/FetchApi'
import { getAllProduct, productByPrice } from '../../admin/products/FetchApi'
import { HomeContext } from './index'
import './style.css'

const apiURL = process.env.REACT_APP_API_URL

const CategoryList = () => {
    const history = useHistory()
    const { data } = useContext(HomeContext)
    const [categories, setCategories] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            let responseData = await getAllCategory()
            if (responseData && responseData.Categories) {
                setCategories(responseData.Categories)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div
            className={`${
                data.categoryListDropdown ? '' : 'hidden'
            } my-4 bg-gray-700 bg-opacity-5 border-gray-300	rounded shadow	`}
        >
            <hr />
            <div className="grid grid-cols-2 py-1 bg-gray-300 border-gray-700 rounded shadow md:grid-cols-3 lg:grid-cols-4 bg-opacity-5 ">
                {categories && categories.length > 0 ? (
                    categories.map((item, index) => {
                        return (
                            <Fragment key={index}>
                                <div
                                    onClick={(e) =>
                                        history.push(
                                            `/products/category/${item.category_id}`
                                        )
                                    }
                                    className="flex flex-col items-center justify-center col-span-1 m-2 space-y-2 cursor-pointer"
                                >
                                    <img
                                        src={`${apiURL}/uploads/categories/${item.cImage}`}
                                        alt="pic"
                                    />
                                    <div className="font-medium">
                                        {item.cName}
                                    </div>
                                </div>
                            </Fragment>
                        )
                    })
                ) : (
                    <div className="my-4 text-xl text-center">No Category</div>
                )}
            </div>
        </div>
    )
}

const FilterList = () => {
    const { data, dispatch } = useContext(HomeContext)
    const [range, setRange] = useState(0)

    const rangeHandle = (e) => {
        setRange(e.target.value)
        fetchData(e.target.value)
    }

    const fetchData = async (price) => {
        if (price === 'all') {
            try {
                let responseData = await getAllProduct()
                if (responseData && responseData.Products) {
                    dispatch({
                        type: 'setProducts',
                        payload: responseData.Products,
                    })
                }
            } catch (error) {
                console.log(error)
            }
        } else {
            dispatch({ type: 'loading', payload: true })
            try {
                setTimeout(async () => {
                    let responseData = await productByPrice(price)
                    if (responseData && responseData.Products) {
                        console.log(responseData.Products)
                        dispatch({
                            type: 'setProducts',
                            payload: responseData.Products,
                        })
                        dispatch({ type: 'loading', payload: false })
                    }
                }, 700)
            } catch (error) {
                console.log(error)
            }
        }
    }

    const closeFilterBar = () => {
        fetchData('all')
        dispatch({
            type: 'filterListDropdown',
            payload: !data.filterListDropdown,
        })
        setRange(0)
    }

    return (
        <div className={`${data.filterListDropdown ? '' : 'hidden'} my-4`}>
            <hr />
            <div className="flex flex-col w-full">
                <div className="py-2 font-medium">Filter by price</div>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col w-2/3 space-y-2 lg:w-2/4">
                        <label htmlFor="points" className="text-sm">
                            Price (between 0 and 10$):{' '}
                            <span className="font-semibold text-yellow-700">
                                {range}.00$
                            </span>{' '}
                        </label>
                        <input
                            value={range}
                            className="slider"
                            type="range"
                            id="points"
                            min="0"
                            max="1000"
                            step="10"
                            onChange={(e) => rangeHandle(e)}
                        />
                    </div>
                    <div
                        onClick={(e) => closeFilterBar()}
                        className="cursor-pointer"
                    >
                        <svg
                            className="w-8 h-8 p-1 text-gray-700 rounded-full hover:bg-gray-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    )
}

const Search = () => {
    const { data, dispatch } = useContext(HomeContext)
    const [search, setSearch] = useState('')
    const [productArray, setPa] = useState(null)

    const searchHandle = (e) => {
        setSearch(e.target.value)
        fetchData()
        dispatch({
            type: 'searchHandleInReducer',
            payload: e.target.value,
            productArray: productArray,
        })
    }

    const fetchData = async () => {
        dispatch({ type: 'loading', payload: true })
        try {
            setTimeout(async () => {
                let responseData = await getAllProduct()
                if (responseData && responseData.Products) {
                    setPa(responseData.Products)
                    dispatch({ type: 'loading', payload: false })
                }
            }, 700)
        } catch (error) {
            console.log(error)
        }
    }

    const closeSearchBar = () => {
        dispatch({ type: 'searchDropdown', payload: !data.searchDropdown })
        fetchData()
        dispatch({ type: 'setProducts', payload: productArray })
        setSearch('')
    }

    return (
        <div
            className={`${
                data.searchDropdown ? '' : 'hidden'
            } my-4 flex items-center justify-between`}
        >
            <input
                value={search}
                onChange={(e) => searchHandle(e)}
                className="px-4 py-4 text-xl focus:outline-none"
                type="text"
                placeholder="Search products..."
            />
            <div onClick={(e) => closeSearchBar()} className="cursor-pointer">
                <svg
                    className="w-8 h-8 p-1 text-gray-700 rounded-full hover:bg-gray-200"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                    />
                </svg>
            </div>
        </div>
    )
}

const ProductCategoryDropdown = (props) => {
    return (
        <Fragment>
            <CategoryList />
            <FilterList />
            <Search />
        </Fragment>
    )
}

export default ProductCategoryDropdown
