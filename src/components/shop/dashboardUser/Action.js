import {
    getOrderByUser,
    getUserById,
    updatePassword,
    updatePersonalInformationFetch,
} from './FetchApi'

export const logout = () => {
    localStorage.removeItem('jwt')
    localStorage.removeItem('cart')
    localStorage.removeItem('wishList')
    window.location.href = '/'
}

export const fetchData = async (dispatch) => {
    dispatch({ type: 'loading', payload: true })
    let userId = JSON.parse(localStorage.getItem('jwt'))
        ? JSON.parse(localStorage.getItem('jwt')).user.user_id
        : ''
    try {
        let responseData = await getUserById(userId)
        console.log(responseData)
        setTimeout(() => {
            if (responseData && responseData.User) {
                dispatch({ type: 'userDetails', payload: responseData.User[0] })
                dispatch({ type: 'loading', payload: false })
            }
        }, 500)
    } catch (error) {
        console.log(error)
    }
}

export const fetchOrderByUser = async (dispatch) => {
    dispatch({ type: 'loading', payload: true })
    let userId = JSON.parse(localStorage.getItem('jwt'))
        ? JSON.parse(localStorage.getItem('jwt')).user.user_id
        : ''
    try {
        let responseData = await getOrderByUser(userId)
        setTimeout(() => {
            if (responseData && responseData.Order) {
                console.log(responseData)
                dispatch({ type: 'OrderByUser', payload: responseData.Order })
                dispatch({ type: 'loading', payload: false })
            }
        }, 500)
    } catch (error) {
        console.log(error)
    }
}

export const updatePersonalInformationAction = async (dispatch, fData) => {
    const formData = {
        user_id: fData.id,
        name: fData.name,
        phone_number: fData.phone,
    }
    dispatch({ type: 'loading', payload: true })
    try {
        let responseData = await updatePersonalInformationFetch(formData)
        setTimeout(() => {
            if (responseData && responseData.success) {
                dispatch({ type: 'loading', payload: false })
                fetchData(dispatch)
            }
        }, 500)
    } catch (error) {
        console.log(error)
    }
}

export const handleChangePassword = async (fData, setFdata, dispatch) => {
    if (!fData.newPassword || !fData.oldPassword || !fData.confirmPassword) {
        setFdata({
            ...fData,
            error: 'Please provide your all password and a new password',
        })
    } else if (fData.newPassword !== fData.confirmPassword) {
        setFdata({ ...fData, error: "Password does't match" })
    } else {
        const formData = {
            user_id: JSON.parse(localStorage.getItem('jwt')).user.user_id,
            oldPassword: fData.oldPassword,
            newPassword: fData.newPassword,
        }
        dispatch({ type: 'loading', payload: true })
        try {
            let responseData = await updatePassword(formData)
            if (responseData && responseData.success) {
                setFdata({
                    ...fData,
                    success: responseData.success,
                    error: '',
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                })
                dispatch({ type: 'loading', payload: false })
            } else if (responseData.error) {
                dispatch({ type: 'loading', payload: false })
                setFdata({
                    ...fData,
                    error: responseData.error,
                    success: '',
                    oldPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                })
            }
        } catch (error) {
            console.log(error)
        }
    }
}
