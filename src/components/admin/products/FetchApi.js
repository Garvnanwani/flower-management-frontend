import axios from 'axios'
const apiURL = process.env.REACT_APP_API_URL

export const getAllProduct = async () => {
    try {
        let res = await axios.get(`${apiURL}/api/product/all-product`)
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const createPorductImage = async ({ pImage }) => {
    /* Most important part for uploading multiple image  */
    let formData = new FormData()
    for (const file of pImage) {
        formData.append('pImage', file)
    }
    /* Most important part for uploading multiple image  */
}

export const createProduct = async ({
    pName,
    pDescription,
    pImage,
    pStatus,
    pCategory,
    pQuantity,
    pPrice,
    pOffer,
}) => {
    /* Most important part for uploading multiple image  */
    let formData = new FormData()
    for (const file of pImage) {
        formData.append('pImage', file)
    }
    /* Most important part for uploading multiple image  */
    formData.append('pName', pName)
    formData.append('pDescription', pDescription)
    formData.append('pStatus', pStatus)
    formData.append('pCategory', pCategory)
    formData.append('pQuantity', pQuantity)
    formData.append('pPrice', pPrice)
    formData.append('pOffer', pOffer)

    try {
        let res = await axios.post(
            `${apiURL}/api/product/add-product`,
            formData
        )
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const editProduct = async (product) => {
    console.log(product)
    /* Most important part for updating multiple image  */
    let formData = new FormData()
    if (product.pEditImage) {
        for (const file of product.pEditImage) {
            formData.append('pImapEditImagege', file)
        }
    }
    /* Most important part for updating multiple image  */
    formData.append('product_id', product.product_id)
    formData.append('pName', product.pName)
    formData.append('pDescription', product.pDescription)
    formData.append('pStatus', product.pStatus)
    formData.append('pCategory', product.pCategory)
    formData.append('pQuantity', product.pQuantity)
    formData.append('pPrice', product.pPrice)

    try {
        let res = await axios.post(
            `${apiURL}/api/product/edit-product`,
            formData
        )
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct = async (product_id) => {
    try {
        let res = await axios.post(`${apiURL}/api/product/delete-product`, {
            product_id,
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const productByCategory = async (category_id) => {
    try {
        let res = await axios.post(
            `${apiURL}/api/product/product-by-category`,
            {
                category_id,
            }
        )
        return res.data
    } catch (error) {
        console.log(error)
    }
}

export const productByPrice = async (price) => {
    try {
        let res = await axios.post(`${apiURL}/api/product/product-by-price`, {
            price,
        })
        return res.data
    } catch (error) {
        console.log(error)
    }
}
